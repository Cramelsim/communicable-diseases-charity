from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AreaViewSet, DiseaseAreaStatViewSet, DiseaseViewSet, map_data

router = DefaultRouter()
router.register('diseases', DiseaseViewSet, basename='disease')
router.register('areas', AreaViewSet, basename='area')
router.register('stats', DiseaseAreaStatViewSet, basename='stat')

urlpatterns = [
    path('map/', map_data, name='map-data'),
    path('', include(router.urls)),
]
