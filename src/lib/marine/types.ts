export type Band = "inshore" | "nearshore" | "offshore";

export type Exposure = "protected" | "coastal" | "open";

export type Species = {
  name: string;
  /** Calendar months, 1–12, when this fish is a realistic target. */
  months: number[];
  note: string;
};

export type Ground = {
  id: string;
  name: string;
  region: RegionId;
  band: Band;
  exposure: Exposure;
  lat: number;
  lng: number;
  /** Closed ring as [lat, lng]. */
  ring: [number, number][];
  depth: string;
  structure: string;
  tactic: string;
  species: Species[];
};

export type RegionId =
  | "chesapeake"
  | "outer-banks"
  | "southeast"
  | "florida"
  | "gulf"
  | "northeast"
  | "pacific";

export type TideSample = { time: string; height: number };
export type TideExtreme = { time: string; height: number; type: "H" | "L" };

export type MarineHour = {
  time: string;
  waveFt: number | null;
  waveDir: number | null;
  swellFt: number | null;
  swellDir: number | null;
  swellPeriodS: number | null;
  wavePeriodS: number | null;
  currentKt: number | null;
  currentDir: number | null;
  sstF: number | null;
};

export type WeatherHour = {
  time: string;
  windMph: number | null;
  gustMph: number | null;
  windDir: number | null;
  pressureMb: number | null;
  code: number | null;
};

export type TideBundle = {
  stationId: string;
  stationName: string;
  distanceMi: number;
  samples: TideSample[];
  extremes: TideExtreme[];
};

export type CurrentEvent = {
  time: string;
  /** Signed knots. Positive floods, negative ebbs. */
  velKt: number;
  floodDir: number;
  ebbDir: number;
};

export type CurrentBundle = {
  stationId: string;
  stationName: string;
  distanceMi: number;
  events: CurrentEvent[];
};

export type BuoyObs = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceMi: number;
  ageMin: number;
  waveFt: number | null;
  wavePeriodS: number | null;
  waveDir: number | null;
  windMph: number | null;
  gustMph: number | null;
  windDir: number | null;
};

export type Conditions = {
  marineHourly: MarineHour[];
  weatherHourly: WeatherHour[];
  tide: TideBundle | null;
  current: CurrentBundle | null;
  buoy: BuoyObs | null;
  /** Nearest live NDBC buoys with obs (primary first). Max ~3. */
  buoys: BuoyObs[];
  errors: string[];
};
