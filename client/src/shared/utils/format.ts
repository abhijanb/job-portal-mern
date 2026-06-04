import { formatDistanceToNow, format } from "date-fns";

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 1) return formatDistanceToNow(date, { addSuffix: true });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return format(date, "MMM d, yyyy");
}

export function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return min ? fmt(min) : `Up to ${fmt(max!)}`;
}
