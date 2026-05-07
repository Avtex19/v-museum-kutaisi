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

    class Meta:
        model = Room
        fields = ['id', 'name_ka', 'name_en', 'slug', 'period', 'topic', 'cover_image', 'order']


class RoomDetailSerializer(serializers.ModelSerializer):
    period = PeriodSerializer(read_only=True)
    topic = TopicSerializer(read_only=True)

    class Meta:
        model = Room
        fields = [
            'id', 'name_ka', 'name_en', 'slug',
            'period', 'topic',
            'description_ka', 'description_en',
            'panorama_360', 'audio_guide_ka', 'audio_guide_en',
            'cover_image', 'order', 'is_published',
        ]


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
