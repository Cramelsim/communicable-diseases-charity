from django.db.models import Count, Sum
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Donation
from .serializers import DonationSerializer


class DonationViewSet(mixins.CreateModelMixin, mixins.ListModelMixin,
                      mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Donors see their own donations; admins see all."""

    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Donation.objects.select_related('donor', 'area', 'disease')
        user = self.request.user
        return qs if user.is_admin_role else qs.filter(donor=user)

    def perform_create(self, serializer):
        # Payment-gateway integration would settle this; for the MVP donations are
        # recorded as pledges and marked completed on creation.
        serializer.save(donor=self.request.user, status=Donation.Status.COMPLETED)

    @action(detail=False, permission_classes=[permissions.AllowAny])
    def totals(self, request):
        """Public per-area totals, so users can see where help is flowing."""
        rows = (Donation.objects.filter(status=Donation.Status.COMPLETED)
                .values('area', 'area__name', 'area__country')
                .annotate(total=Sum('amount'), donations=Count('id')).order_by('-total'))
        return Response([
            {'area': r['area'], 'area_name': f"{r['area__name']}, {r['area__country']}",
             'total': r['total'], 'donations': r['donations']} for r in rows
        ])
