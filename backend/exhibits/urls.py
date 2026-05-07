from rest_framework.routers import DefaultRouter

from .views import PeriodViewSet, TopicViewSet, RoomViewSet, ArtifactViewSet

router = DefaultRouter()
router.register('periods', PeriodViewSet, basename='period')
router.register('topics', TopicViewSet, basename='topic')
router.register('rooms', RoomViewSet, basename='room')
router.register('artifacts', ArtifactViewSet, basename='artifact')

urlpatterns = router.urls
