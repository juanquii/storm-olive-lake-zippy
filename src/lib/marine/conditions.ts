import { createServerFn } from "@tanstack/react-start";
import { miles, nearest } from "./geo";
import { cToF, kmhToKt, mToFt } from "./format";
import type {
  BuoyObs,
  Conditions,
  CurrentBundle,
  CurrentEvent,
  MarineHour,
  TideBundle,
  TideExtreme,
  TideSample,
  WeatherHour,
} from "./types";

type Input = { lat: number; lng: number; stationId: string; stationName: string; distanceMi: number };

function num(v: unknown): number | null {
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  return v;
}

function iso(t: string): string {
  if (t.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(t)) return new Date(t).toISOString();
  return new Date(t.replace(" ", "T") + "Z").toISOString();
}

function ymd(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export const getConditions = createServerFn({ method: "GET" })
  .validator((input: Input) => {
    if (!Number.isFinite(input.lat) || input.lat < -85 || input.lat > 85) {
      throw new Error("Latitude is out of range.");
    }
    if (!Number.isFinite(input.lng) || input.lng < -180 || input.lng > 180) {
      throw new Error("Longitude is out of range.");
    }
    if (!/^\d{7}$/.test(input.stationId)) throw new Error("Unknown tide station.");
    if (!Number.isFinite(input.distanceMi) || input.distanceMi < 0 || input.distanceMi > 5000) {
      throw new Error("Bad station distance.");
    }
    const stationName = input.stationName.replace(/[^\w\s,.'’\-]/g, "").slice(0, 80);
    return { ...input, stationName };
  })
  .handler(async ({ data }): Promise<Conditions> => {
    const errors: string[] = [];
    const marineUrl = new URL("https://marine-api.open-meteo.com/v1/marine");
    marineUrl.searchParams.set("latitude", String(data.lat));
    marineUrl.searchParams.set("longitude", String(data.lng));
    marineUrl.searchParams.set(
      "hourly",
      [
        "wave_height",
        "wave_direction",
        "wave_period",
        "swell_wave_height",
        "swell_wave_direction",
        "swell_wave_period",
        "ocean_current_velocity",
        "ocean_current_direction",
        "sea_surface_temperature",
      ].join(","),
    );
    marineUrl.searchParams.set("timezone", "GMT");
    marineUrl.searchParams.set("forecast_days", "3");
    marineUrl.searchParams.set("past_days", "1");
    marineUrl.searchParams.set("length_unit", "metric");

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", String(data.lat));
    weatherUrl.searchParams.set("longitude", String(data.lng));
    weatherUrl.searchParams.set(
      "hourly",
      ["wind_speed_10m", "wind_direction_10m", "wind_gusts_10m", "pressure_msl", "weather_code"].join(","),
    );
    weatherUrl.searchParams.set("timezone", "GMT");
    weatherUrl.searchParams.set("forecast_days", "3");
    weatherUrl.searchParams.set("past_days", "1");
    weatherUrl.searchParams.set("wind_speed_unit", "mph");

    const begin = new Date(Date.now() - 24 * 3600000);
    const end = new Date(Date.now() + 3 * 24 * 3600000);
    const tideUrl = new URL("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter");
    const tideBase = {
      begin_date: ymd(begin),
      end_date: ymd(end),
      station: data.stationId,
      product: "predictions",
      datum: "MLLW",
      time_zone: "gmt",
      units: "english",
      format: "json",
      application: "NecuzeOn",
    };

    const hourlyTide = new URL(tideUrl);
    for (const [k, v] of Object.entries({ ...tideBase, interval: "30" })) hourlyTide.searchParams.set(k, v);
    const extremeTide = new URL(tideUrl);
    for (const [k, v] of Object.entries({ ...tideBase, interval: "hilo" })) extremeTide.searchParams.set(k, v);

    const [marineRes, weatherRes, tideRes, extremeRes, current, buoy] = await Promise.all([
      pull(marineUrl),
      pull(weatherUrl),
      pull(hourlyTide),
      pull(extremeTide),
      loadCurrent(data.lat, data.lng),
      loadBuoy(data.lat, data.lng),
    ]);

    let marineHourly: MarineHour[] = [];
    if (marineRes.ok) {
      marineHourly = parseMarine(marineRes.json);
    } else errors.push("Wave and current model didn't answer.");

    let weatherHourly: WeatherHour[] = [];
    if (weatherRes.ok) {
      weatherHourly = parseWeather(weatherRes.json);
    } else errors.push("Wind forecast didn't answer.");

    let tide: TideBundle | null = null;
    if (tideRes.ok && extremeRes.ok) {
      const samples = parseTideSamples(tideRes.json);
      const extremes = parseExtremes(extremeRes.json);
      if (samples.length) {
        tide = {
          stationId: data.stationId,
          stationName: data.stationName,
          distanceMi: data.distanceMi,
          samples,
          extremes,
        };
      } else errors.push("No tide predictions for that station.");
    } else errors.push("Tide predictions didn't answer.");

    return { marineHourly, weatherHourly, tide, current, buoy, errors };
  });

async function pull(url: URL): Promise<{ ok: boolean; json: unknown }> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return { ok: false, json: null };
    const json: unknown = await res.json();
    if (json && typeof json === "object" && "error" in json && !("hourly" in json) && !("predictions" in json)) {
      return { ok: false, json };
    }
    return { ok: true, json };
  } catch {
    return { ok: false, json: null };
  }
}

function rows(json: unknown): { time: string[]; hourly: Record<string, unknown> } | null {
  if (!json || typeof json !== "object") return null;
  const hourly = (json as { hourly?: unknown }).hourly;
  if (!hourly || typeof hourly !== "object") return null;
  const time = (hourly as { time?: unknown }).time;
  if (!Array.isArray(time)) return null;
  return { time: time.filter((t): t is string => typeof t === "string"), hourly: hourly as Record<string, unknown> };
}

function col(hourly: Record<string, unknown>, key: string, i: number): number | null {
  const arr = hourly[key];
  if (!Array.isArray(arr)) return null;
  return num(arr[i]);
}

function parseMarine(json: unknown): MarineHour[] {
  const parsed = rows(json);
  if (!parsed) return [];
  return parsed.time.map((time, i) => ({
    time: iso(time),
    waveFt: mToFt(col(parsed.hourly, "wave_height", i)),
    waveDir: col(parsed.hourly, "wave_direction", i),
    swellFt: mToFt(col(parsed.hourly, "swell_wave_height", i)),
    swellDir: col(parsed.hourly, "swell_wave_direction", i),
    swellPeriodS: col(parsed.hourly, "swell_wave_period", i),
    wavePeriodS: col(parsed.hourly, "wave_period", i),
    currentKt: kmhToKt(col(parsed.hourly, "ocean_current_velocity", i)),
    currentDir: col(parsed.hourly, "ocean_current_direction", i),
    sstF: cToF(col(parsed.hourly, "sea_surface_temperature", i)),
  }));
}

function parseWeather(json: unknown): WeatherHour[] {
  const parsed = rows(json);
  if (!parsed) return [];
  return parsed.time.map((time, i) => ({
    time: iso(time),
    windMph: col(parsed.hourly, "wind_speed_10m", i),
    gustMph: col(parsed.hourly, "wind_gusts_10m", i),
    windDir: col(parsed.hourly, "wind_direction_10m", i),
    pressureMb: col(parsed.hourly, "pressure_msl", i),
    code: col(parsed.hourly, "weather_code", i),
  }));
}

function predictions(json: unknown): Record<string, string>[] {
  if (!json || typeof json !== "object") return [];
  const list = (json as { predictions?: unknown }).predictions;
  if (!Array.isArray(list)) return [];
  return list.filter((row): row is Record<string, string> => !!row && typeof row === "object");
}

function parseTideSamples(json: unknown): TideSample[] {
  return predictions(json)
    .map((row) => ({
      time: typeof row.t === "string" ? iso(row.t) : "",
      height: Number(row.v),
    }))
    .filter((row) => row.time && Number.isFinite(row.height));
}

function parseExtremes(json: unknown): TideExtreme[] {
  return predictions(json)
    .map((row) => ({
      time: typeof row.t === "string" ? iso(row.t) : "",
      height: Number(row.v),
      type: row.type === "H" || row.type === "L" ? row.type : null,
    }))
    .filter((row): row is TideExtreme => !!row.time && Number.isFinite(row.height) && row.type !== null);
}

type CurrentStation = { id: string; name: string; lat: number; lng: number; bin: number };

let currentCache: { at: number; stations: CurrentStation[] } | null = null;
let buoyCache: { at: number; stations: { id: string; name: string; lat: number; lng: number }[] } | null = null;

async function loadCurrent(lat: number, lng: number): Promise<CurrentBundle | null> {
  try {
    const stations = await currentStations();
    const pick = nearest(lat, lng, stations);
    if (!pick || pick.distanceMi > 40) return null;
    const begin = new Date(Date.now() - 24 * 3600000);
    const end = new Date(Date.now() + 2 * 24 * 3600000);
    const url = new URL("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter");
    url.searchParams.set("begin_date", ymd(begin));
    url.searchParams.set("end_date", ymd(end));
    url.searchParams.set("station", pick.item.id);
    url.searchParams.set("bin", String(pick.item.bin));
    url.searchParams.set("product", "currents_predictions");
    url.searchParams.set("time_zone", "gmt");
    url.searchParams.set("units", "english");
    url.searchParams.set("format", "json");
    url.searchParams.set("application", "NecuzeOn");
    const res = await pull(url);
    if (!res.ok) return null;
    const events = parseCurrentEvents(res.json);
    if (events.length < 2) return null;
    return {
      stationId: pick.item.id,
      stationName: pick.item.name,
      distanceMi: Math.round(pick.distanceMi * 10) / 10,
      events,
    };
  } catch {
    return null;
  }
}

async function currentStations(): Promise<CurrentStation[]> {
  if (currentCache && Date.now() - currentCache.at < 12 * 3600000) return currentCache.stations;
  const url = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=currentpredictions&units=english";
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error("current stations");
  const json: unknown = await res.json();
  const list = json && typeof json === "object" ? (json as { stations?: unknown }).stations : null;
  if (!Array.isArray(list)) throw new Error("current stations");
  const best = new Map<string, CurrentStation>();
  for (const row of list) {
    if (!row || typeof row !== "object") continue;
    const rec = row as { id?: unknown; name?: unknown; lat?: unknown; lng?: unknown; currbin?: unknown };
    if (typeof rec.id !== "string" || !/^[A-Za-z0-9]{4,12}$/.test(rec.id)) continue;
    if (typeof rec.lat !== "number" || typeof rec.lng !== "number") continue;
    const bin = typeof rec.currbin === "number" && rec.currbin > 0 ? rec.currbin : 1;
    const station: CurrentStation = {
      id: rec.id,
      name: typeof rec.name === "string" ? rec.name.slice(0, 80) : rec.id,
      lat: rec.lat,
      lng: rec.lng,
      bin,
    };
    const prev = best.get(station.id);
    if (!prev || station.bin < prev.bin) best.set(station.id, station);
  }
  const stations = [...best.values()];
  currentCache = { at: Date.now(), stations };
  return stations;
}

function parseCurrentEvents(json: unknown): CurrentEvent[] {
  if (!json || typeof json !== "object") return [];
  const root = (json as { current_predictions?: { cp?: unknown } }).current_predictions;
  if (!root || !Array.isArray(root.cp)) return [];
  const events: CurrentEvent[] = [];
  for (const row of root.cp) {
    if (!row || typeof row !== "object") continue;
    const rec = row as Record<string, unknown>;
    const time = typeof rec.Time === "string" ? iso(rec.Time) : "";
    const vel = Number(rec.Velocity_Major);
    const floodDir = Number(rec.meanFloodDir);
    const ebbDir = Number(rec.meanEbbDir);
    if (!time || !Number.isFinite(vel) || !Number.isFinite(floodDir) || !Number.isFinite(ebbDir)) continue;
    events.push({ time, velKt: vel, floodDir, ebbDir });
  }
  events.sort((a, b) => a.time.localeCompare(b.time));
  return events;
}

export function currentAt(
  bundle: CurrentBundle | null,
  t: number,
): { speedKt: number; dir: number | null; stage: "flood" | "ebb" | "slack" } | null {
  if (!bundle || bundle.events.length < 2) return null;
  const events = bundle.events;
  const first = new Date(events[0].time).getTime();
  if (t < first) return null;
  for (let i = 1; i < events.length; i++) {
    const prev = events[i - 1];
    const next = events[i];
    const t0 = new Date(prev.time).getTime();
    const t1 = new Date(next.time).getTime();
    if (t > t1) continue;
    const span = t1 - t0 || 1;
    const u = Math.min(1, Math.max(0, (t - t0) / span));
    const vel = prev.velKt + (next.velKt - prev.velKt) * u;
    const speedKt = Math.abs(vel);
    const stage = speedKt < 0.2 ? "slack" : vel > 0 ? "flood" : "ebb";
    const dir = stage === "flood" ? prev.floodDir : stage === "ebb" ? prev.ebbDir : null;
    return { speedKt, dir, stage };
  }
  return null;
}

async function loadBuoy(lat: number, lng: number): Promise<BuoyObs | null> {
  try {
    const stations = await buoyStations();
    const ranked = stations
      .map((item) => ({ item, distanceMi: miles(lat, lng, item.lat, item.lng) }))
      .filter((row) => row.distanceMi <= 90)
      .sort((a, b) => a.distanceMi - b.distanceMi)
      .slice(0, 4);
    for (const row of ranked) {
      const obs = await buoyObs(row.item.id);
      if (!obs) continue;
      return {
        ...obs,
        id: row.item.id,
        name: row.item.name,
        lat: row.item.lat,
        lng: row.item.lng,
        distanceMi: Math.round(row.distanceMi),
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function buoyStations(): Promise<{ id: string; name: string; lat: number; lng: number }[]> {
  if (buoyCache && Date.now() - buoyCache.at < 12 * 3600000) return buoyCache.stations;
  const res = await fetch("https://www.ndbc.noaa.gov/activestations.xml", {
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error("buoys");
  const xml = await res.text();
  const stations: { id: string; name: string; lat: number; lng: number }[] = [];
  for (const match of xml.matchAll(/<station\s+([^>]+)>/g)) {
    const attrs = match[1];
    const id = attr(attrs, "id");
    const lat = Number(attr(attrs, "lat"));
    const lng = Number(attr(attrs, "lon"));
    if (!id || !/^[A-Za-z0-9]{3,10}$/.test(id) || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const name = decodeXml(attr(attrs, "name") || id);
    stations.push({ id, name, lat, lng });
  }
  buoyCache = { at: Date.now(), stations };
  return stations;
}

async function buoyObs(id: string): Promise<Omit<BuoyObs, "id" | "name" | "distanceMi" | "lat" | "lng"> | null> {
  const res = await fetch(`https://www.ndbc.noaa.gov/data/realtime2/${id}.txt`, {
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return null;
  return parseBuoy(await res.text());
}

function parseBuoy(text: string): Omit<BuoyObs, "id" | "name" | "distanceMi" | "lat" | "lng"> | null {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const header = lines.find((line) => line.startsWith("#") && line.includes("WVHT"));
  if (!header) return null;
  const cols = header.replace(/^#/, "").trim().split(/\s+/);
  const at = (name: string) => cols.indexOf(name);
  const iYear = at("YY");
  const iWave = at("WVHT");
  if (iYear < 0 || iWave < 0) return null;
  const iMonth = at("MM");
  const iDay = at("DD");
  const iHour = at("hh");
  const iMin = at("mm");
  const iDir = at("MWD");
  const iPeriod = at("DPD");
  const iWind = at("WSPD");
  const iGust = at("GST");
  const iWindDir = at("WDIR");
  for (const line of lines) {
    if (line.startsWith("#")) continue;
    const p = line.split(/\s+/);
    const wave = metric(p[iWave]);
    if (wave == null) continue;
    const year = Number(p[iYear]);
    const month = Number(p[iMonth]);
    const day = Number(p[iDay]);
    const hour = Number(p[iHour]);
    const minute = Number(p[iMin]);
    if (![year, month, day, hour, minute].every(Number.isFinite)) continue;
    const time = Date.UTC(year, month - 1, day, hour, minute);
    const ageMin = Math.max(0, Math.round((Date.now() - time) / 60000));
    if (ageMin > 6 * 60) continue;
    return {
      ageMin,
      waveFt: wave * 3.28084,
      wavePeriodS: metric(p[iPeriod]),
      waveDir: metric(p[iDir]),
      windMph: msToMph(metric(p[iWind])),
      gustMph: msToMph(metric(p[iGust])),
      windDir: metric(p[iWindDir]),
    };
  }
  return null;
}

function metric(value: string | undefined): number | null {
  if (!value || value === "MM") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function msToMph(value: number | null): number | null {
  if (value == null) return null;
  return value * 2.23694;
}

function attr(source: string, name: string): string | null {
  const match = source.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : null;
}

function decodeXml(value: string): string {
  return value
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">");
}
