from rest_framework import serializers

from .models import HelpReview


class HelpReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    area_name = serializers.CharField(source='area.__str__', read_only=True)

    class Meta:
        model = HelpReview
        fields = ('id', 'user', 'username', 'disease', 'disease_name', 'area', 'area_name',
                  'comment', 'rating', 'created_at')
        read_only_fields = ('user', 'created_at')

    def validate_rating(self, value):
        if value is not None and not 1 <= value <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate(self, data):
        # On create, the disease must actually be reported in the area.
        if self.instance is None:
            from diseases.models import DiseaseAreaStat
            if not DiseaseAreaStat.objects.filter(disease=data['disease'], area=data['area']).exists():
                raise serializers.ValidationError('This disease has no reported cases in that area.')
        return data
