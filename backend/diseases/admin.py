from django.contrib import admin

from .models import Area, Disease, DiseaseAreaStat

admin.site.register(Disease)
admin.site.register(Area)
admin.site.register(DiseaseAreaStat)
