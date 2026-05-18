/**
 * Mirrors `Artifact.CATEGORY_CHOICES` in backend/exhibits/models.py.
 * Update both sides when adding a new category.
 */
export const ARTIFACT_CATEGORIES = [
  { value: "jewelry",   label: "Jewelry",         label_ka: "სამკაული" },
  { value: "weapon",    label: "Weapon",           label_ka: "იარაღი" },
  { value: "pottery",   label: "Pottery",          label_ka: "კერამიკა" },
  { value: "religious", label: "Religious Object", label_ka: "სარწმუნოებრივი საგანი" },
  { value: "coin",      label: "Coin",             label_ka: "მონეტა" },
  { value: "tool",      label: "Tool",             label_ka: "იარაღი / ხელსაწყო" },
  { value: "manuscript",label: "Manuscript",       label_ka: "ხელნაწერი" },
  { value: "sculpture", label: "Sculpture",        label_ka: "სკულპტურა" },
  { value: "textile",   label: "Textile",          label_ka: "ტექსტილი" },
  { value: "other",     label: "Other",            label_ka: "სხვა" },
] as const;
