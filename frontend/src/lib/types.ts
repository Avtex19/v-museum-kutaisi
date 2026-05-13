/**
 * TypeScript shapes matching the DRF serializer output.
 * Keep this in sync with `backend/exhibits/serializers.py`.
 */

export type Period = {
  id: number;
  name_ka: string;
  name_en: string;
  slug: string;
  era_display: string;
  order: number;
};

export type Topic = {
  id: number;
  name_ka: string;
  name_en: string;
  slug: string;
  icon: string;
};

export type ArtifactImage = {
  id: number;
  image: string;
  caption_ka: string;
  caption_en: string;
  image_type: "hero" | "detail" | "reconstruction" | "context";
  order: number;
};

export type ArtifactTurntableFrame = {
  id: number;
  image: string;
  angle: number;
  order: number;
};

export type RoomListItem = {
  id: number;
  name_ka: string;
  name_en: string;
  slug: string;
  period: Period;
  topic: Topic | null;
  cover_image: string | null;
  cover_image_url: string | null;
  artifact_count: number;
  order: number;
};

export type ArtifactListItem = {
  id: number;
  name_ka: string;
  name_en: string;
  slug: string;
  category: string;
  period: Period;
  hero_image: ArtifactImage | null;
  short_description_ka: string;
  short_description_en: string;
  is_featured: boolean;
  has_360_view: boolean;
};

export type RoomDetail = RoomListItem & {
  description_ka: string;
  description_en: string;
  panorama_360: string | null;
  audio_guide_ka: string | null;
  audio_guide_en: string | null;
  is_published: boolean;
  artifacts: ArtifactListItem[];
};

export type ArtifactDetail = ArtifactListItem & {
  room: RoomListItem;
  topics: Topic[];
  description_ka: string;
  description_en: string;
  culture: string;
  date_range: string;
  material: string;
  dimensions: string;
  origin_location: string;
  audio_annotation_ka: string | null;
  audio_annotation_en: string | null;
  images: ArtifactImage[];
  turntable_frames: ArtifactTurntableFrame[];
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

/** DRF can return either a plain array or a paginated envelope. */
export type Paginated<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};
