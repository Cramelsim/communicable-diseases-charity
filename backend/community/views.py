from rest_framework import permissions, viewsets

from .models import HelpReview
from .serializers import HelpReviewSerializer


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user_id == request.user.id or request.user.is_admin_role


class HelpReviewViewSet(viewsets.ModelViewSet):
    serializer_class = HelpReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]

    def get_queryset(self):
        qs = HelpReview.objects.select_related('user', 'disease', 'area')
        for field in ('disease', 'area'):
            value = self.request.query_params.get(field)
            if value:
                qs = qs.filter(**{f'{field}_id': value})
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
