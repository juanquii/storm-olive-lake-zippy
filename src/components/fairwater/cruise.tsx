import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrief, type MarineBrief } from "@/lib/marine/brief";
import { getConditions, currentAt } from "@/lib/marine/conditions";
import type { Conditions } from "@/lib/marine/types";
import { catchesCsv, downloadText, parseGpx, toGpx } from "@/lib/marine/gpx";
import { compass, clock } from "@/lib/marine/format";
import { ageLabel, freshness } from "@/lib/marine/freshness";
import { inletGate, nwsWind } from "@/lib/marine/gate";
import { bearing, miles } from "@/lib/marine/geo";
import { INLETS, MARINAS, inletById, marinaById, type MarinaId } from "@/lib/marine/inlets";
import { moonInfo } from "@/lib/marine/moon";
import { shoalAdvisory } from "@/lib/marine/shoal";
import { tideAt } from "@/lib/marine/bite";
import { sunTimes } from "@/lib/marine/sun";
import { TIDE_STATIONS } from "@/lib/marine/stations";
import {
  CHECKLIST_ITEMS,
  OFFSHORE_ONE_WAY_NM,
  planFuelNm,
  routeFuel,
  useBoat,
} from "@/store/boat";
import { useTrip, type HelmMode } from "@/store/trip";
import { cn } from "@/lib/cn";

const DMF_PAGE =
  "https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/fisheries-management-proclamations";

const BRIEF_CACHE_KEY = "fairwater-brief-last";
const CONDITIONS_CACHE_KEY = "fairwater-conditions-last";
const GATE_CACHE_KEY = "fairwater-gate-last";

type CachedBrief = { at: string; zone: string; brief: MarineBrief };
type CachedConditions = { at: string; inletId: string; conditions: Conditions };
type CachedGate = { inletId: string; gate: "go" | "caution" | "no-go"; reasons: string[]; at: string };
type SlotId = "now" | "plus6" | "tomorrow";

function num(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function routeClosedNote(closed: boolean): string {
  return closed ? "Marks already loop home, so the burn is not doubled." : "Open path is doubled for the ride home.";
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function nearRow<T extends { time: string }>(rows: T[], t: number): T | null {
  let best: T | null = null;
  let gap = Infinity;
  for (const row of rows) {
    const delta = Math.abs(new Date(row.time).getTime() - t);
    if (delta < gap) {
      gap = delta;
      best = row;
    }
  }
  return best && gap <= 90 * 60 * 1000 ? best : null;
}

function slotTime(slot: SlotId, now: Date): number {
  if (slot === "plus6") return now.getTime() + 6 * 60 * 60 * 1000;
  if (slot === "tomorrow") {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(7, 30, 0, 0);
    return next.getTime();
  }
  return now.getTime();
}

function nearestWeather(
  rows: { time: string; windMph: number | null }[],
  t: number,
): { windMph: number | null } | null {
  let best: { windMph: number | null } | null = null;
  let gap = Infinity;
  for (const row of rows) {
    const delta = Math.abs(new Date(row.time).getTime() - t);
    if (delta < gap) {
      gap = delta;
      best = row;
    }
  }
  return best;
}

function readCachedBrief(): CachedBrief | null {
  return readJson<CachedBrief>(BRIEF_CACHE_KEY);
}

function Fold({ title, meta, children, defaultOpen = false, className }: { title: string; meta?: string; children: ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={cn("border-t border-line pt-1", className)}>
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-base font-medium text-fg">{title}</span>
        <span className="shrink-0 text-sm text-muted">
          {meta ? `${meta} · ` : ""}
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open ? <div className="pb-2">{children}</div> : null}
    </section>
  );
}

export function CruiseBoard({ mode = "leave" }: { mode?: HelmMode }) {
  const boat = useBoat();
  const setGround = useTrip((s) => s.setGround);
  const setRegion = useTrip((s) => s.setRegion);
  const inlet = inletById(boat.activeInletId);
  const home = marinaById(boat.homeMarinaId);
  const [live, setLive] = useState(false);
  const [species, setSpecies] = useState("Speckled trout");
  const [cachedBrief, setCachedBrief] = useState<CachedBrief | null>(null);
  const [cachedConditions, setCachedConditions] = useState<CachedConditions | null>(null);
  const [cachedGate, setCachedGate] = useState<CachedGate | null>(null);
  const [slot, setSlot] = useState<SlotId>("now");
  const [tiles, setTiles] = useState(0);

  useEffect(() => {
    void useBoat.persist.rehydrate();
    setCachedBrief(readCachedBrief());
    setCachedConditions(readJson<CachedConditions>(CONDITIONS_CACHE_KEY));
    setCachedGate(readJson<CachedGate>(GATE_CACHE_KEY));
    setLive(true);
    void caches.open("fairwater-charts").then(async (cache) => setTiles((await cache.keys()).length)).catch(() => setTiles(0));
  }, []);

  const station = TIDE_STATIONS.find((item) => item.id === inlet.stationId);
  const stationMiles = station ? miles(inlet.lat, inlet.lng, station.lat, station.lng) : 1;
  const inletQuery = useQuery({
    queryKey: ["fairwater-inlet", inlet.id, inlet.stationId],
    enabled: live,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () =>
      getConditions({
        data: {
          lat: inlet.lat,
          lng: inlet.lng,
          stationId: inlet.stationId,
          stationName: inlet.stationName,
          distanceMi: Math.max(stationMiles, 0.1),
        },
      }),
  });
  const brief = useQuery({
    queryKey: ["fairwater-brief", inlet.id, inlet.nwsZoneHint],
    enabled: live,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () => getBrief({ data: { zone: inlet.nwsZoneHint, inletId: inlet.id } }),
  });

  useEffect(() => {
    if (!brief.data) return;
    const payload: CachedBrief = { at: new Date().toISOString(), zone: inlet.nwsZoneHint, brief: brief.data };
    try {
      localStorage.setItem(BRIEF_CACHE_KEY, JSON.stringify(payload));
      setCachedBrief(payload);
    } catch {
      /* ignore quota */
    }
  }, [brief.data, inlet.nwsZoneHint]);

  useEffect(() => {
    if (!inletQuery.data) return;
    const payload: CachedConditions = { at: new Date().toISOString(), inletId: inlet.id, conditions: inletQuery.data };
    try {
      localStorage.setItem(CONDITIONS_CACHE_KEY, JSON.stringify(payload));
      setCachedConditions(payload);
    } catch {
      /* ignore quota */
    }
  }, [inletQuery.data, inlet.id]);

  const sameZone = cachedBrief?.zone === inlet.nwsZoneHint || !cachedBrief?.zone;
  const displayBrief = brief.data ?? (sameZone ? cachedBrief?.brief ?? null : null);
  const briefStale = !brief.data && !!displayBrief;
  const briefAge = cachedBrief?.at ? ageLabel(cachedBrief.at) : null;
  const briefFresh = freshness(brief.data ? new Date().toISOString() : cachedBrief?.at);

  const conditions =
    inletQuery.data ?? (cachedConditions?.inletId === inlet.id ? cachedConditions.conditions : null);
  const conditionsStale = !inletQuery.data && !!conditions;
  const conditionsAge = cachedConditions?.inletId === inlet.id && cachedConditions.at ? ageLabel(cachedConditions.at) : null;

  const now = new Date();
  const flow = conditions ? currentAt(conditions.current, now.getTime()) : null;
  const buoy = conditions?.buoy ?? null;
  const weather = conditions?.weatherHourly.length ? nearestWeather(conditions.weatherHourly, now.getTime()) : null;
  const officialWind = nwsWind(displayBrief?.forecast ?? null);
  const windMph = weather?.windMph ?? buoy?.windMph ?? officialWind?.mph ?? null;
  const windText =
    weather?.windMph != null
      ? `${Math.round(weather.windMph)} mph · model`
      : buoy?.windMph != null
        ? `${Math.round(buoy.windMph)} mph · buoy`
        : officialWind
          ? officialWind.label
          : "—";
  const gate = inletGate({
    seasFt: buoy?.waveFt ?? null,
    periodS: buoy?.wavePeriodS ?? null,
    windMph,
    stage: flow?.stage ?? null,
    currentKt: flow?.speedKt ?? null,
    forecast: displayBrief?.forecast ?? null,
    rules: boat,
    inletName: inlet.barName,
    nwsZone: inlet.nwsZoneHint,
  });
  const checking = inletQuery.isFetching && !inletQuery.data;
  const cachedForInlet = cachedGate?.inletId === inlet.id ? cachedGate : null;
  const slotWhen = slotTime(slot, now);
  const marineRow = conditions ? nearRow(conditions.marineHourly, slotWhen) : null;
  const weatherRow = conditions ? nearRow(conditions.weatherHourly, slotWhen) : null;
  const slotLimited = slot !== "now" && (!marineRow?.waveFt || weatherRow?.windMph == null);
  const slotFlow = conditions ? currentAt(conditions.current, slotWhen) : flow;
  let activeGate = gate;
  if (slot !== "now" && !slotLimited && marineRow && weatherRow) {
    activeGate = inletGate({
      seasFt: marineRow.waveFt,
      periodS: marineRow.wavePeriodS,
      windMph: weatherRow.windMph,
      stage: slotFlow?.stage ?? null,
      currentKt: slotFlow?.speedKt ?? null,
      forecast: displayBrief?.forecast ?? null,
      rules: boat,
      inletName: inlet.barName,
      nwsZone: inlet.nwsZoneHint,
    });
  }
  const sourcesDisagree =
    slot === "now" && weather?.windMph != null && buoy?.windMph != null && Math.abs(weather.windMph - buoy.windMph) > 8;
  if (sourcesDisagree && activeGate.gate === "go") {
    activeGate = {
      gate: "caution",
      reasons: ["Conflict. Buoy wind and the model wind disagree, so this is not a green light.", ...activeGate.reasons].slice(0, 4),
    };
  }
  const usingCache = !checking && !inletQuery.data && !!cachedForInlet;
  const shown = checking
    ? { gate: "caution" as const, reasons: ["Checking NOAA, NDBC, and NWS."] }
    : usingCache && cachedForInlet
      ? { gate: cachedForInlet.gate, reasons: cachedForInlet.reasons }
      : activeGate;
  useEffect(() => {
    if (checking) {
      window.dispatchEvent(new CustomEvent("fairwater-gate", { detail: "Checking…" }));
      return;
    }
    const label = shown.gate === "no-go" ? "No-go" : shown.gate === "caution" ? "Caution" : "Under your limits";
    window.dispatchEvent(new CustomEvent("fairwater-gate", { detail: label }));
    if (!inletQuery.data || slot !== "now") return;
    const payload: CachedGate = { inletId: inlet.id, gate: activeGate.gate, reasons: activeGate.reasons, at: new Date().toISOString() };
    try {
      localStorage.setItem(GATE_CACHE_KEY, JSON.stringify(payload));
      setCachedGate((prev) =>
        prev && prev.inletId === payload.inletId && prev.gate === payload.gate && prev.reasons.join("|") === payload.reasons.join("|")
          ? prev
          : payload,
      );
    } catch {
      /* ignore */
    }
  }, [checking, shown.gate, shown.reasons.join("|"), inletQuery.data, slot, inlet.id, activeGate.gate, activeGate.reasons.join("|")]);
  const sun = sunTimes(now, inlet.lat, inlet.lng);
  const route = routeFuel(boat.waypoints, boat.cruiseKt, boat.burnGph, boat.tankGal, boat.reservePct);
  const offshore = useMemo(
    () => planFuelNm(OFFSHORE_ONE_WAY_NM, boat.cruiseKt, boat.burnGph, boat.tankGal, boat.reservePct),
    [boat.cruiseKt, boat.burnGph, boat.tankGal, boat.reservePct],
  );
  const rough = useMemo(
    () => planFuelNm(OFFSHORE_ONE_WAY_NM, boat.cruiseKt, boat.planningBurnGph, boat.tankGal, boat.reservePct),
    [boat.cruiseKt, boat.planningBurnGph, boat.tankGal, boat.reservePct],
  );
  const checksDone = CHECKLIST_ITEMS.filter((item) => boat.checklist[item.id]).length;
  const tideNow = tideAt(conditions?.tide ?? null, now.getTime());
  const shoal = shoalAdvisory({
    draftFt: boat.draftFt,
    marginFt: 1,
    depthFtMllw: boat.shoalDepthFt,
    tideFtMllw: tideNow?.height ?? null,
  });
  const runHome = home
    ? (() => {
        const nm = miles(inlet.lat, inlet.lng, home.lat, home.lng) * 0.868976;
        const minutes = (nm / Math.max(boat.cruiseKt, 1)) * 60;
        return { nm, minutes };
      })()
    : null;

  useEffect(() => {
    const fuel = offshore.home ? `40 out / ${offshore.nm.toFixed(0)} RT · HOME OK` : "GO HOME";
    window.dispatchEvent(new CustomEvent("fairwater-fuel", { detail: fuel }));
  }, [offshore.home, offshore.nm]);
  const advisoryLines = [
    ...(shoal.level === "thin" || shoal.level === "risk" ? [`Sandbar ${shoal.level}: ${shoal.reason}`] : []),
    inlet.notes,
  ];
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("fairwater-advisories", { detail: advisoryLines }));
  }, [advisoryLines.join("|")]);

  useEffect(() => {
    if (!boat.recording || !live) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => boat.addTrack({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => boat.setRecording(false),
      { enableHighAccuracy: true, maximumAge: 5000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [boat.recording, live, boat.addTrack, boat.setRecording]);

  return (
    <div className="flex flex-col gap-5">
      <section
        className={cn(
          "rounded-xl border p-4",
          mode !== "leave" && "hidden",
          !checking && shown.gate === "no-go" && "border-poor",
          !checking && shown.gate === "caution" && "border-fair",
          !checking && shown.gate === "go" && "border-good",
        )}
      >
        <p className="text-xs font-medium tracking-wide text-subtle uppercase">{inlet.name}</p>
        <p className="font-display text-4xl leading-none text-fg">
          {checking ? "Checking…" : shown.gate === "no-go" ? "No-go" : shown.gate === "caution" ? "Caution" : "Under your limits"}
        </p>
        {usingCache && cachedForInlet ? (
          <p className={cn("mt-2 text-sm", freshness(cachedForInlet.at) === "poor" ? "text-poor" : "text-fair")} role="status">
            Cached gate · {ageLabel(cachedForInlet.at)}
            {freshness(cachedForInlet.at) === "poor" ? " · stale" : ""}
          </p>
        ) : null}
        {sourcesDisagree ? <p className="mt-2 text-sm text-fair">Conflict · buoy and model wind</p> : null}
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="text-xs text-subtle">
            Inlet
            <select
              className="mt-1 h-12 w-full rounded-md border border-line bg-bg px-2 text-sm text-fg"
              value={inlet.id}
              aria-label="Inlet"
              onChange={(event) => {
                const next = inletById(event.target.value as typeof inlet.id);
                boat.setActiveInlet(next.id);
                setRegion("outer-banks");
                setGround(next.groundId);
              }}
            >
              {INLETS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-subtle">
            Home marina
            <select
              className="mt-1 h-12 w-full rounded-md border border-line bg-bg px-2 text-sm text-fg"
              value={boat.homeMarinaId ?? ""}
              aria-label="Home marina"
              onChange={(event) => boat.setHomeMarina(event.target.value ? (event.target.value as MarinaId) : null)}
            >
              <option value="">No home marina</option>
              {MARINAS.map((marina) => (
                <option key={marina.id} value={marina.id}>
                  {marina.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-2 text-sm text-muted">{inlet.notes}</p>
        <p className="mt-1 text-sm text-muted">
          {boat.boatLabel} · draft {boat.draftFt.toFixed(2)} ft (~{Math.round(boat.draftFt * 12)}″) · not a navigation clearance
        </p>
        <ul className="mt-3 flex flex-col gap-1 text-sm text-fg">
          {shown.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-subtle">Tide · NOAA</dt>
            <dd className="text-fg">{conditions?.tide ? conditions.tide.stationName : inletQuery.isError ? "No feed" : "Loading"}</dd>
          </div>
          <div>
            <dt className="text-subtle">Current · NOAA</dt>
            <dd className="text-fg">
              {flow && conditions?.current
                ? `${flow.stage} ${flow.speedKt.toFixed(1)} kt · ${conditions.current.stationName.split(",")[0]}`
                : "No station"}
            </dd>
          </div>
          <div>
            <dt className="text-subtle">Seas · NDBC</dt>
            <dd className="text-fg">
              {buoy
                ? `${buoy.waveFt.toFixed(1)} ft · ${buoy.wavePeriodS ? `${Math.round(buoy.wavePeriodS)} s` : "period n/a"}`
                : "No fresh buoy"}
            </dd>
          </div>
          <div>
            <dt className="text-subtle">Wind</dt>
            <dd className="text-fg">{windText}</dd>
          </div>
        </dl>
        {buoy ? (
          <p className="mt-3 text-sm text-fg">
            {buoy.id} is {buoy.name}. It sits {buoy.distanceMi} miles {compass(bearing(inlet.lat, inlet.lng, buoy.lat, buoy.lng))} of the inlet mouth, about{" "}
            {Math.round(buoy.distanceMi * 0.869)} nm. Nothing in this app sits on the bar. The bar can be rougher than this buoy.
          </p>
        ) : null}
        <p className="mt-2 text-sm text-muted">
          The dashed line offshore is an approximate 3 nm state-water line, not the legal boundary. The inlet is inside state water. This buoy is outside it.
        </p>
        {sun ? (
          <p className="mt-2 text-sm text-muted">
            Sun {clock(sun.rise)}–{clock(sun.set)}
          </p>
        ) : null}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Field label="Max seas" value={boat.maxSeasFt} suffix="ft" onChange={(v) => boat.setRule({ maxSeasFt: num(v, boat.maxSeasFt) })} />
          <Field label="Min period" value={boat.minPeriodS} suffix="s" onChange={(v) => boat.setRule({ minPeriodS: num(v, boat.minPeriodS) })} />
          <Field label="Max wind" value={boat.maxWindMph} suffix="mph" onChange={(v) => boat.setRule({ maxWindMph: num(v, boat.maxWindMph) })} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Field label="Draft" value={boat.draftFt} suffix="ft" onChange={(v) => boat.setRule({ draftFt: num(v, boat.draftFt) })} />
          <Field label="Reserve" value={boat.reservePct} suffix="%" onChange={(v) => boat.setRule({ reservePct: num(v, boat.reservePct) })} />
          <button
            type="button"
            className="mt-4 h-12 rounded-md bg-surface-2 px-2 text-xs font-medium text-fg"
            onClick={() => boat.applySportsman262()}
          >
            Reset 262 preset
          </button>
        </div>
        <p className="mt-3 text-sm text-muted">Still your call at the dock.</p>
        <div className="mt-3 grid grid-cols-3 gap-2" role="tablist" aria-label="Departure">
          {(
            [
              ["now", "Now"],
              ["plus6", "+6h"],
              ["tomorrow", "Tomorrow"],
            ] as const
          ).map(([id, label]) => {
            const when = slotTime(id, now);
            const sea = conditions ? nearRow(conditions.marineHourly, when) : null;
            const wind = conditions ? nearRow(conditions.weatherHourly, when) : null;
            const limited = id !== "now" && (sea?.waveFt == null || wind?.windMph == null);
            const tideFlow = conditions ? currentAt(conditions.current, when) : null;
            const ebb = tideFlow?.stage === "ebb" && (sea?.waveFt ?? buoy?.waveFt ?? 0) >= boat.maxSeasFt - 0.5;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={slot === id}
                disabled={limited}
                onClick={() => setSlot(id)}
                className={cn("min-h-12 rounded-md border px-2 py-1 text-left text-xs", slot === id ? "border-accent bg-surface-2" : "border-line")}
              >
                <span className="block text-sm font-medium text-fg">{label}</span>
                <span className="block text-muted">
                  {limited
                    ? "Forecast limited"
                    : id === "now"
                      ? `${buoy ? `${buoy.waveFt.toFixed(1)} ft` : "seas n/a"} · ${windMph != null ? `${Math.round(windMph)} mph` : "wind n/a"}`
                      : `${sea?.waveFt?.toFixed(1) ?? "—"} ft · ${sea?.wavePeriodS ? `${Math.round(sea.wavePeriodS)} s` : "period n/a"} · ${wind?.windMph != null ? `${Math.round(wind.windMph)} mph` : "—"}`}
                  {ebb ? " · ebb×swell" : ""}
                </span>
              </button>
            );
          })}
        </div>
        {slot !== "now" && slotLimited ? <p className="mt-2 text-sm text-muted">Forecast limited. No number was invented for that hour.</p> : null}
        {conditionsStale ? (
          <p className="mt-2 text-sm text-fair" role="status">
            Last conditions for this inlet · {conditionsAge} · {freshness(cachedConditions?.at)}
          </p>
        ) : null}
        {inletQuery.isError || (conditions?.errors.length ?? 0) > 0 ? (
          <button type="button" className="mt-3 h-12 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg" onClick={() => void inletQuery.refetch()}>
            Retry feeds
          </button>
        ) : null}
      </section>

      <section className={cn("rounded-xl border border-line p-4", mode !== "leave" && "hidden")}>
        <p className="text-xs font-medium tracking-wide text-subtle uppercase">Sandbar</p>
        <p className={cn("mt-1 text-sm font-medium", shoal.level === "risk" && "text-poor", shoal.level === "thin" && "text-fair", shoal.level === "ok" && "text-good")}>
          {shoal.level === "unknown" ? "Unknown" : shoal.level === "ok" ? "Enough water on this sounding" : shoal.level === "thin" ? "Thin" : "Risk"}
        </p>
        <p className="mt-1 text-sm text-fg">{shoal.reason}</p>
        <label className="mt-2 block text-xs text-subtle">
          Chart depth at this spot, ft MLLW
          <input
            inputMode="decimal"
            defaultValue={boat.shoalDepthFt ?? ""}
            key={boat.shoalDepthFt ?? "empty"}
            placeholder="From the chart, not a guess"
            onBlur={(event) => {
              const parsed = Number(event.target.value);
              boat.setShoalDepth(event.target.value.trim() === "" || !Number.isFinite(parsed) ? null : parsed);
            }}
            className="mt-1 h-12 w-full rounded-md border border-line bg-bg px-3 text-sm text-fg"
            aria-label="Chart depth in feet MLLW"
          />
        </label>
        <p className="mt-2 text-sm text-muted">Depth advisory only — not a clearance guarantee.</p>
      </section>

      <section
        className={cn(
          "rounded-xl border p-4",
          mode === "fish" && "hidden",
          offshore.home ? "border-good" : "border-poor",
        )}
      >
        <p className="text-xs font-medium tracking-wide text-subtle uppercase">40 nm out · 80 nm RT</p>
        <p className="mt-1 font-display text-2xl leading-tight text-fg">
          {offshore.nm.toFixed(0)} nm · {offshore.hours.toFixed(1)} hr · {offshore.gallons.toFixed(0)} gal
        </p>
        <p className="mt-1 text-sm text-muted">
          40 out / {offshore.nm.toFixed(0)} RT · Twin cruise {boat.cruiseKt} kt · {boat.burnGph} gph · tank {boat.tankGal} gal · {boat.reservePct}% reserve ({offshore.reserveGal.toFixed(0)} gal)
        </p>
        <p className="mt-1 text-sm text-muted">
          Rough-water planning burn {boat.planningBurnGph} gph would be {rough.gallons.toFixed(0)} gal on the same 40 nm out · {rough.nm.toFixed(0)} nm RT.
        </p>
        {runHome ? (
          <p className="mt-2 text-sm text-fg">
            Run home to {home?.name}: {runHome.nm.toFixed(1)} nm · about {Math.round(runHome.minutes)} min at {boat.cruiseKt} kt from this inlet.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">Pick a home marina for the run-home time.</p>
        )}
        <p className={cn("mt-2 text-sm font-medium", offshore.home ? "text-good" : "text-poor")}>
          {offshore.home
            ? `Fuel covers the round trip with ${Math.max(0, offshore.usable - offshore.gallons).toFixed(0)} gal spare after reserve.`
            : `Short ${ (offshore.gallons - offshore.usable).toFixed(0) } gal after reserve — top off or shorten the run.`}
        </p>
        {!offshore.home ? (
          <p className="mt-3 rounded-lg bg-poor/20 px-3 py-2 text-sm font-medium text-poor" role="status">
            GO HOME — planned burn exceeds usable fuel. Turn around before the bar if the tank is lower than planned.
          </p>
        ) : (
          <p className="mt-3 rounded-lg bg-good/15 px-3 py-2 text-sm text-good" role="status">
            Go-home reserve is built in. Still leave early if weather or burn climbs.
          </p>
        )}
      </section>

      <section className={cn("rounded-xl border border-line p-4", mode !== "leave" && "hidden")}>
        <p className="text-xs font-medium tracking-wide text-subtle uppercase">Ready for sea</p>
        <p className="mt-2 text-sm text-fg">
          Brief {briefFresh} · Conditions {conditions ? freshness(inletQuery.data ? new Date().toISOString() : cachedConditions?.at) : "missing"} · Gate {checking ? "missing" : usingCache && cachedForInlet ? freshness(cachedForInlet.at) : inletQuery.data ? "good" : "missing"} · Tiles {tiles > 0 ? `${tiles} saved` : "none"}
        </p>
        {tiles === 0 ? <p className="mt-2 text-sm text-muted">Save tiles for home area from the chart before you lose signal.</p> : null}
      </section>
      <Fold title="Pre-launch checklist" meta={`${checksDone}/${CHECKLIST_ITEMS.length}`} defaultOpen className={mode !== "leave" ? "hidden" : undefined}>
        <ul className="mt-1 flex flex-col gap-1">
          {CHECKLIST_ITEMS.map((item) => {
            const label = item.id === "nws" ? `NWS coastal waters (${inlet.nwsZoneHint}) read` : item.label;
            return (
            <li key={item.id}>
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-surface-2">
                <input
                  type="checkbox"
                  className="size-5 accent-[var(--color-accent)]"
                  checked={!!boat.checklist[item.id]}
                  onChange={() => boat.toggleCheck(item.id)}
                />
                <span className={cn("text-sm", boat.checklist[item.id] ? "text-muted line-through" : "text-fg")}>
                  {label}
                </span>
              </label>
            </li>
            );
          })}
        </ul>
        <button type="button" className="mt-2 h-12 rounded-md bg-surface-2 px-3 text-sm text-fg" onClick={() => boat.resetChecklist()}>
          Reset checklist
        </button>
      </Fold>

      <Fold
        title="NWS coastal waters"
        meta={
          briefStale
            ? `Stale · ${briefAge ?? "cached"} · ${briefFresh === "missing" ? "No cached brief" : briefFresh}`
            : displayBrief
              ? `Official · ${inlet.nwsZoneHint}`
              : brief.isError
                ? "No cached brief"
                : `Official · ${inlet.nwsZoneHint}`
        }
        defaultOpen
        className={mode !== "leave" ? "hidden" : undefined}
      >
        {briefStale ? (
          <p className="mb-2 inline-flex rounded-md bg-fair/20 px-2 py-1 text-xs font-medium text-fair" role="status">
            Last-good brief · {briefAge} · live NWS did not load
          </p>
        ) : null}
        {displayBrief?.forecast ? (
          <pre className="mt-1 max-h-48 overflow-auto rounded-lg bg-surface-2 p-3 text-sm leading-snug whitespace-pre-wrap text-fg">
            {displayBrief.forecast}
          </pre>
        ) : (
          <p className="mt-1 text-sm text-muted">
            {brief.isError ? "Forecast didn't load and no cached brief is on this phone." : "Reading the coastal waters forecast…"}
          </p>
        )}
      </Fold>

      <Fold title="Route and fuel" meta={boat.waypoints.length >= 2 ? `${route.nm.toFixed(1)} nm` : "No marks"} className={mode === "fish" ? "hidden" : undefined}>
        <p className="mt-1 text-sm text-muted">
          Straight lines between marks you drop. There is no depth auto-route. A wrong one would put you on a shoal.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Field label="Cruise" value={boat.cruiseKt} suffix="kt" onChange={(v) => boat.setRule({ cruiseKt: num(v, boat.cruiseKt) })} />
          <Field label="Burn" value={boat.burnGph} suffix="gph" onChange={(v) => boat.setRule({ burnGph: num(v, boat.burnGph) })} />
          <Field label="Rough" value={boat.planningBurnGph} suffix="gph" onChange={(v) => boat.setPlanningBurn(num(v, boat.planningBurnGph))} />
          <Field label="Tank" value={boat.tankGal} suffix="gal" onChange={(v) => boat.setRule({ tankGal: num(v, boat.tankGal) })} />
        </div>
        <p className="mt-3 text-sm text-fg">
          {boat.waypoints.length < 2
            ? "Drop at least two marks on the chart."
            : `${route.nm.toFixed(1)} nm · ${route.hours.toFixed(1)} hr ${route.closed ? "on this loop" : "round trip"} · ${route.gallons.toFixed(1)} gal. ${routeClosedNote(route.closed)}`}
        </p>
        {boat.waypoints.length >= 2 ? (
          <p className={cn("text-sm font-medium", route.home ? "text-good" : "text-poor")}>
            {route.home ? "Fuel covers the round trip with reserve." : "Round trip is over the usable fuel."}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={cn("h-12 rounded-md px-3 text-sm font-medium", boat.markMode ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg")} onClick={() => boat.toggleMark()}>
            {boat.markMode ? "Dropping marks" : "Drop marks"}
          </button>
          <button type="button" className="h-12 rounded-md bg-surface-2 px-3 text-sm text-fg" onClick={() => boat.clearWaypoints()}>
            Clear marks
          </button>
          <button
            type="button"
            className={cn("h-12 rounded-md px-3 text-sm font-medium", boat.recording ? "bg-poor text-bg" : "bg-surface-2 text-fg")}
            onClick={() => boat.setRecording(!boat.recording)}
          >
            {boat.recording ? "Stop track" : "Record track"}
          </button>
          <button type="button" className="h-12 rounded-md bg-surface-2 px-3 text-sm text-fg" onClick={() => boat.clearTrack()}>
            Clear track
          </button>
          <button
            type="button"
            className="h-12 rounded-md bg-surface-2 px-3 text-sm text-fg"
            onClick={() => downloadText("fairwater.gpx", toGpx(boat.waypoints, boat.track), "application/gpx+xml")}
          >
            Download GPX
          </button>
          <label className="inline-flex h-12 cursor-pointer items-center rounded-md bg-surface-2 px-3 text-sm text-fg">
            Import GPX
            <input
              type="file"
              accept=".gpx,application/gpx+xml"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void file.text().then((xml) => {
                  const parsed = parseGpx(xml);
                  if (parsed.waypoints.length) boat.importMarks(parsed.waypoints);
                  for (const point of parsed.track.slice(0, 400)) boat.addTrack(point);
                });
                event.target.value = "";
              }}
            />
          </label>
        </div>
        {boat.waypoints.length ? (
          <ul className="mt-2 text-sm text-muted">
            {boat.waypoints.map((mark) => (
              <li key={mark.id}>
                {mark.name} · {mark.lat.toFixed(3)}, {mark.lng.toFixed(3)}
              </li>
            ))}
          </ul>
        ) : null}
      </Fold>

      <Fold title="NC DMF, live" meta="Proclamations" className={mode === "run" ? "hidden" : undefined}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-muted">Titles from the DMF page. Open the PDF for the limit. This is not a copied size table.</p>
          <a className="inline-flex h-12 shrink-0 items-center text-sm text-accent underline" href={DMF_PAGE}>
            Official page
          </a>
        </div>
        <ul className="mt-2 flex flex-col gap-3">
          {(displayBrief?.proclamations.length ?? 0) + (displayBrief?.closures.length ?? 0) === 0 ? (
            <li className="text-sm text-muted">None loaded yet.</li>
          ) : null}
          {(displayBrief?.proclamations ?? []).map((item) => (
            <li key={item.id}>
              <a className="inline-flex min-h-12 items-center text-sm font-medium text-fg underline" href={item.href}>
                {item.id}
              </a>
              <p className="text-sm text-muted">{item.title}</p>
              <p className="text-sm text-subtle">
                Issued {item.issued} · {item.effective}
              </p>
            </li>
          ))}
          {(displayBrief?.closures ?? []).map((item) => (
            <li key={item.id}>
              <a className="inline-flex min-h-12 items-center text-sm font-medium text-fg underline" href={item.href}>
                {item.id} · shellfish
              </a>
              <p className="text-sm text-muted">{item.summary}</p>
              <p className="text-sm text-subtle">
                {item.counties} · {item.effective}
              </p>
            </li>
          ))}
        </ul>
        {displayBrief?.errors.length ? <p className="mt-2 text-sm text-fair">{displayBrief.errors.join(" ")}</p> : null}
      </Fold>

      <Fold title="Catch log" meta={boat.catches.length ? `${boat.catches.length}` : "Empty"} className={mode === "run" ? "hidden" : undefined}>
        <form
          className="mt-1 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const speciesName = species.trim();
            if (!speciesName) return;
            const mark = boat.track[boat.track.length - 1];
            boat.addCatch({
              species: speciesName,
              at: new Date().toISOString(),
              lat: mark?.lat ?? inlet.lat,
              lng: mark?.lng ?? inlet.lng,
              tide: flow ? flow.stage : "tide unknown",
              moon: moonInfo(new Date()).name,
            });
          }}
        >
          <input
            value={species}
            onChange={(event) => setSpecies(event.target.value)}
            className="h-12 min-w-0 flex-1 rounded-md border border-line bg-bg px-3 text-sm text-fg"
            aria-label="Species"
          />
          <button type="submit" className="h-12 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg">
            Log
          </button>
        </form>
        <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
          {boat.catches.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2">
              <input
                defaultValue={entry.species}
                key={entry.species}
                aria-label={`Edit ${entry.species}`}
                onBlur={(event) => {
                  const next = event.target.value.trim();
                  if (next && next !== entry.species) boat.updateCatch(entry.id, next);
                }}
                className="h-12 min-w-0 flex-1 rounded-md border border-line bg-bg px-2 text-sm text-fg"
              />
              <span className="shrink-0">
                {entry.tide} · {clock(new Date(entry.at))}
              </span>
              <button type="button" className="h-12 shrink-0 rounded-md bg-surface-2 px-3 text-sm text-fg" onClick={() => boat.removeCatch(entry.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-2 h-12 rounded-md bg-surface-2 px-3 text-sm text-fg"
          onClick={() => downloadText("fairwater-catches.csv", catchesCsv(boat.catches), "text/csv")}
        >
          Download CSV
        </button>
      </Fold>
    </div>
  );
}

function Field({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs text-subtle">
      {label}
      <span className="mt-1 flex items-center gap-1 rounded-md border border-line bg-bg px-2">
        <input
          inputMode="decimal"
          defaultValue={value}
          key={value}
          onBlur={(event) => onChange(event.target.value)}
          className="h-12 w-full bg-transparent text-sm text-fg outline-none"
          aria-label={label}
        />
        <span>{suffix}</span>
      </span>
    </label>
  );
}
