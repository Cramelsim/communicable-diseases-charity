from django.db import models


class Disease(models.Model):
    class Severity(models.TextChoices):
        LOW = 'low', 'Low'
        MODERATE = 'moderate', 'Moderate'
        HIGH = 'high', 'High'
        CRITICAL = 'critical', 'Critical'

    name = models.CharField(max_length=120, unique=True)
    description = models.TextField()
    symptoms = models.TextField(blank=True)
    transmission = models.TextField(blank=True)
    prevention = models.TextField(blank=True)
    treatment = models.TextField(blank=True)
    severity = models.CharField(max_length=10, choices=Severity.choices, default=Severity.MODERATE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Area(models.Model):
    name = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    population = models.PositiveBigIntegerField(default=0)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['country', 'name']
        constraints = [models.UniqueConstraint(fields=['name', 'country'], name='unique_area_per_country')]

    def __str__(self):
        return f'{self.name}, {self.country}'


class DiseaseAreaStat(models.Model):
    """How much a given disease has affected a given area."""

    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='area_stats')
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='disease_stats')
    cases = models.PositiveIntegerField(default=0)
    deaths = models.PositiveIntegerField(default=0)
    recovered = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['disease', 'area'], name='unique_disease_area')]

    def __str__(self):
        return f'{self.disease} in {self.area}: {self.cases}'
