import type { ArtifactDetail } from "@/lib/types";

type Field = { label: string; value: string | null | undefined };

export function ArtifactMetadata({ artifact }: { artifact: ArtifactDetail }) {
  const fields: Field[] = [
    { label: "Date", value: artifact.date_range },
    { label: "Material", value: artifact.material },
    { label: "Dimensions", value: artifact.dimensions },
    { label: "Origin", value: artifact.origin_location },
    { label: "Culture", value: artifact.culture },
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
