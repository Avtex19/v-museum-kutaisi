from rest_framework import serializers

from .models import (
    Period, Topic, Room,
    Artifact, ArtifactImage, ArtifactTurntableFrame,
)


class PeriodSerializer(serializers.ModelSerializer):
    era_display = serializers.CharField(read_only=True)

    class Meta:
        model = Period
        fields = ['id', 'name_ka', 'name_en', 'slug', 'era_display', 'order']


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name_ka', 'name_en', 'slug', 'icon']


class RoomListSerializer(serializers.ModelSerializer):
    period = PeriodSerializer(read_only=True)
    topic = TopicSerializer(read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    artifact_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'id', 'name_ka', 'name_en', 'slug',
            'period', 'topic',
            'cover_image', 'cover_image_url',
            'artifact_count', 'order',
        ]

    def get_cover_image_url(self, room):
        """Use the room's own cover_image if set, else fall back to the first
        artifact's hero image so the UI is never blank."""
        request = self.context.get('request')
        if room.cover_image:
            url = room.cover_image.url
            return request.build_absolute_uri(url) if request else url

        first_artifact = (
            room.artifacts.filter(is_published=True)
            .prefetch_related('images')
            .first()
        )
        if not first_artifact:
            return None
        hero = first_artifact.images.filter(image_type='hero').first() \
            or first_artifact.images.first()
        if not hero:
            return None
        url = hero.image.url
        return request.build_absolute_uri(url) if request else url

    def get_artifact_count(self, room):
        return room.artifacts.filter(is_published=True).count()


class RoomDetailSerializer(serializers.ModelSerializer):
    period = PeriodSerializer(read_only=True)
    topic = TopicSerializer(read_only=True)
    artifacts = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'id', 'name_ka', 'name_en', 'slug',
            'period', 'topic',
            'description_ka', 'description_en',
            'panorama_360', 'audio_guide_ka', 'audio_guide_en',
            'cover_image', 'order', 'is_published',
            'artifacts',
        ]

    def get_artifacts(self, room):
        qs = room.artifacts.filter(is_published=True).prefetch_related('images')
        return ArtifactListSerializer(qs, many=True, context=self.context).data


class ArtifactImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtifactImage
        fields = ['id', 'image', 'caption_ka', 'caption_en', 'image_type', 'order']


class ArtifactTurntableFrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtifactTurntableFrame
        fields = ['id', 'image', 'angle', 'order']


class ArtifactListSerializer(serializers.ModelSerializer):
    period = PeriodSerializer(read_only=True)
    hero_image = ArtifactImageSerializer(read_only=True)
    has_360_view = serializers.BooleanField(read_only=True)

    class Meta:
        model = Artifact
        fields = [
            'id', 'name_ka', 'name_en', 'slug',
            'category', 'period', 'hero_image',
            'short_description_ka', 'short_description_en',
            'is_featured', 'has_360_view',
        ]


class ArtifactDetailSerializer(serializers.ModelSerializer):
    period = PeriodSerializer(read_only=True)
    room = RoomListSerializer(read_only=True)
    topics = TopicSerializer(many=True, read_only=True)
    images = ArtifactImageSerializer(many=True, read_only=True)
    turntable_frames = ArtifactTurntableFrameSerializer(many=True, read_only=True)
    hero_image = ArtifactImageSerializer(read_only=True)
    has_360_view = serializers.BooleanField(read_only=True)

    class Meta:
        model = Artifact
        fields = [
            'id', 'name_ka', 'name_en', 'slug',
            'category', 'period', 'room', 'topics',
            'short_description_ka', 'short_description_en',
            'description_ka', 'description_en',
            'culture', 'date_range', 'material', 'dimensions', 'origin_location',
            'audio_annotation_ka', 'audio_annotation_en',
            'hero_image', 'images', 'turntable_frames',
            'is_featured', 'is_published', 'has_360_view',
            'view_count', 'created_at', 'updated_at',
        ]


class AdminRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = [
            'id', 'name_ka', 'name_en', 'slug',
            'period', 'topic',
            'description_ka', 'description_en',
            'panorama_360', 'audio_guide_ka', 'audio_guide_en',
            'cover_image', 'order', 'is_published',
        ]


class AdminArtifactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artifact
        fields = [
            'id', 'name_ka', 'name_en', 'slug',
            'period', 'room', 'topics',
            'short_description_ka', 'short_description_en',
            'description_ka', 'description_en',
            'category', 'culture', 'date_range', 'material', 'dimensions', 'origin_location',
            'audio_annotation_ka', 'audio_annotation_en',
            'is_featured', 'is_published',
        ]
