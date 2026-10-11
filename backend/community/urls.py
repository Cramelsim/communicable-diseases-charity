from rest_framework.routers import DefaultRouter

from .views import HelpReviewViewSet

router = DefaultRouter()
router.register('reviews', HelpReviewViewSet, basename='review')
urlpatterns = router.urls
