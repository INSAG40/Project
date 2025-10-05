from django.db import models
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import random

# ----- RULE CONFIGURATION -----
class RuleConfiguration(models.Model):
    RULE_CATEGORIES = [
        ('behavioral', 'Behavioral / Peer'),
        ('network', 'Network / Relationship'),
        ('temporal', 'Temporal / Time-based'),
        ('ml', 'Machine Learning / Anomaly'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=50,
        choices=RULE_CATEGORIES,
        default='behavioral'  # Default value added here
    )
    conditions = models.JSONField(default=dict)  # e.g., {"field": "amount", "operator": ">=", "value": 50000}
    risk_points = models.FloatField(default=0.0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.category})"


# ----- TRANSACTION MODEL -----
class Transaction(models.Model):
    STATUS_CHOICES = [
        ('normal', 'Normal'),
        ('suspicious', 'Suspicious'),
        ('flagged', 'Flagged'),
    ]

    id = models.CharField(max_length=100, unique=True, primary_key=True)
    date = models.DateField()
    from_account = models.CharField(max_length=200)
    to_account = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()
    risk_score = models.FloatField(default=0.0)
    flags = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='normal')
    alert_details = models.JSONField(default=dict, blank=True)  # Audit trail

    def __str__(self):
        return f"Transaction {self.id} - {self.amount}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.perform_aml_analysis()

    def perform_aml_analysis(self):
        """
        Dynamic AML scoring using configurable rules and thresholds.
        """
        self.risk_score = 0.0
        self.flags = []
        self.alert_details = {}

        rules = RuleConfiguration.objects.filter(active=True)
        contributions = []

        for rule in rules:
            field = rule.conditions.get("field")
            operator = rule.conditions.get("operator")
            value = rule.conditions.get("value")

            # Skip rules with no field defined
            if not field:
                continue

            tx_value = getattr(self, field, None)
            triggered = False

            if tx_value is not None:
                if operator == ">=" and tx_value >= value:
                    triggered = True
                elif operator == ">" and tx_value > value:
                    triggered = True
                elif operator == "<=" and tx_value <= value:
                    triggered = True
                elif operator == "<" and tx_value < value:
                    triggered = True
                elif operator == "contains" and value.lower() in str(tx_value).lower():
                    triggered = True

            if triggered:
                self.risk_score += rule.risk_points
                self.flags.append(rule.name)
                contributions.append({
                    "rule": rule.name,
                    "category": rule.category,
                    "risk_points": rule.risk_points,
                    "value": tx_value,
                    "condition": rule.conditions
                })

        # Determine final status
        if self.risk_score >= 70:  # Adjustable thresholds
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
            "total_risk_score": self.risk_score
        }

        super().save(update_fields=['risk_score', 'flags', 'status', 'alert_details'])

        # Broadcast to WebSocket
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
                    "risk_score": self.risk_score,
                    "status": self.status,
                    "flags": self.flags,
                    "alert_details": self.alert_details,
                },
            },
        )
