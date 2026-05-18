import type { ArtifactDetail } from "@/lib/types";

type Labels = {
  date: string;
  material: string;
  dimensions: string;
  origin: string;
  culture: string;
};

const EN_LABELS: Labels = {
  date: "Date",
  material: "Material",
  dimensions: "Dimensions",
  origin: "Origin",
  culture: "Culture",
};

const KA_LABELS: Labels = {
  date: "თარიღი",
  material: "მასალა",
  dimensions: "ზომები",
  origin: "წარმოშობა",
  culture: "კულტურა",
};

type Field = { label: string; value: string | null | undefined };

export function ArtifactMetadata({
  artifact,
  lang = "en",
}: {
  artifact: ArtifactDetail;
  lang?: "en" | "ka";
}) {
  const l = lang === "ka" ? KA_LABELS : EN_LABELS;

  const fields: Field[] = [
    { label: l.date, value: artifact.date_range },
    { label: l.material, value: artifact.material },
    { label: l.dimensions, value: artifact.dimensions },
    { label: l.origin, value: artifact.origin_location },
    { label: l.culture, value: artifact.culture },
  ];

  const visible = fields.filter((f) => f.value);
  if (visible.length === 0) return null;

  return (
    <dl className="mt-10 divide-y divide-white/5 border-t border-white/10 text-sm">
      {visible.map((field) => (
        <Row key={field.label} label={field.label} value={field.value!} />
      ))}
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-100">{value}</dd>
    </div>
  );
}
