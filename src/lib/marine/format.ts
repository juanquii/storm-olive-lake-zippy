const DIRS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

export function compass(deg: number | null | undefined): string {
  if (deg == null || Number.isNaN(deg)) return "—";
  const i = Math.round(rev(deg) / 22.5) % 16;
  return DIRS[i] ?? "—";
}

function rev(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function feet(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)} ft`;
}

export function knots(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(1)} kt`;
}

export function mph(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${Math.round(n)} mph`;
}

export function clock(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function weekday(date: Date): string {
  return date.toLocaleDateString([], { weekday: "short" });
}

export function sky(code: number | null): string {
  if (code == null) return "—";
  if (code === 0) return "Clear";
  if (code <= 2) return "Fair";
  if (code === 3) return "Overcast";
  if (code <= 49) return "Fog";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 82) return "Showers";
  return "Storms";
}

export function mToFt(m: number | null): number | null {
  if (m == null || Number.isNaN(m)) return null;
  return m * 3.28084;
}

export function kmhToKt(kmh: number | null): number | null {
  if (kmh == null || Number.isNaN(kmh)) return null;
  return kmh / 1.852;
}

export function cToF(c: number | null): number | null {
  if (c == null || Number.isNaN(c)) return null;
  return (c * 9) / 5 + 32;
}
