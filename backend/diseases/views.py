from django.db.models import Count, Sum
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.permissions import IsAdminOrReadOnly

from .models import Area, Disease, DiseaseAreaStat
from .serializers import (
    AreaDetailSerializer, AreaSerializer, DiseaseAreaStatSerializer,
    DiseaseDetailSerializer, DiseaseSerializer,
)


class DiseaseViewSet(viewsets.ModelViewSet):
    """Diseases ordered by prevalence (total reported cases)."""

    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Disease.objects.annotate(
            total_cases=Coalesce(Sum('area_stats__cases'), 0),
            areas_affected=Count('area_stats'),
        ).order_by('-total_cases', 'name')
        search = self.request.query_params.get('search')
        return qs.filter(name__icontains=search) if search else qs

    def get_serializer_class(self):
        return DiseaseDetailSerializer if self.action == 'retrieve' else DiseaseSerializer


class AreaViewSet(viewsets.ModelViewSet):
    """Areas ordered by how heavily they are affected (total cases)."""

    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Area.objects.annotate(
            total_cases=Coalesce(Sum('disease_stats__cases'), 0),
            diseases_count=Count('disease_stats'),
        ).order_by('-total_cases', 'name')
        search = self.request.query_params.get('search')
        return qs.filter(name__icontains=search) if search else qs

    def get_serializer_class(self):
        return AreaDetailSerializer if self.action == 'retrieve' else AreaSerializer


class DiseaseAreaStatViewSet(viewsets.ModelViewSet):
    queryset = DiseaseAreaStat.objects.select_related('disease', 'area').order_by('-cases')
    serializer_class = DiseaseAreaStatSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        for field in ('disease', 'area'):
            value = self.request.query_params.get(field)
            if value:
                qs = qs.filter(**{f'{field}_id': value})
        return qs


@api_view(['GET'])
@permission_classes([AllowAny])
def map_data(request):
    """Map analysis: one marker per area with case figures.

    Optional filters: ?disease=<id> limits figures to one disease,
    ?area=<id> returns a single area.
    """
    stats = DiseaseAreaStat.objects.select_related('disease', 'area')
    if request.query_params.get('disease'):
        stats = stats.filter(disease_id=request.query_params['disease'])
    if request.query_params.get('area'):
        stats = stats.filter(area_id=request.query_params['area'])

    markers = {}
    for s in stats:
        m = markers.setdefault(s.area_id, {
            'area': s.area_id,
            'name': str(s.area),
            'latitude': float(s.area.latitude),
            'longitude': float(s.area.longitude),
            'population': s.area.population,
            'total_cases': 0,
            'total_deaths': 0,
            'diseases': [],
        })
        m['total_cases'] += s.cases
        m['total_deaths'] += s.deaths
        m['diseases'].append({'disease': s.disease_id, 'name': s.disease.name, 'cases': s.cases, 'deaths': s.deaths})

    results = sorted(markers.values(), key=lambda m: -m['total_cases'])
    top = results[0]['total_cases'] if results else 0
    for m in results:
        m['intensity'] = round(m['total_cases'] / top, 3) if top else 0
        m['cases_per_100k'] = round(m['total_cases'] * 100000 / m['population'], 1) if m['population'] else None
    return Response(results)
