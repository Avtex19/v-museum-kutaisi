from rest_framework.routers import DefaultRouter

from .views import AdminRoomViewSet, AdminArtifactViewSet

router = DefaultRouter()
router.register('rooms', AdminRoomViewSet, basename='admin-room')
router.register('artifacts', AdminArtifactViewSet, basename='admin-artifact')

urlpatterns = router.urls
