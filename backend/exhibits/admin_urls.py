from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminRoomViewSet, AdminArtifactViewSet,
    AdminArtifactImageView, AdminArtifactImageDeleteView,
    AdminTurntableView, AdminTurntableFrameDeleteView, AdminTurntableDeleteAllView,
)

router = DefaultRouter()
router.register('rooms', AdminRoomViewSet, basename='admin-room')
router.register('artifacts', AdminArtifactViewSet, basename='admin-artifact')

urlpatterns = router.urls + [
    path('artifacts/<slug:slug>/upload-image/', AdminArtifactImageView.as_view()),
    path('artifacts/<slug:slug>/images/<int:image_id>/', AdminArtifactImageDeleteView.as_view()),
    path('artifacts/<slug:slug>/turntable/', AdminTurntableView.as_view()),
    path('artifacts/<slug:slug>/turntable/all/', AdminTurntableDeleteAllView.as_view()),
    path('artifacts/<slug:slug>/turntable/<int:frame_id>/', AdminTurntableFrameDeleteView.as_view()),
]
