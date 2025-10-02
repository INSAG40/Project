from django.db import models
from django.contrib.auth.models import User
import random
from datetime import datetime
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
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    risk_score = models.FloatField(default=0.0)
    flags = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='normal')

    def __str__(self):
        return f"Transaction {self.id} - {self.amount}"

    def perform_aml_analysis(self):
        """
        AML analysis that only runs if simulator hasn't provided risk/flags.
        """
        if not self.flags:
            # Reset
            self.risk_score = 0.0
            self.flags = []
            self.status = 'normal'

            # Rule 1: Large amount
            if self.amount >= 50000:
                self.risk_score += random.uniform(4, 6)
                self.flags.append('Large amount transaction')

            # Rule 2: Moderate amount (suspicious)
            elif self.amount >= 30000:
                self.risk_score += random.uniform(2, 4)
                self.flags.append('Moderate amount transaction')

            # Rule 3: Odd day & mid-size amount
            if self.date.day % 2 != 0 and self.amount > 10000:
                self.risk_score += random.uniform(1, 2)
                self.flags.append('Unusual timing/pattern')

            # Rule 4: High-risk keywords
            high_risk_keywords = ['cash', 'loan', 'transfer', 'offshore']
            if any(k in self.description.lower() for k in high_risk_keywords):
                self.risk_score += 2.5
                self.flags.append('High risk keywords in description')

            # Determine status
            if self.risk_score >= 7.0:
                self.status = 'flagged'
            elif self.risk_score >= 4.0:
                self.status = 'suspicious'
            else:
                self.status = 'normal'

            # Cap risk score at 10
            self.risk_score = min(self.risk_score, 10.0)

            # Save the transaction after analysis
            self.save()
