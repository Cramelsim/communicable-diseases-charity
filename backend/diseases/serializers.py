from rest_framework import serializers

from .models import Area, Disease, DiseaseAreaStat


class DiseaseAreaStatSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    area_name = serializers.CharField(source='area.__str__', read_only=True)

    class Meta:
        model = DiseaseAreaStat
        fields = ('id', 'disease', 'disease_name', 'area', 'area_name', 'cases', 'deaths', 'recovered', 'updated_at')
        read_only_fields = ('updated_at',)

    def validate(self, data):
        cases = data.get('cases', getattr(self.instance, 'cases', 0))
        if data.get('deaths', 0) + data.get('recovered', 0) > cases:
            raise serializers.ValidationError('Deaths plus recovered cannot exceed total cases.')
        return data


class DiseaseSerializer(serializers.ModelSerializer):
    total_cases = serializers.IntegerField(read_only=True)
    areas_affected = serializers.IntegerField(read_only=True)

    class Meta:
        model = Disease
        fields = (
            'id', 'name', 'description', 'symptoms', 'transmission', 'prevention',
            'treatment', 'severity', 'total_cases', 'areas_affected', 'created_at', 'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')


class AreaStatForDiseaseSerializer(serializers.ModelSerializer):
    area_name = serializers.CharField(source='area.__str__', read_only=True)

    class Meta:
        model = DiseaseAreaStat
        fields = ('area', 'area_name', 'cases', 'deaths', 'recovered')


class DiseaseDetailSerializer(DiseaseSerializer):
    areas = AreaStatForDiseaseSerializer(source='area_stats', many=True, read_only=True)

    class Meta(DiseaseSerializer.Meta):
        fields = DiseaseSerializer.Meta.fields + ('areas',)


class AreaSerializer(serializers.ModelSerializer):
    total_cases = serializers.IntegerField(read_only=True)
    diseases_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Area
        fields = (
            'id', 'name', 'country', 'description', 'population', 'latitude', 'longitude',
            'total_cases', 'diseases_count', 'created_at', 'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')


class DiseaseStatForAreaSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)

    class Meta:
        model = DiseaseAreaStat
        fields = ('disease', 'disease_name', 'cases', 'deaths', 'recovered')


class AreaDetailSerializer(AreaSerializer):
    diseases = DiseaseStatForAreaSerializer(source='disease_stats', many=True, read_only=True)

    class Meta(AreaSerializer.Meta):
        fields = AreaSerializer.Meta.fields + ('diseases',)
