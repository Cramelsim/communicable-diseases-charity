from django.conf import settings
from django.db import models

from diseases.models import Area, Disease


class HelpReview(models.Model):
    """A user's view on how they would like to help eradicate a disease in an area."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='help_reviews')
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='help_reviews')
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='help_reviews')
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Optional 1-5 urgency/priority score.')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} on {self.disease} in {self.area}'
