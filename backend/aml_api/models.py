from django.db import models
from django.contrib.auth.models import User
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from decimal import Decimal

# --------------------------
# Rule Configuration Model
# --------------------------
class RuleConfiguration(models.Model):
    RULE_CATEGORIES = [
        ('behavioral', 'Behavioral / Peer'),
        ('network', 'Network / Relationship'),
        ('temporal', 'Temporal / Time-based'),
        ('ml', 'Machine Learning / Anomaly'),
    ]

    OPERATORS = [
        (">", "Greater Than"),
        (">=", "Greater Than or Equal"),
        ("<", "Less Than"),
        ("<=", "Less Than or Equal"),
        ("==", "Equals"),
        ("!=", "Not Equals"),
        ("contains", "Contains Text"),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=RULE_CATEGORIES, default='behavioral')
    field = models.CharField(max_length=100, help_text="Field in Transaction model (e.g., amount, description)")
    operator = models.CharField(max_length=10, choices=OPERATORS, default=">=")
    value = models.CharField(max_length=100, help_text="Value to compare against")
    risk_points = models.FloatField(default=0.0)
    active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({'Active' if self.active else 'Inactive'})"


# --------------------------
# Transaction Model
# --------------------------
class Transaction(models.Model):
    STATUS_CHOICES = [
        ('normal', 'Normal'),
        ('suspicious', 'Suspicious'),
        ('flagged', 'Flagged'),
    ]

    id = models.CharField(max_length=100, primary_key=True, unique=True)
    date = models.DateField()
    from_account = models.CharField(max_length=200)
    to_account = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()
    risk_score = models.FloatField(default=0.0)
    flags = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='normal')
    alert_details = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Transaction {self.id} - {self.amount}"

    def save(self, *args, **kwargs):
        """
        Save the transaction and calculate AML risk.
        """
        super().save(*args, **kwargs)
        self.perform_aml_analysis()

    def perform_aml_analysis(self):
        """
        Evaluate all active RuleConfiguration rules and calculate risk score.
        Ensures all JSON data is serializable.
        """
        self.risk_score = 0.0
        self.flags = []
        contributions = []

        for rule in RuleConfiguration.objects.filter(active=True):
            tx_value = getattr(self, rule.field, None)
            if tx_value is None:
                continue

            triggered = False
            try:
                # Convert rule.value to number if possible
                value = float(rule.value) if str(rule.value).replace('.', '', 1).isdigit() else rule.value
            except Exception:
                value = rule.value

            # Evaluate operator
            if rule.operator == ">=" and tx_value >= value:
                triggered = True
            elif rule.operator == ">" and tx_value > value:
                triggered = True
            elif rule.operator == "<=" and tx_value <= value:
                triggered = True
            elif rule.operator == "<" and tx_value < value:
                triggered = True
            elif rule.operator == "==" and tx_value == value:
                triggered = True
            elif rule.operator == "!=" and tx_value != value:
                triggered = True
            elif rule.operator == "contains" and str(value).lower() in str(tx_value).lower():
                triggered = True

            if triggered:
                self.risk_score += rule.risk_points
                self.flags.append(rule.name)

                # Ensure JSON serializable
                json_value = float(tx_value) if isinstance(tx_value, Decimal) else tx_value

                contributions.append({
                    "rule": rule.name,
                    "category": rule.category,
                    "risk_points": rule.risk_points,
                    "value": json_value,
                    "condition": {
                        "field": rule.field,
                        "operator": rule.operator,
                        "value": rule.value
                    }
                })

        # Determine status
        if self.risk_score >= 70:
            self.status = 'flagged'
        elif self.risk_score >= 40:
            self.status = 'suspicious'
        else:
            self.status = 'normal'

        # Cap risk score at 100
        self.risk_score = min(self.risk_score, 100.0)

        # Save audit trail
        self.alert_details = {
            "contributions": contributions,
            "total_risk_score": float(self.risk_score)  # Ensure float
        }

        # Update only the fields that changed
        super().save(update_fields=['risk_score', 'flags', 'status', 'alert_details'])

        # Broadcast via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "transactions_group",
            {
                "type": "send_transaction",
                "transaction": {
                    "id": self.id,
                    "date": str(self.date),
                    "from_account": self.from_account,
                    "to_account": self.to_account,
                    "amount": float(self.amount),
                    "description": self.description,
                    "risk_score": float(self.risk_score),
                    "status": self.status,
                    "flags": self.flags,
                    "alert_details": self.alert_details,
                },
            },
        )
