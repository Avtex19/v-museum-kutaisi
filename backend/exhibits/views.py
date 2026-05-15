from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Period, Topic, Room, Artifact, ArtifactImage,ArtifactTurntableFrame
from .serializers import (
    PeriodSerializer, TopicSerializer,
    RoomListSerializer, RoomDetailSerializer,
    ArtifactListSerializer, ArtifactDetailSerializer,
    AdminRoomSerializer, AdminArtifactSerializer,
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


class AdminRoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().select_related('period', 'topic')
    serializer_class = AdminRoomSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser]


class AdminArtifactViewSet(viewsets.ModelViewSet):
    queryset = Artifact.objects.all().select_related('period', 'room')
    serializer_class = AdminArtifactSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser]


class AdminArtifactImageView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, slug):
        artifact = get_object_or_404(Artifact, slug=slug)
        image = request.FILES.get('image')
        if not image:
            return Response({'error': 'No image provided'}, status=400)
        image_type = request.data.get('image_type')
        ArtifactImage.objects.create(artifact=artifact, image=image, image_type=image_type)
        return Response(status=201)


class AdminArtifactImageDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, slug, image_id):
        artifact = get_object_or_404(Artifact, slug=slug)
        image = get_object_or_404(ArtifactImage, id=image_id, artifact=artifact)
        image.image.delete(save=False)
        image.delete()
        return Response(status=204)


class AdminTurntableView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, slug):
        artifact = get_object_or_404(Artifact, slug=slug)
        image = request.FILES.get('image')
        if not image:
            return Response({'error': 'No image provided'}, status=400)
        order = int(request.data.get('order', 0))
        angle = int(request.data.get('angle', 0))
        from .models import ArtifactTurntableFrame
        ArtifactTurntableFrame.objects.create(artifact=artifact, image=image, order=order, angle=angle)
        return Response(status=201)


class AdminTurntableFrameDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, slug, frame_id):
        artifact = get_object_or_404(Artifact, slug=slug)
        frame = get_object_or_404(ArtifactTurntableFrame, id=frame_id, artifact=artifact)
        frame.image.delete(save=False)
        frame.delete()
        return Response(status=204)


class AdminTurntableDeleteAllView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, slug):
        artifact = get_object_or_404(Artifact, slug=slug)
        for frame in artifact.turntable_frames.all():
            frame.image.delete(save=False)
        artifact.turntable_frames.all().delete()
        return Response(status=204)
