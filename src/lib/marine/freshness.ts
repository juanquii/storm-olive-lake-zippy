export type Freshness = "good" | "caution" | "poor" | "missing";

export function freshness(iso: string | null | undefined): Freshness {
  if (!iso) return "missing";
  const age = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(age) || age < 0) return "missing";
  if (age < 60 * 60 * 1000) return "good";
  if (age < 6 * 60 * 60 * 1000) return "caution";
  return "poor";
}

export function ageLabel(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
