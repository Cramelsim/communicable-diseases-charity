from django.conf import settings
from django.db import models

from diseases.models import Area, Disease


class Donation(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'

    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='donations')
    area = models.ForeignKey(Area, on_delete=models.PROTECT, related_name='donations')
    disease = models.ForeignKey(Disease, on_delete=models.PROTECT, null=True, blank=True, related_name='donations')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    message = models.CharField(max_length=300, blank=True)
    anonymous = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.amount} {self.currency} to {self.area}'
