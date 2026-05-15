from django.db import models
from django.core.validators import MaxValueValidator
from autoslug import AutoSlugField


# --- Dynamic upload paths ---

def artifact_turntable_path(instance, filename):
    # Stores 360° turntable frames at: media/artifacts/<slug>/turntable/<file>
    return f'artifacts/{instance.artifact.slug}/turntable/{filename}'


def artifact_image_path(instance, filename):
    # Stores static artifact images at: media/artifacts/<slug>/images/<file>
    return f'artifacts/{instance.artifact.slug}/images/{filename}'

def room_audio_path(instance, filename):
    return f'rooms/{instance.slug}/audio/{filename}'


def room_panorama_path(instance, filename):
    # Stores room panoramas at: media/rooms/<slug>/panorama/<file>
    return f'rooms/{instance.slug}/panorama/{filename}'


# --- Models ---

class Period(models.Model):
    """Historical period — e.g. Colchis, Middle Ages, Bagrationi era."""
    name_ka = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100, blank=True)
    slug = AutoSlugField(populate_from='_slug_source', unique=True, always_update=False)
    description_ka = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    # Years stored as integers for proper sorting and range filtering.
    # Negative values indicate BCE (e.g. -800 = 800 BCE).
    era_start_year = models.IntegerField(help_text="Negative number for BCE, e.g. -800")
    era_end_year = models.IntegerField()

    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def _slug_source(self):
        return self.name_en or self.name_ka

    @property
    def era_display(self):
        """Returns a formatted period string, e.g. '800 BCE — 100 BCE'."""

        def format_year(y):
            if y < 0:
                return f"{abs(y)} BCE"
            return f"{y} CE"

        return f"{format_year(self.era_start_year)} — {format_year(self.era_end_year)}"

    def __str__(self):
        return self.name_ka


class Topic(models.Model):
    """Thematic tag — e.g. Religion, Trade, Art, Weaponry."""
    name_ka = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100, blank=True)
    slug = AutoSlugField(populate_from='_slug_source', unique=True, always_update=False)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")

    def _slug_source(self):
        return self.name_en or self.name_ka

    def __str__(self):
        return self.name_ka


class Room(models.Model):
    """Themed virtual room that groups artifacts by period and/or topic."""
    period = models.ForeignKey(Period, on_delete=models.PROTECT, related_name='rooms')
    topic = models.ForeignKey(Topic, on_delete=models.PROTECT, related_name='rooms', null=True, blank=True)

    name_ka = models.CharField(max_length=150)
    name_en = models.CharField(max_length=150, blank=True)
    slug = AutoSlugField(populate_from='_slug_source', unique=True, always_update=False)

    description_ka = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    # 360° panoramic photo of the room (equirectangular format, used by Pannellum/Marzipano)
    panorama_360 = models.ImageField(upload_to=room_panorama_path, blank=True,
                                     help_text="360° panoramic image (equirectangular format)")

    # Audio guide for the whole room
    audio_guide_ka = models.FileField(upload_to=room_audio_path, blank=True)
    audio_guide_en = models.FileField(upload_to=room_audio_path, blank=True)

    cover_image = models.ImageField(upload_to='rooms/covers/', blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def _slug_source(self):
        return self.name_en or self.name_ka

    def __str__(self):
        return self.name_ka


class Artifact(models.Model):
    """A single museum exhibit displayed inside a room."""

    CATEGORY_CHOICES = [
        ('jewelry', 'Jewelry'),
        ('weapon', 'Weapon'),
        ('pottery', 'Pottery'),
        ('religious', 'Religious Object'),
        ('coin', 'Coin'),
        ('tool', 'Tool'),
        ('manuscript', 'Manuscript'),
        ('sculpture', 'Sculpture'),
        ('textile', 'Textile'),
        ('other', 'Other'),
    ]

    period = models.ForeignKey(Period, on_delete=models.PROTECT, related_name='artifacts')
    room = models.ForeignKey(Room, on_delete=models.PROTECT, related_name='artifacts')
    topics = models.ManyToManyField(Topic, blank=True, related_name='artifacts')

    name_ka = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    slug = AutoSlugField(populate_from='_slug_source', unique=True, always_update=False)

    # Short annotation — used on cards and filter results
    short_description_ka = models.CharField(max_length=300,
                                            help_text="Short annotation — 1-2 sentences")
    short_description_en = models.CharField(max_length=300, blank=True)

    # Full description — used on the detail page
    description_ka = models.TextField()
    description_en = models.TextField(blank=True)

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    culture = models.CharField(max_length=100, blank=True)
    date_range = models.CharField(max_length=100, blank=True)
    material = models.CharField(max_length=150, blank=True)
    dimensions = models.CharField(max_length=150, blank=True)
    origin_location = models.CharField(max_length=200, blank=True)

    # Per-artifact audio annotation (narration)
    audio_annotation_ka = models.FileField(upload_to='artifacts/audio/', blank=True)
    audio_annotation_en = models.FileField(upload_to='artifacts/audio/', blank=True)

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    # External source tracking — used by the Met seeder to stay idempotent
    met_object_id = models.PositiveIntegerField(null=True, blank=True, unique=True, db_index=True)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'name_ka']

    def _slug_source(self):
        return self.name_en or self.name_ka

    @property
    def has_360_view(self):
        return self.turntable_frames.exists()

    def __str__(self):
        return self.name_ka

    @property
    def hero_image(self):
        return self.images.filter(image_type='hero').first()


class ArtifactImage(models.Model):
    """Static photos for an artifact (not the 360° series)."""

    IMAGE_TYPES = [
        ('hero', 'Hero'),
        ('detail', 'Detail'),
        ('reconstruction', 'Reconstruction'),
        ('context', 'Context'),
    ]

    artifact = models.ForeignKey(Artifact, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=artifact_image_path)
    caption_ka = models.CharField(max_length=300, blank=True)
    caption_en = models.CharField(max_length=300, blank=True)
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPES, default='detail')
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.artifact.name_ka} — {self.get_image_type_display()} #{self.order}"


class ArtifactTurntableFrame(models.Model):
    """A single frame in the 360° turntable photo series for an artifact."""

    artifact = models.ForeignKey(Artifact, on_delete=models.CASCADE, related_name='turntable_frames')
    angle = models.PositiveSmallIntegerField(
        validators=[MaxValueValidator(359)],
        help_text="Angle in degrees, 0-359"
    )
    image = models.ImageField(upload_to=artifact_turntable_path)
    order = models.PositiveSmallIntegerField(help_text="Frame order, starting from 0")

    class Meta:
        ordering = ['order']
        unique_together = [['artifact', 'order']]

    def __str__(self):
        return f"{self.artifact.name_ka} — frame {self.order} ({self.angle}°)"