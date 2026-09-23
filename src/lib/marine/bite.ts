import { BAND_LABEL } from "./grounds";
import { compass } from "./format";
import { moonInfo, nextWindow, solunarWindows, windowAt, type SolunarWindow } from "./moon";
import type { Band, Conditions, Exposure, Ground, MarineHour, TideBundle, WeatherHour } from "./types";

export type TideState = {
  height: number;
  rate: number;
  stage: "rising" | "falling" | "slack";
};

export type Score = {
  value: number;
  label: "Strong" | "Worth going" | "Marginal" | "Tough";
  reasons: string[];
  band: Band;
  exposure: Exposure;
};

const MAX = 126;

export function nearestRow<T extends { time: string }>(rows: T[], t: number): T | null {
  let best: T | null = null;
  let dist = Infinity;
  for (const row of rows) {
    const d = Math.abs(new Date(row.time).getTime() - t);
    if (d < dist) {
      dist = d;
      best = row;
    }
  }
  if (!best || dist > 100 * 60 * 1000) return null;
  return best;
}

export function tideAt(tide: TideBundle | null, t: number): TideState | null {
  if (!tide || tide.samples.length < 2) return null;
  let prev: { ms: number; height: number } | null = null;
  let next: { ms: number; height: number } | null = null;
  for (const s of tide.samples) {
    const ms = new Date(s.time).getTime();
    if (ms <= t) prev = { ms, height: s.height };
    if (ms >= t) {
      next = { ms, height: s.height };
      break;
    }
  }
  if (!prev || !next) return null;
  const span = next.ms - prev.ms;
  const height = span === 0 ? prev.height : prev.height + ((next.height - prev.height) * (t - prev.ms)) / span;
  const rate = span === 0 ? 0 : (next.height - prev.height) / (span / 3600000);
  const stage = rate > 0.15 ? "rising" : rate < -0.15 ? "falling" : "slack";
  return { height, rate, stage };
}

function tidePoints(rate: number): number {
  const a = Math.abs(rate);
  if (a >= 0.5) return 26;
  if (a >= 0.25) return 18;
  if (a >= 0.12) return 10;
  return 4;
}

function windPoints(mph: number | null, exposure: Exposure): number {
  if (mph == null) return 8;
  const bands: Record<Exposure, [number, number, number]> = {
    protected: [12, 16, 22],
    coastal: [15, 20, 25],
    open: [18, 25, 30],
  };
  const [good, ok, bad] = bands[exposure];
  if (mph < 4) return exposure === "protected" ? 14 : 12;
  if (mph <= good) return 18;
  if (mph <= ok) return 12;
  if (mph <= bad) return 6;
  return 0;
}

function seaPoints(waveFt: number | null, exposure: Exposure, wind: number | null): number {
  if (exposure === "protected") {
    if ((wind ?? 0) > 20) return 4;
    if ((waveFt ?? 0) > 7) return 10;
    return 16;
  }
  if (waveFt == null) return 8;
  if (exposure === "coastal") {
    if (waveFt < 2) return 18;
    if (waveFt < 3.5) return 14;
    if (waveFt < 5) return 8;
    if (waveFt < 7) return 3;
    return 0;
  }
  if (waveFt < 3) return 16;
  if (waveFt < 6) return 14;
  if (waveFt < 8) return 8;
  if (waveFt < 12) return 3;
  return 0;
}

function lightPoints(date: Date, exposure: Exposure): number {
  const h = date.getHours() + date.getMinutes() / 60;
  const dawn = h >= 5 && h < 8.5;
  const dusk = h >= 17 && h < 20.5;
  if (dawn || dusk) return 12;
  const night = h >= 21 || h < 5;
  if (night) return exposure === "open" ? 6 : 3;
  return 4;
}

function pressurePoints(now: number | null, earlier: number | null): { pts: number; note: string | null } {
  if (now == null || earlier == null) return { pts: 1, note: null };
  const drop = earlier - now;
  if (drop > 8) return { pts: 0, note: "Pressure is crashing" };
  if (drop > 3) return { pts: 4, note: "Pressure is falling" };
  if (drop < -3) return { pts: 2, note: "Pressure is rising" };
  return { pts: 1, note: null };
}

function observedWave(
  conditions: Conditions,
  when: Date,
  exposure: Exposure,
): { ft: number; id: string } | null {
  const buoy = conditions.buoy;
  if (!buoy || buoy.waveFt == null || exposure === "protected") return null;
  if (buoy.ageMin > 180 || buoy.distanceMi > 80) return null;
  if (Math.abs(when.getTime() - Date.now()) > 3 * 3600000) return null;
  return { ft: buoy.waveFt, id: buoy.id };
}

function labelFor(value: number): Score["label"] {
  if (value >= 75) return "Strong";
  if (value >= 58) return "Worth going";
  if (value >= 42) return "Marginal";
  return "Tough";
}

export function scoreAt(opts: {
  when: Date;
  exposure: Exposure;
  band: Band;
  conditions: Conditions;
  lat: number;
  lng: number;
}): Score {
  const { when, exposure, band, conditions } = opts;
  const t = when.getTime();
  const marine = nearestRow(conditions.marineHourly, t);
  const weather = nearestRow(conditions.weatherHourly, t);
  const tide = tideAt(conditions.tide, t);
  const windows = solunarWindows(when, opts.lat, opts.lng);
  const active = windowAt(windows, when);
  const moon = moonInfo(when);
  const nearMoon = moon.ageDays < 2 || moon.ageDays > 27.5 || Math.abs(moon.ageDays - SYNODIC_HALF) < 2;

  const weatherPrev = nearestRow(conditions.weatherHourly, t - 3 * 3600000);
  const pressure = pressurePoints(weather?.pressureMb ?? null, weatherPrev?.pressureMb ?? null);

  let solunarPts = 2;
  if (active?.kind === "major") solunarPts = 22;
  else if (active?.kind === "minor") solunarPts = 12;
  else {
    const upcoming = nextWindow(windows, when);
    if (upcoming && upcoming.start.getTime() - t < 90 * 60 * 1000) solunarPts = 6;
  }

  const tidePts = tide ? tidePoints(tide.rate) : 10;
  const windPts = windPoints(weather?.windMph ?? null, exposure);
  const buoyWave = observedWave(conditions, when, exposure);
  const waveFt = buoyWave?.ft ?? marine?.waveFt ?? null;
  const seaPts = seaPoints(waveFt, exposure, weather?.windMph ?? null);
  const light = lightPoints(when, exposure);
  const moonPts = nearMoon ? 6 : 2;
  const raw = 20 + tidePts + solunarPts + light + windPts + seaPts + moonPts + pressure.pts;
  const value = Math.max(0, Math.min(100, Math.round((raw / MAX) * 100)));

  const reasons: string[] = [];
  if (tide) {
    if (tide.stage === "slack") reasons.push("Tide is slack");
    else reasons.push(`Tide is ${tide.stage} at ${Math.abs(tide.rate).toFixed(1)} ft/hr`);
  } else reasons.push("No tide station on this read");
  if (active) reasons.push(`${active.kind === "major" ? "Major" : "Minor"} solunar · ${active.label.toLowerCase()}`);
  if (weather?.windMph != null) {
    reasons.push(`Wind ${Math.round(weather.windMph)} mph from ${compass(weather.windDir)}`);
  }
  if (buoyWave) {
    reasons.push(`Buoy ${buoyWave.id} ${buoyWave.ft.toFixed(1)} ft`);
  } else if (marine?.waveFt != null) {
    reasons.push(`Model seas ${marine.waveFt.toFixed(1)} ft`);
  }
  if (pressure.note) reasons.push(pressure.note);

  return { value, label: labelFor(value), reasons: reasons.slice(0, 4), band, exposure };
}

const SYNODIC_HALF = 29.530588853 / 2;

const PROFILES: { band: Band; exposure: Exposure }[] = [
  { band: "inshore", exposure: "protected" },
  { band: "nearshore", exposure: "coastal" },
  { band: "offshore", exposure: "open" },
];

export function recommendBand(opts: {
  when: Date;
  conditions: Conditions;
  lat: number;
  lng: number;
}): Score {
  const scores = PROFILES.map((p) => scoreAt({ ...opts, ...p }));
  scores.sort((a, b) => b.value - a.value);
  return scores[0]!;
}

export type BestWindow = {
  start: Date;
  end: Date;
  score: number;
};

export function bestWindow(opts: {
  day: Date;
  exposure: Exposure;
  band: Band;
  conditions: Conditions;
  lat: number;
  lng: number;
}): BestWindow | null {
  const midnight = new Date(opts.day);
  midnight.setHours(0, 0, 0, 0);
  const hours: { date: Date; score: number }[] = [];
  for (let h = 4; h <= 21; h++) {
    const date = new Date(midnight);
    date.setHours(h, 0, 0, 0);
  if (sameCivilDay(opts.day, new Date()) && date.getTime() < Date.now() - 30 * 60 * 1000) {
      continue;
    }
    const score = scoreAt({ when: date, ...opts }).value;
    hours.push({ date, score });
  }
  if (!hours.length) return null;
  let peak = hours[0]!;
  for (const h of hours) if (h.score > peak.score) peak = h;
  const keep = hours.filter((h) => peak.score - h.score <= 8);
  const peakIdx = keep.findIndex((h) => h.date.getTime() === peak.date.getTime());
  let from = peakIdx;
  let to = peakIdx;
  while (from > 0 && keep[from]!.date.getTime() - keep[from - 1]!.date.getTime() <= 70 * 60 * 1000) from--;
  while (to < keep.length - 1 && keep[to + 1]!.date.getTime() - keep[to]!.date.getTime() <= 70 * 60 * 1000) to++;
  const start = keep[Math.max(from, peakIdx - 1)]!.date;
  const endDate = keep[Math.min(to, peakIdx + 1)]!.date;
  const end = new Date(endDate.getTime() + 60 * 60 * 1000);
  return { start, end, score: peak.score };
}

export function inSeason(ground: Ground, month: number) {
  return ground.species.filter((s) => s.months.includes(month));
}

export function fishingRead(opts: {
  ground: Ground;
  neighbors: Ground[];
  when: Date;
  score: Score;
  tide: TideState | null;
  seasFt: number | null;
  recommendation: Score;
  window: BestWindow | null;
  month: number;
  active: SolunarWindow | null;
}): string {
  const { ground, tide, seasFt, recommendation, window, month, neighbors, active } = opts;
  const moving =
    tide == null
      ? "Tide isn't on this station."
      : tide.stage === "slack"
        ? "The tide is slack, so bait isn't being pushed."
        : `The tide is ${tide.stage}, which is the part worth fishing.`;

  const seas =
    seasFt == null
      ? ""
      : recommendation.band === "inshore" && seasFt >= 4
        ? ` Open water is about ${seasFt.toFixed(0)} ft, so stay inside.`
        : recommendation.band === "offshore" && seasFt < 6
          ? ` Seas are about ${seasFt.toFixed(0)} ft — a canyon day if the rest of the forecast holds.`
          : recommendation.band === "nearshore" && seasFt >= 5
            ? ` Seas are about ${seasFt.toFixed(0)} ft. Nearshore only if you like a wet ride; inshore is kinder.`
            : ` Seas are about ${seasFt.toFixed(0)} ft.`;

  const where =
    recommendation.band === ground.band
      ? ` This ${BAND_LABEL[ground.band].toLowerCase()} water is the call.`
      : ` ${BAND_LABEL[recommendation.band]} looks better than ${BAND_LABEL[ground.band].toLowerCase()} today.`;

  const pool = neighbors.filter((g) => g.band === recommendation.band);
  const names = uniqueSpecies(pool.length ? pool : [ground], month).slice(0, 2);
  const fish = names.length ? ` Look for ${names.join(" and ")}.` : "";

  const sol = active ? ` You're in a ${active.kind} window (${active.label.toLowerCase()}).` : "";

  const win = window
    ? ` Best window ${clockShort(window.start)}–${clockShort(window.end)}.`
    : "";

  return `${moving}${seas}${where}${fish}${sol}${win}`.replace(/\s+/g, " ").trim();
}

function uniqueSpecies(grounds: Ground[], month: number): string[] {
  const names: string[] = [];
  for (const g of grounds) {
    for (const s of inSeason(g, month)) {
      if (!names.includes(s.name)) names.push(s.name);
    }
  }
  return names;
}

function clockShort(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function snapshotMarine(conditions: Conditions, when: Date): MarineHour | null {
  return nearestRow(conditions.marineHourly, when.getTime());
}

export function snapshotWeather(conditions: Conditions, when: Date): WeatherHour | null {
  return nearestRow(conditions.weatherHourly, when.getTime());
}

function sameCivilDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
