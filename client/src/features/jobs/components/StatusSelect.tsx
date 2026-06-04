const statusColors: Record<string, string> = {
  PENDING: "bg-surface-container-high text-on-surface-variant",
  REVIEWING: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  SHORTLISTED: "bg-secondary-fixed text-on-secondary-fixed-variant",
  REJECTED: "bg-error-container text-on-error-container",
  ACCEPTED: "bg-green-100 text-green-800",
};

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function StatusSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-1 rounded-full text-xs font-semibold border-none outline-none cursor-pointer ${statusColors[value] ?? ""}`}
    >
      <option value="PENDING">New</option>
      <option value="REVIEWING">Screening</option>
      <option value="SHORTLISTED">Interview</option>
      <option value="ACCEPTED">Accepted</option>
      <option value="REJECTED">Rejected</option>
    </select>
  );
}
