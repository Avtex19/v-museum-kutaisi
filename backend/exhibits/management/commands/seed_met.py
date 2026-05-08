"""
Seed the database with mock artifact data from The Met Museum's public API.

Usage:
    python manage.py seed_met               # default mix
    python manage.py seed_met --per-cat 5   # 5 artifacts per category
    python manage.py seed_met --reset       # delete previously-seeded Met artifacts first

API docs: https://metmuseum.github.io/
"""

import json
import time
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from backend.exhibits.models import Period, Room, Artifact, ArtifactImage

MET_BASE = "https://collectionapi.metmuseum.org/public/collection/v1"

# Maps a search query → our Artifact.category choice.
# Using objectName-style keywords so search results are tightly relevant.
CATEGORY_QUERIES = [
    ("ring", "jewelry"),
    ("necklace", "jewelry"),
    ("vase", "pottery"),
    ("amphora", "pottery"),
    ("sword", "weapon"),
    ("dagger", "weapon"),
    ("coin", "coin"),
    ("statue", "sculpture"),
    ("relief", "sculpture"),
    ("icon", "religious"),
    ("textile", "textile"),
    ("manuscript", "manuscript"),
]


def fetch_json(url: str, retries: int = 3, timeout: int = 20) -> dict | None:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "v-museum-kutaisi-seeder/1.0"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception:
            if attempt == retries - 1:
                return None
            time.sleep(1 + attempt)
    return None


def fetch_bytes(url: str, timeout: int = 30) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "v-museum-kutaisi-seeder/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except Exception:
        return None


def search_object_ids(query: str, limit: int) -> list[int]:
    """Return up to `limit` Met objectIDs matching `query` that have images."""
    params = urllib.parse.urlencode({"q": query, "hasImages": "true"})
    data = fetch_json(f"{MET_BASE}/search?{params}")
    if not data or not data.get("objectIDs"):
        return []
    return data["objectIDs"][:limit]


def get_or_create_period(met: dict) -> Period:
    """Resolve or create a Period from a Met object's date info."""
    start = met.get("objectBeginDate")
    end = met.get("objectEndDate")
    if start is None or end is None:
        # Sensible default range when Met doesn't supply dates
        start, end = -1000, 2000

    # Prefer Met's own "period" string; fall back to a label derived from dates
    name_en = (met.get("period") or "").strip()
    if not name_en:
        def label(y: int) -> str:
            return f"{abs(y)} BCE" if y < 0 else f"{y} CE"
        name_en = f"{label(start)} — {label(end)}"

    period, _ = Period.objects.get_or_create(
        name_en=name_en,
        defaults={
            "name_ka": name_en,  # placeholder; translate later
            "era_start_year": start,
            "era_end_year": end,
            "slug": slugify(name_en, allow_unicode=True)[:50] or f"period-{start}-{end}",
        },
    )
    return period


def get_or_create_default_room(default_period: Period) -> Room:
    room, _ = Room.objects.get_or_create(
        slug="met-mock-collection",
        defaults={
            "name_ka": "Met Mock Collection",
            "name_en": "Met Mock Collection",
            "period": default_period,
            "is_published": True,
        },
    )
    return room


def download_image(url: str, filename: str) -> ContentFile | None:
    raw = fetch_bytes(url)
    if not raw:
        return None
    return ContentFile(raw, name=filename)


def safe_filename(url: str, fallback: str) -> str:
    name = Path(urllib.parse.urlparse(url).path).name
    return name or fallback


class Command(BaseCommand):
    help = "Seed the database with mock artifacts pulled from The Met Museum API."

    def add_arguments(self, parser):
        parser.add_argument("--per-cat", type=int, default=3,
                            help="How many artifacts to seed per category (default: 3)")
        parser.add_argument("--max-extra-images", type=int, default=2,
                            help="Max additional (non-hero) images per artifact (default: 2)")
        parser.add_argument("--reset", action="store_true",
                            help="Delete existing Met-sourced artifacts before seeding")

    def handle(self, *args, **opts):
        per_cat = opts["per_cat"]
        max_extra = opts["max_extra_images"]

        if opts["reset"]:
            deleted, _ = Artifact.objects.filter(met_object_id__isnull=False).delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} previously-seeded artifacts."))

        # Bootstrap a default period + room so artifacts always have something to attach to
        default_period, _ = Period.objects.get_or_create(
            name_en="General",
            defaults={
                "name_ka": "General",
                "era_start_year": -1000,
                "era_end_year": 2000,
                "slug": "general",
            },
        )
        default_room = get_or_create_default_room(default_period)

        total_created = 0
        total_skipped = 0

        for query, category in CATEGORY_QUERIES:
            self.stdout.write(self.style.HTTP_INFO(f"\n→ '{query}' (category: {category})"))
            ids = search_object_ids(query, limit=per_cat * 4)  # over-fetch — many lack images
            picked = 0

            for obj_id in ids:
                if picked >= per_cat:
                    break

                if Artifact.objects.filter(met_object_id=obj_id).exists():
                    self.stdout.write(f"  · {obj_id}: already seeded, skipping")
                    continue

                met = fetch_json(f"{MET_BASE}/objects/{obj_id}")
                if not met or not met.get("primaryImage"):
                    total_skipped += 1
                    continue

                title = met.get("title") or f"Met Object {obj_id}"
                try:
                    with transaction.atomic():
                        period = get_or_create_period(met)

                        artifact = Artifact.objects.create(
                            met_object_id=obj_id,
                            name_ka=title,
                            name_en=title,
                            slug=slugify(f"{title}-{obj_id}", allow_unicode=True)[:50] or f"met-{obj_id}",
                            short_description_ka=(met.get("creditLine") or "")[:300],
                            short_description_en=(met.get("creditLine") or "")[:300],
                            description_ka=met.get("objectURL", ""),
                            description_en=met.get("objectURL", ""),
                            category=category,
                            culture=(met.get("culture") or "")[:100],
                            date_range=(met.get("objectDate") or "")[:100],
                            material=(met.get("medium") or "")[:150],
                            dimensions=(met.get("dimensions") or "")[:150],
                            origin_location=(met.get("country") or met.get("city") or "")[:200],
                            period=period,
                            room=default_room,
                            is_published=True,
                        )

                        # Hero image
                        hero_url = met["primaryImage"]
                        hero_file = download_image(hero_url, safe_filename(hero_url, f"hero-{obj_id}.jpg"))
                        if hero_file:
                            ArtifactImage.objects.create(
                                artifact=artifact,
                                image=hero_file,
                                caption_en=title,
                                image_type="hero",
                                order=0,
                            )

                        # Up to N additional images
                        for i, extra_url in enumerate((met.get("additionalImages") or [])[:max_extra]):
                            extra_file = download_image(
                                extra_url,
                                safe_filename(extra_url, f"detail-{obj_id}-{i}.jpg"),
                            )
                            if extra_file:
                                ArtifactImage.objects.create(
                                    artifact=artifact,
                                    image=extra_file,
                                    caption_en=f"{title} — detail {i + 1}",
                                    image_type="detail",
                                    order=i + 1,
                                )

                    self.stdout.write(self.style.SUCCESS(f"  ✓ {obj_id}: {title[:60]}"))
                    total_created += 1
                    picked += 1
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  ✗ {obj_id}: {e}"))
                    total_skipped += 1

                # Be nice to the Met API
                time.sleep(0.2)

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. Created: {total_created}, skipped: {total_skipped}."
        ))
