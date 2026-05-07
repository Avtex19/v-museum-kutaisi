from django.contrib import admin

# Register your models here.
from .models import (
    Period, Topic, Room,
    Artifact, ArtifactImage, ArtifactTurntableFrame,
)


class ArtifactImageInline(admin.TabularInline):
    model = ArtifactImage
    extra = 1


class ArtifactTurntableFrameInline(admin.TabularInline):
    model = ArtifactTurntableFrame
    extra = 0


@admin.register(Period)
class PeriodAdmin(admin.ModelAdmin):
    list_display = ['name_ka', 'name_en', 'era_display', 'order']
    ordering = ['order']


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['name_ka', 'name_en', 'slug', 'icon']


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name_ka', 'name_en', 'period', 'topic', 'order', 'is_published']
    list_filter = ['is_published', 'period', 'topic']
    ordering = ['order']


@admin.register(Artifact)
class ArtifactAdmin(admin.ModelAdmin):
    list_display = ['name_ka', 'name_en', 'category', 'period', 'room', 'is_featured', 'is_published']
    list_filter = ['is_published', 'is_featured', 'category', 'period', 'room']
    search_fields = ['name_ka', 'name_en', 'slug']
    filter_horizontal = ['topics']
    inlines = [ArtifactImageInline, ArtifactTurntableFrameInline]
    readonly_fields = ['view_count', 'created_at', 'updated_at']

    fieldsets = (
        ('Main Information', {
            'fields': ('name_ka', 'name_en', 'slug', 'category', 'is_featured', 'is_published')
        }),
        ('Relations', {
            'fields': ('period', 'room', 'topics')
        }),
        ('Text Data', {
            'fields': ('short_description_ka', 'short_description_en', 'description_ka', 'description_en')
        }),
        ('Physical Characteristics', {
            'fields': ('culture', 'date_range', 'material', 'dimensions', 'origin_location')
        }),
        ('Media & Audio', {
            'fields': ('audio_annotation_ka', 'audio_annotation_en')
        }),
        ('Statistics', {
            'fields': ('view_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )