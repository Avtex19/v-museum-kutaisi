from rest_framework import viewsets

from .models import Period, Topic, Room, Artifact
from .serializers import (
    PeriodSerializer, TopicSerializer,
    RoomListSerializer, RoomDetailSerializer,
    ArtifactListSerializer, ArtifactDetailSerializer,
)


class PeriodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Period.objects.all()
    serializer_class = PeriodSerializer
    lookup_field = 'slug'
    pagination_class = None  # taxonomy is small; return everything


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    lookup_field = 'slug'
    pagination_class = None


class RoomViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Room.objects.filter(is_published=True).select_related('period', 'topic')
    lookup_field = 'slug'
    pagination_class = None  # only a handful of rooms; show them all

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RoomDetailSerializer
        return RoomListSerializer


class ArtifactViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Artifact.objects.filter(is_published=True).select_related('period', 'room')
    lookup_field = 'slug'

    # Filtering
    filterset_fields = {
        'category': ['exact'],
        'is_featured': ['exact'],
        'period__slug': ['exact'],
        'room__slug': ['exact'],
        'topics__slug': ['exact'],
    }
    search_fields = ['name_ka', 'name_en', 'culture', 'material', 'origin_location']
    ordering_fields = ['name_en', 'name_ka', 'created_at', 'view_count']
    ordering = ['-is_featured', 'name_ka']  # default ordering

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArtifactDetailSerializer
        return ArtifactListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list':
            qs = qs.prefetch_related('images')  # for hero_image in list view
        if self.action == 'retrieve':
            qs = qs.prefetch_related('topics', 'images', 'turntable_frames')
        return qs
