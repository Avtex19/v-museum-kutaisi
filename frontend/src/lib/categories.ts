/**
 * Mirrors `Artifact.CATEGORY_CHOICES` in backend/exhibits/models.py.
 * Update both sides when adding a new category.
 */
export const ARTIFACT_CATEGORIES = [
  { value: "jewelry", label: "Jewelry" },
  { value: "weapon", label: "Weapon" },
  { value: "pottery", label: "Pottery" },
  { value: "religious", label: "Religious Object" },
  { value: "coin", label: "Coin" },
  { value: "tool", label: "Tool" },
  { value: "manuscript", label: "Manuscript" },
  { value: "sculpture", label: "Sculpture" },
  { value: "textile", label: "Textile" },
  { value: "other", label: "Other" },
] as const;
