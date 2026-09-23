export type MoonInfo = {
  /** 0 new → 1 full-ish illumination fraction. */
  illumination: number;
  /** Days since new moon, 0–29.53. */
  ageDays: number;
  name: string;
  waxing: boolean;
};

export type SolunarWindow = {
  kind: "major" | "minor";
  label: "Moon overhead" | "Moon underfoot" | "Moonrise" | "Moonset";
  start: Date;
  peak: Date;
  end: Date;
};

const SYNODIC = 29.530588853;
const KNOWN_NEW = Date.UTC(2000, 0, 6, 18, 14, 0);

function rev(deg: number): number {
  return ((deg % 360) + 360) % 360;
}
function rad(d: number): number {
  return (d * Math.PI) / 180;
}
function deg(r: number): number {
  return (r * 180) / Math.PI;
}

export function moonInfo(date: Date): MoonInfo {
  const days = (date.getTime() - KNOWN_NEW) / 86400000;
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC;
  const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2;
  const waxing = age < SYNODIC / 2;
  let name = "Waxing crescent";
  if (age < 1.5) name = "New moon";
  else if (age < 6.5) name = "Waxing crescent";
  else if (age < 8.5) name = "First quarter";
  else if (age < 13.5) name = "Waxing gibbous";
  else if (age < 16.2) name = "Full moon";
  else if (age < 21.5) name = "Waning gibbous";
  else if (age < 23.5) name = "Last quarter";
  else if (age < 28) name = "Waning crescent";
  else name = "New moon";
  return { illumination, ageDays: age, name, waxing };
}

/** Days since 1999-12-31 00:00 UTC (Schlyter day number). */
function schlyterDay(date: Date): number {
  return date.getTime() / 86400000 - 10956;
}

function moonEquatorial(d: number): { ra: number; dec: number } {
  const N = rev(125.1228 - 0.0529538083 * d);
  const i = 5.1454;
  const w = rev(318.0634 + 0.1643573223 * d);
  const a = 60.2666;
  const e = 0.0549;
  const M = rev(115.3654 + 13.0649929509 * d);
  let E = M + deg(e) * Math.sin(rad(M)) * (1 + e * Math.cos(rad(M)));
  for (let k = 0; k < 6; k++) {
    E = E - (E - deg(e * Math.sin(rad(E))) - M) / (1 - e * Math.cos(rad(E)));
  }
  const xv = a * (Math.cos(rad(E)) - e);
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(rad(E));
  const v = deg(Math.atan2(yv, xv));
  const r = Math.hypot(xv, yv);
  const xh = r * (Math.cos(rad(N)) * Math.cos(rad(v + w)) - Math.sin(rad(N)) * Math.sin(rad(v + w)) * Math.cos(rad(i)));
  const yh = r * (Math.sin(rad(N)) * Math.cos(rad(v + w)) + Math.cos(rad(N)) * Math.sin(rad(v + w)) * Math.cos(rad(i)));
  const zh = r * Math.sin(rad(v + w)) * Math.sin(rad(i));
  const obl = 23.4393 - 3.563e-7 * d;
  const xe = xh;
  const ye = yh * Math.cos(rad(obl)) - zh * Math.sin(rad(obl));
  const ze = yh * Math.sin(rad(obl)) + zh * Math.cos(rad(obl));
  return { ra: rev(deg(Math.atan2(ye, xe))), dec: deg(Math.atan2(ze, Math.hypot(xe, ye))) };
}

function altitude(date: Date, lat: number, lng: number): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const { ra, dec } = moonEquatorial(schlyterDay(date));
  const T = (jd - 2451545.0) / 36525;
  const gmst = rev(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  const lst = rev(gmst + lng);
  let ha = lst - ra;
  if (ha > 180) ha -= 360;
  if (ha < -180) ha += 360;
  const sinAlt =
    Math.sin(rad(lat)) * Math.sin(rad(dec)) +
    Math.cos(rad(lat)) * Math.cos(rad(dec)) * Math.cos(rad(ha));
  return deg(Math.asin(Math.max(-1, Math.min(1, sinAlt))));
}

function localMidnight(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Solunar majors around upper and lower transit, minors around rise and set.
 * Good to roughly half an hour — enough to plan a tide, not a launch window.
 */
export function solunarWindows(date: Date, lat: number, lng: number): SolunarWindow[] {
  const start = localMidnight(date);
  const end = new Date(start.getTime() + 24 * 3600000);
  const step = 6 * 60 * 1000;
  const samples: { t: number; alt: number }[] = [];
  for (let t = start.getTime() - 2 * 3600000; t <= end.getTime() + 2 * 3600000; t += step) {
    samples.push({ t, alt: altitude(new Date(t), lat, lng) });
  }

  let max = samples[0]!;
  let min = samples[0]!;
  for (const s of samples) {
    if (s.t < start.getTime() || s.t >= end.getTime()) continue;
    if (s.alt > max.alt) max = s;
    if (s.alt < min.alt) min = s;
  }

  const windows: SolunarWindow[] = [];
  const pushTransit = (peakMs: number, label: SolunarWindow["label"]) => {
    const peak = new Date(peakMs);
    windows.push({
      kind: "major",
      label,
      peak,
      start: new Date(peakMs - 60 * 60 * 1000),
      end: new Date(peakMs + 60 * 60 * 1000),
    });
  };
  if (max.t >= start.getTime() && max.t < end.getTime()) pushTransit(max.t, "Moon overhead");
  if (min.t >= start.getTime() && min.t < end.getTime() && min.t !== max.t) {
    pushTransit(min.t, "Moon underfoot");
  }

  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1]!;
    const b = samples[i]!;
    if (a.alt === b.alt) continue;
    const crosses = (a.alt < 0 && b.alt >= 0) || (a.alt >= 0 && b.alt < 0);
    if (!crosses) continue;
    const f = a.alt / (a.alt - b.alt);
    const t = a.t + (b.t - a.t) * f;
    if (t < start.getTime() || t >= end.getTime()) continue;
    const rising = b.alt > a.alt;
    const peak = new Date(t);
    windows.push({
      kind: "minor",
      label: rising ? "Moonrise" : "Moonset",
      peak,
      start: new Date(t - 30 * 60 * 1000),
      end: new Date(t + 30 * 60 * 1000),
    });
  }

  windows.sort((a, b) => a.peak.getTime() - b.peak.getTime());
  return windows;
}

export function windowAt(windows: SolunarWindow[], date: Date): SolunarWindow | null {
  const t = date.getTime();
  return windows.find((w) => t >= w.start.getTime() && t <= w.end.getTime()) ?? null;
}

export function nextWindow(windows: SolunarWindow[], date: Date): SolunarWindow | null {
  const t = date.getTime();
  return windows.find((w) => w.end.getTime() > t) ?? null;
}
