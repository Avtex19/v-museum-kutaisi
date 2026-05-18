# Backend (Django + DRF) — Local Conventions

Guidance specific to `backend/`. Root `AGENTS.md` has project-wide context.

## Folder layout

```
backend/
├── config/                       Django project
│   ├── settings.py               REST_FRAMEWORK + decouple-based .env reads
│   └── urls.py                   Routes: /admin/, /api/, /media/ (dev)
├── exhibits/                     Main domain app
│   ├── models.py                 Period, Topic, Room, Artifact, *Image, *Frame
│   ├── serializers.py            DRF serializers (one class per view layer)
│   ├── views.py                  ReadOnlyModelViewSet for public reads
│   ├── admin.py                  Django admin registration
│   ├── urls.py                   DRF DefaultRouter
│   ├── management/commands/      seed_met, seed_rooms, seed_turntable, …
│   └── migrations/
├── accounts/                     User + JWT token-version auth
│   └── authentication.py         TokenVersionAuthentication (use this, not plain JWT)
├── media/                        Uploaded files (artifact images, turntable frames)
├── pyproject.toml + uv.lock      Python deps (managed by uv)
└── Dockerfile                    Uses `uv export --frozen` — lock must be in sync
```

## Models conventions

### Bilingual fields

Every user-facing text field exists in both `_ka` and `_en`:
```python
name_ka = CharField(max_length=200)
name_en = CharField(max_length=200, blank=True)
```
`_ka` is the canonical/required version; `_en` is optional. Frontend picks
the right one via `pick(lang, en, ka)`.

### Slug auto-generation

Override `save()` to populate `slug` from `name_en or name_ka`:
```python
def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(self.name_en or self.name_ka, allow_unicode=True)
    super().save(*args, **kwargs)
```

### Reverse relations need `related_name`

Always set `related_name` on FK / M2M — frontend serializers depend on it:
```python
room = ForeignKey(Room, on_delete=PROTECT, related_name='artifacts')
```
Used as `room.artifacts.all()` in queries and serializer methods.

### `on_delete=PROTECT` for taxonomy

Periods, Rooms, Topics use `PROTECT`. Artifact images / turntable frames use
`CASCADE` (deleting the parent artifact deletes its media). Never use SET_NULL
on required FKs.

### Properties for computed fields

Logic like `era_display`, `hero_image`, `has_360_view` lives as `@property`
on the model. Serializers expose them as `serializers.SerializerMethodField()`
or by declaring the field with the same name.

## Serializer conventions

### One serializer per view shape

For each list/detail action, define a dedicated serializer. Don't reuse a
detail serializer for the list endpoint — list responses should be lean.

Pattern:
- `ArtifactListSerializer` — name, slug, hero_image, category (for grids)
- `ArtifactDetailSerializer` — everything + nested images, turntable frames

### Computed fields via SerializerMethodField

When you need a field that isn't a DB column (counts, derived URLs, nested
filtered lists):
```python
artifact_count = serializers.SerializerMethodField()

def get_artifact_count(self, room):
    return room.artifacts.filter(is_published=True).count()
```

### Pass `context=self.context` to nested serializers

So nested serializers can build absolute URLs and access the request:
```python
def get_artifacts(self, room):
    qs = room.artifacts.filter(is_published=True).prefetch_related('images')
    return ArtifactListSerializer(qs, many=True, context=self.context).data
```

## ViewSet conventions

### Read-only by default

Public endpoints use `ReadOnlyModelViewSet`. Mutations go through `/api/admin/`
and require JWT auth via `TokenVersionAuthentication`.

### Optimize queries in `get_queryset`

Use `select_related` for FK / one-to-one fields, `prefetch_related` for reverse
FKs and M2Ms. Never let a list endpoint trigger N+1 queries.

```python
def get_queryset(self):
    qs = super().get_queryset()
    if self.action == 'list':
        qs = qs.prefetch_related('images')      # for hero_image
    if self.action == 'retrieve':
        qs = qs.prefetch_related('topics', 'images', 'turntable_frames')
    return qs
```

### Pagination + filtering already global

`REST_FRAMEWORK` settings already enable PageNumberPagination (page_size=12)
and DjangoFilterBackend / SearchFilter / OrderingFilter. To opt out per
ViewSet (small taxonomies):
```python
pagination_class = None
```

### Filter syntax

```python
class ArtifactViewSet(ReadOnlyModelViewSet):
    filterset_fields = {
        'category': ['exact'],
        'period__slug': ['exact'],       # FK lookup via __
        'topics__slug': ['exact'],       # M2M lookup
    }
    search_fields = ['name_ka', 'name_en', 'culture', 'material']
    ordering_fields = ['name_en', 'created_at', 'view_count']
    ordering = ['-is_featured', 'name_ka']   # default
```

## Management commands

Run all via `docker compose exec backend python manage.py <name>`.

| Command              | Purpose                                                    |
|----------------------|------------------------------------------------------------|
| `seed_met`           | Pull mock artifacts from The Met Museum API (idempotent via `met_object_id`) |
| `seed_rooms`         | Create 4 thematic rooms + reassign artifacts by category   |
| `seed_turntable`     | Generate mock 360° frames (2D rotation of hero image)      |
| `seed_test_artifact` | Create a test artifact and import real turntable frames    |

New commands go in `exhibits/management/commands/<name>.py`. Use
`@transaction.atomic` for multi-step writes so failures roll back cleanly.

## uv + Docker workflow

The Dockerfile uses `uv export --frozen` — if `uv.lock` is stale, **new deps
silently get dropped**.

Adding a Python dep:

```bash
# 1. Edit pyproject.toml to add the dep
# 2. Regenerate the lock
docker compose run --rm backend uv lock
# 3. Rebuild (no cache, so install layer actually re-runs)
docker compose build --no-cache backend
docker compose up -d
```

Skip the `uv lock` step and you'll see `ModuleNotFoundError` at runtime.

## Migrations

```bash
# After model changes
docker compose exec backend python manage.py makemigrations exhibits
docker compose exec backend python manage.py migrate
```

Commit the generated migration files. **Never** edit applied migrations —
create a new one to alter schema again.

## Admin

`exhibits/admin.py` registers models with inline editing where useful:
- `ArtifactImageInline`, `ArtifactTurntableFrameInline` show inside Artifact detail
- `fieldsets` group fields by purpose ("Main info", "Relations", "Physical characteristics", …)

When adding a new model, register it with sensible `list_display`,
`list_filter`, and `search_fields`.

## Auth (JWT via accounts app)

- `TokenVersionAuthentication` extends SimpleJWT with a per-user version
  counter. Bumping the counter invalidates all outstanding tokens (logout-all).
- Admin endpoints under `/api/admin/` use this class.
- Settings: access token 1h, refresh 1d, rotation enabled.

When adding a new admin endpoint, set:
```python
authentication_classes = [TokenVersionAuthentication]
permission_classes = [IsAdminUser]
```

## Things to avoid

- ❌ Editing applied migrations — create new ones
- ❌ Skipping `uv lock` after `pyproject.toml` change — build will silently miss the dep
- ❌ Using plain JWTAuthentication instead of TokenVersionAuthentication on admin routes
- ❌ Loading nested data in serializers without `prefetch_related` → N+1
- ❌ `on_delete=CASCADE` on FK to Period/Room (use PROTECT — accidental data loss)
- ❌ Hardcoding `localhost` or `backend` hostnames in code — read from settings/.env
- ❌ Putting business logic in views.py — keep it in models or services
