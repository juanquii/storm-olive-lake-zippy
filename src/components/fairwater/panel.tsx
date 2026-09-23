import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CruiseBoard } from "@/components/fairwater/cruise";
import { Compass } from "@/components/fairwater/compass";
import { TideChart } from "@/components/fairwater/tide-chart";
import {
  bestWindow,
  fishingRead,
  inSeason,
  recommendBand,
  scoreAt,
  snapshotMarine,
  snapshotWeather,
  tideAt,
} from "@/lib/marine/bite";
import { getConditions, currentAt } from "@/lib/marine/conditions";
import { compass, feet, knots, mph, sky, weekday } from "@/lib/marine/format";
import { nearest } from "@/lib/marine/geo";
import { BAND_LABEL, groundById, groundsIn } from "@/lib/marine/grounds";
import { moonInfo, nextWindow, solunarWindows, windowAt } from "@/lib/marine/moon";
import { TIDE_STATIONS } from "@/lib/marine/stations";
import { useTrip } from "@/store/trip";
import { cn } from "@/lib/cn";

function addDays(offset: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function clock(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function ConditionsPanel() {
  const groundId = useTrip((s) => s.groundId);
  const dayOffset = useTrip((s) => s.dayOffset);
  const setDayOffset = useTrip((s) => s.setDayOffset);
  const saved = useTrip((s) => s.saved);
  const helmMode = useTrip((s) => s.helmMode);
  const toggleSaved = useTrip((s) => s.toggleSaved);
  const setGround = useTrip((s) => s.setGround);
  const setRegion = useTrip((s) => s.setRegion);
  const [live, setLive] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const regsRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => setLive(true), []);
  useEffect(() => {
    function onOpenRegs() {
      const el = regsRef.current ?? document.getElementById("fairwater-check-regs");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.addEventListener("fairwater-open-regs", onOpenRegs);
    return () => window.removeEventListener("fairwater-open-regs", onOpenRegs);
  }, []);

  const ground = groundById(groundId);
  const stationPick = nearest(ground.lat, ground.lng, TIDE_STATIONS);

  const query = useQuery({
    queryKey: ["fairwater", ground.id, stationPick?.item.id],
    enabled: live && !!stationPick,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    queryFn: () =>
      getConditions({
        data: {
          lat: ground.lat,
          lng: ground.lng,
          stationId: stationPick!.item.id,
          stationName: stationPick!.item.name,
          distanceMi: Math.round(stationPick!.distanceMi * 10) / 10,
        },
      }),
  });

  const view = useMemo(() => {
    if (!live || !query.data) return null;
    const day = addDays(dayOffset);
    const previewWindow = bestWindow({
      day,
      exposure: ground.exposure,
      band: ground.band,
      conditions: query.data,
      lat: ground.lat,
      lng: ground.lng,
    });
    const when = dayOffset === 0 ? new Date() : (previewWindow?.start ?? day);
    const score = scoreAt({
      when,
      exposure: ground.exposure,
      band: ground.band,
      conditions: query.data,
      lat: ground.lat,
      lng: ground.lng,
    });
    const recommendation = recommendBand({
      when,
      conditions: query.data,
      lat: ground.lat,
      lng: ground.lng,
    });
    const marine = snapshotMarine(query.data, when);
    const weather = snapshotWeather(query.data, when);
    const tide = tideAt(query.data.tide, when.getTime());
    const flow = currentAt(query.data.current, when.getTime());
    const windows = solunarWindows(when, ground.lat, ground.lng);
    const active = windowAt(windows, when);
    const upcoming = nextWindow(windows, when);
    const month = when.getMonth() + 1;
    const neighbors = groundsIn(ground.region, "all");
    const read = fishingRead({
      ground,
      neighbors,
      when,
      score,
      tide,
      seasFt: marine?.waveFt ?? null,
      recommendation,
      window: previewWindow,
      month,
      active,
    });
    const moon = moonInfo(when);
    return { when, score, recommendation, marine, weather, tide, flow, windows, active, upcoming, month, read, previewWindow, moon };
  }, [live, query.data, dayOffset, ground]);

  const month = view?.month ?? 0;
  const seasonal = live ? inSeason(ground, month || new Date().getMonth() + 1) : [];
  const later = ground.species.filter((s) => !seasonal.includes(s));

  const nextExtreme = view && query.data?.tide
    ? query.data.tide.extremes.find((e) => new Date(e.time).getTime() > view.when.getTime())
    : undefined;

  useEffect(() => {
    if (!view) return;
    window.dispatchEvent(new CustomEvent("fairwater-bite", { detail: `${view.score.value} · ${view.score.label}` }));
  }, [view]);

  return (
    <div className="safe-bottom flex flex-col gap-5 px-4 py-4 lg:px-5">
      {helmMode !== "fish" ? <CruiseBoard mode={helmMode} /> : null}
      {helmMode === "fish" ? (
      <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">{BAND_LABEL[ground.band]}</p>
          <h1 className="font-display text-2xl leading-tight tracking-tight text-balance text-fg">{ground.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {ground.depth} · {ground.structure}
          </p>
        </div>
        <Button
          variant="quiet"
          size="sm"
          aria-pressed={saved.includes(ground.id)}
          onClick={() => toggleSaved(ground.id)}
          className="shrink-0"
        >
          <Star className={cn("size-4", saved.includes(ground.id) && "fill-current")} />
          {saved.includes(ground.id) ? "Saved" : "Save"}
        </Button>
      </div>

      <div className="flex gap-2" role="tablist" aria-label="Day">
        {([0, 1, 2] as const).map((offset) => {
          const day = addDays(offset);
          const label = offset === 0 ? "Today" : weekday(day);
          return (
            <button
              key={offset}
              type="button"
              role="tab"
              aria-selected={dayOffset === offset}
              onClick={() => setDayOffset(offset)}
              className={cn(
                "h-12 rounded-md px-3 text-sm font-medium",
                dayOffset === offset ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
              )}
            >
              {live ? label : offset === 0 ? "Today" : `Day ${offset + 1}`}
            </button>
          );
        })}
      </div>

      <section className="rounded-xl bg-surface p-4">
        {view?.previewWindow ? (
          <p className="mb-3 text-sm font-medium text-fg">
            Best window {clock(view.previewWindow.start)}–{clock(view.previewWindow.end)}
          </p>
        ) : (
          <p className="mb-3 text-sm text-muted">Best window waits on the conditions feed.</p>
        )}
        <a
          id="fairwater-check-regs"
          ref={regsRef}
          className="mb-3 inline-flex min-h-12 items-center rounded-md bg-fair/20 px-3 text-sm font-medium text-fair"
          href="https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/fisheries-management-proclamations"
        >
          Legal to keep? · Check regs
        </a>
        {view ? (
          <>
            <div className="flex items-end justify-between gap-3">
              <button type="button" className="min-h-12 text-left" onClick={() => setScoreOpen((open) => !open)} aria-expanded={scoreOpen}>
                <p className="text-xs font-medium tracking-wide text-subtle uppercase">Bite</p>
                <p className="font-display text-5xl leading-none tabular-nums text-fg">{view.score.value}</p>
              </button>
              <p
                className={cn(
                  "text-sm font-medium",
                  view.score.label === "Tough" && "text-poor",
                  view.score.label === "Marginal" && "text-fair",
                  (view.score.label === "Strong" || view.score.label === "Worth going") && "text-good",
                )}
              >
                {view.score.label}
                {view.recommendation.band !== ground.band
                  ? ` · better ${BAND_LABEL[view.recommendation.band].toLowerCase()}`
                  : ""}
              </p>
            </div>
            <p className="mt-3 text-base leading-normal text-fg">{view.read}</p>
            <ul className={cn("mt-3 flex flex-col gap-1 text-sm text-muted", !scoreOpen && "hidden")}>
              {view.score.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-subtle uppercase">Bite</p>
            <p className="text-base text-muted">{query.isError ? "Conditions didn't load." : "Reading the water…"}</p>
            {query.isError ? (
              <Button variant="primary" onClick={() => void query.refetch()}>
                Try again
              </Button>
            ) : null}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Compass
          deg={view?.weather?.windDir ?? null}
          label="Wind"
          value={view ? mph(view.weather?.windMph) : "—"}
          hint={view ? `Forecast · ${compass(view.weather?.windDir)} · gust ${mph(view.weather?.gustMph)}` : "Waiting"}
        />
        <Compass
          deg={view?.flow?.dir ?? null}
          label="Current"
          value={view?.flow ? (view.flow.stage === "slack" ? "Slack" : knots(view.flow.speedKt)) : "—"}
          hint={
            query.data?.current
              ? `${view?.flow?.stage === "flood" ? "Flood" : view?.flow?.stage === "ebb" ? "Ebb" : "Slack"} · ${query.data.current.stationName.split(",")[0]} · ${query.data.current.distanceMi.toFixed(0)} mi`
              : "No NOAA current station within 40 mi"
          }
        />
        <Compass
          deg={
            dayOffset === 0 && query.data?.buoy
              ? query.data.buoy.waveDir
              : (view?.marine?.waveDir ?? null)
          }
          label="Seas"
          value={
            dayOffset === 0 && query.data?.buoy
              ? feet(query.data.buoy.waveFt)
              : view
                ? feet(view.marine?.waveFt)
                : "—"
          }
          hint={
            dayOffset === 0 && query.data?.buoy
              ? `NDBC ${query.data.buoy.id} · ${query.data.buoy.distanceMi} mi · ${query.data.buoy.ageMin}m ago`
              : "Model forecast, not a buoy"
          }
        />
        <Compass
          deg={view?.marine?.swellDir ?? null}
          label="Swell"
          value={view ? feet(view.marine?.swellFt) : "—"}
          hint={
            view?.marine?.swellPeriodS
              ? `Model · ${Math.round(view.marine.swellPeriodS)} s from ${compass(view.marine.swellDir)}`
              : "Model swell"
          }
        />
      </section>

      {dayOffset === 0 && query.data?.buoy && ground.exposure === "protected" ? (
        <p className="text-sm text-muted">
          That wave is NDBC {query.data.buoy.id}, {query.data.buoy.distanceMi} miles out in the ocean. It is not the chop
          inside this sound.
        </p>
      ) : null}

      <section className="rounded-xl border border-line p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-medium text-fg">Tide</h2>
          <p className="text-right text-sm text-muted">
            {query.data?.tide
              ? `NOAA · MLLW · ${query.data.tide.stationName} · ${query.data.tide.distanceMi.toFixed(0)} mi`
              : "NOAA prediction"}
          </p>
        </div>
        {view?.tide ? (
          <p className="mt-1 text-sm text-fg">
            {view.tide.stage === "slack" ? "Slack" : view.tide.stage === "rising" ? "Rising" : "Falling"}
            {" · "}
            {view.tide.height.toFixed(1)} ft
            {nextExtreme
              ? ` · next ${nextExtreme.type === "H" ? "high" : "low"} ${clock(new Date(nextExtreme.time))}`
              : ""}
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted">Tide curve loads with the station.</p>
        )}
        {live && query.data?.tide ? <TideChart samples={query.data.tide.samples} now={view?.when.getTime() ?? Date.now()} /> : null}
        {query.data?.tide && query.data.tide.distanceMi > 25 ? (
          <p className="text-sm text-muted">That station is a ways off. Trust it for the ocean, not a back creek.</p>
        ) : null}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-surface-2 p-3">
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">Moon</p>
          <p className="mt-1 text-base font-medium text-fg">{view ? view.moon.name : "—"}</p>
          <p className="text-sm text-muted tabular-nums">
            {view ? `${Math.round(view.moon.illumination * 100)}% lit` : "Phase"}
          </p>
        </div>
        <div className="rounded-lg bg-surface-2 p-3">
          <p className="text-xs font-medium tracking-wide text-subtle uppercase">Water</p>
          <p className="mt-1 text-base font-medium tabular-nums text-fg">
            {view?.marine?.sstF != null ? `${Math.round(view.marine.sstF)}°F` : "—"}
          </p>
          <p className="text-sm text-muted">
            {view?.weather ? `${sky(view.weather.code)} · ${view.weather.pressureMb ? `${Math.round(view.weather.pressureMb)} mb` : "pressure"}` : "Surface temp"}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-medium text-fg">Solunar</h2>
        <p className="mt-1 text-sm text-muted">Major windows are about an hour either side of the moon overhead and underfoot.</p>
        <ul className="mt-2 flex flex-col gap-2">
          {(view?.windows ?? []).map((w) => (
            <li key={`${w.label}-${w.peak.toISOString()}`} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-fg">
                {w.label}
                <span className="text-muted"> · {w.kind}</span>
              </span>
              <span className="tabular-nums text-muted">
                {clock(w.start)}–{clock(w.end)}
              </span>
            </li>
          ))}
          {live && view && view.windows.length === 0 ? <li className="text-sm text-muted">No moon window landed on this day.</li> : null}
        </ul>
      </section>

      <section>
        <h2 className="text-base font-medium text-fg">On this ground</h2>
        <p className="mt-1 text-sm leading-normal text-muted">{ground.tactic}</p>
        <a className="mt-2 inline-flex h-12 items-center rounded-md bg-fair/20 px-3 text-sm font-medium text-fair" href="https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/fisheries-management-proclamations">
          Check regs
        </a>
        <p className="mt-1 text-sm text-muted">A month on this list is not a season. Keep nothing until the proclamation says you can.</p>
        <ul className="mt-3 flex flex-col gap-3">
          {(live ? seasonal : ground.species).map((s) => (
            <li key={s.name}>
              <p className="text-sm font-medium text-fg">
                {s.name}
                {live ? <span className="ml-2 text-muted">Often this month</span> : null}
              </p>
              <p className="text-sm text-muted">{s.note}</p>
            </li>
          ))}
          {live
            ? later.slice(0, 3).map((s) => (
                <li key={s.name}>
                  <p className="text-sm font-medium text-subtle">{s.name}</p>
                  <p className="text-sm text-subtle">{s.note}</p>
                </li>
              ))
            : null}
        </ul>
      </section>

      {saved.length ? (
        <section>
          <h2 className="text-base font-medium text-fg">Saved</h2>
          <ul className="mt-2 flex flex-col gap-1">
            {saved.map((id) => {
              const g = groundById(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-center rounded-md px-2 text-left text-sm text-fg hover:bg-surface-2"
                    onClick={() => {
                      setRegion(g.region);
                      setGround(g.id);
                    }}
                  >
                    {g.name}
                    <span className="text-muted"> · {BAND_LABEL[g.band]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {query.data?.errors.length ? (
        <p className="text-sm text-fair">{query.data.errors.join(" ")}</p>
      ) : null}

      <p className="text-sm leading-normal text-subtle">
        Tides are NOAA predictions at the named station, datum MLLW. Current is the NOAA tidal-current prediction at
        the named station, which can be miles from the pin. Seas are the nearest NDBC buoy observation. Swell is an
        ocean model at the pin. Chart is the NOAA ENC. Satellite is a photo with no depths. Hybrid and Fishing draw NOAA depths and markers on a photo or a shaded bottom. None of these is a Garmin chart, and none is a certified navigation product. Check size and bag limits
        before you keep a fish.
      </p>
      <CruiseBoard mode="fish" />
      </>
      ) : null}
    </div>
  );
}
