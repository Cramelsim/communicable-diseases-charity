from decimal import Decimal

from rest_framework import serializers

from .models import Donation


class DonationSerializer(serializers.ModelSerializer):
    area_name = serializers.CharField(source='area.__str__', read_only=True)
    disease_name = serializers.CharField(source='disease.name', read_only=True, default=None)
    donor_name = serializers.SerializerMethodField()

    class Meta:
        model = Donation
        fields = ('id', 'area', 'area_name', 'disease', 'disease_name', 'amount', 'currency',
                  'message', 'anonymous', 'status', 'donor_name', 'created_at')
        read_only_fields = ('status', 'created_at')

    def get_donor_name(self, obj):
        return 'Anonymous' if obj.anonymous else obj.donor.username

    def validate_amount(self, value):
        if value < Decimal('1.00'):
            raise serializers.ValidationError('The minimum donation is 1.00.')
        return value

    def validate_currency(self, value):
        return value.upper()
