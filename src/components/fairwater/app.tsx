import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocateFixed, Moon, Search, Sun, X } from "lucide-react";
import { formatHitLabel, searchFairwater, type SearchHit } from "@/lib/marine/search";
import { FishingMap } from "@/components/fairwater/map";
import { ConditionsPanel } from "@/components/fairwater/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inSeason } from "@/lib/marine/bite";
import { BAND_BLURB, BAND_LABEL, GROUNDS, REGIONS, groundById, groundsIn } from "@/lib/marine/grounds";
import { miles, nearest } from "@/lib/marine/geo";
import { inletById, marinaById } from "@/lib/marine/inlets";
import type { Band, RegionId } from "@/lib/marine/types";
import { OFFSHORE_ONE_WAY_NM, planFuelNm, SILVERTON_38_ACMY, SPORTSMAN_262, useBoat } from "@/store/boat";
import { useTrip, type ChartView } from "@/store/trip";
import { cn } from "@/lib/cn";

const CHART_VIEWS: { id: ChartView; label: string; note: string }[] = [
  { id: "chart", label: "Chart", note: "NOAA chart. Depths, contours, and markers." },
  { id: "satellite", label: "Satellite", note: "Photo only. No depths and no buoys." },
  { id: "hybrid", label: "Hybrid", note: "Photo with NOAA depth numbers and markers on top." },
  { id: "fishing", label: "Fishing", note: "Shaded bottom with NOAA depths and markers. Not a Garmin chart." },
];

const LAYOUT_KEY = "fairwater-layout";

function readLayout(): { panelPx: number; sheet: "peek" | "open"; tools: boolean } {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return { panelPx: 448, sheet: "peek", tools: false };
    const parsed = JSON.parse(raw) as { panelPx?: unknown; sheet?: unknown; tools?: unknown };
    const panelPx = Number(parsed.panelPx);
    return {
      panelPx: Number.isFinite(panelPx) ? Math.min(560, Math.max(320, panelPx)) : 448,
      sheet: parsed.sheet === "peek" ? "peek" : "open",
      tools: parsed.tools === true,
    };
  } catch {
    return { panelPx: 448, sheet: "peek", tools: false };
  }
}

function seasonNames(region: RegionId | "all", band: Band, month: number): string {
  const names: string[] = [];
  for (const ground of groundsIn(region, band)) {
    for (const species of inSeason(ground, month)) {
      if (!names.includes(species.name)) names.push(species.name);
      if (names.length === 3) return names.join(", ");
    }
  }
  return names.join(", ") || "Quiet this month";
}

function Fairwater() {
  const region = useTrip((s) => s.region);
  const band = useTrip((s) => s.band);
  const chartView = useTrip((s) => s.chartView);
  const groundId = useTrip((s) => s.groundId);
  const setGround = useTrip((s) => s.setGround);
  const setRegion = useTrip((s) => s.setRegion);
  const setBand = useTrip((s) => s.setBand);
  const setChartView = useTrip((s) => s.setChartView);
  const helmMode = useTrip((s) => s.helmMode);
  const setHelmMode = useTrip((s) => s.setHelmMode);
  const [query, setQuery] = useState("");
  const [geoNote, setGeoNote] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [panelPx, setPanelPx] = useState(448);
  const [sheet, setSheet] = useState<"peek" | "open">("peek");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [gateLabel, setGateLabel] = useState<string | null>(null);
  const [fuelLabel, setFuelLabel] = useState<string | null>(null);
  const [biteLabel, setBiteLabel] = useState<string | null>(null);
  const [readyInfo, setReadyInfo] = useState<{ ready: boolean; line: string } | null>(null);
  const [tilePct, setTilePct] = useState<number | null>(null);
  const [slot, setSlot] = useState<"now" | "plus6" | "tomorrow">("now");
  const [slotOptions, setSlotOptions] = useState<
    { id: "now" | "plus6" | "tomorrow"; label: string; summary: string; limited: boolean }[]
  >([]);
  const [advisoryLines, setAdvisoryLines] = useState<string[]>([]);
  const [advisoriesOpen, setAdvisoriesOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const nightHelm = useBoat((s) => s.nightHelm);
  const setNightHelm = useBoat((s) => s.setNightHelm);
  const cruiseKt = useBoat((s) => s.cruiseKt);
  const burnGph = useBoat((s) => s.burnGph);
  const tankGal = useBoat((s) => s.tankGal);
  const reservePct = useBoat((s) => s.reservePct);
  const homeMarinaId = useBoat((s) => s.homeMarinaId);
  const activeInletId = useBoat((s) => s.activeInletId);
  const boatLabel = useBoat((s) => s.boatLabel);
  const applySportsman262 = useBoat((s) => s.applySportsman262);
  const applySilverton38Acmy = useBoat((s) => s.applySilverton38Acmy);

  useEffect(() => {
    void useBoat.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("night-helm", nightHelm);
    return () => document.documentElement.classList.remove("night-helm");
  }, [nightHelm]);

  useEffect(() => {
    const saved = readLayout();
    setPanelPx(saved.panelPx);
    setSheet(saved.sheet);
    setToolsOpen(saved.tools);
    setLayoutReady(true);
    setLive(true);
    void (async () => {
      await Promise.resolve(useTrip.persist.rehydrate());
    })();
  }, []);

  useEffect(() => {
    if (!layoutReady) return;
    localStorage.setItem(LAYOUT_KEY, JSON.stringify({ panelPx, sheet, tools: toolsOpen }));
  }, [layoutReady, panelPx, sheet, toolsOpen]);

  useEffect(() => {
    if (!layoutReady) return;
    const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(id);
  }, [layoutReady, sheet]);

  useLayoutEffect(() => {
    const onGate = (event: Event) => setGateLabel(String((event as CustomEvent).detail));
    const onFuel = (event: Event) => setFuelLabel(String((event as CustomEvent).detail));
    const onBite = (event: Event) => setBiteLabel(String((event as CustomEvent).detail));
    const onReady = (event: Event) => {
      const detail = (event as CustomEvent<{ ready: boolean; line: string }>).detail;
      if (detail && typeof detail.ready === "boolean") setReadyInfo(detail);
    };
    const onSlots = (event: Event) => {
      const detail = (event as CustomEvent<{
        slot: "now" | "plus6" | "tomorrow";
        options: { id: "now" | "plus6" | "tomorrow"; label: string; summary: string; limited: boolean }[];
      }>).detail;
      if (!detail) return;
      setSlot(detail.slot);
      setSlotOptions(Array.isArray(detail.options) ? detail.options : []);
    };
    const onAdvisories = (event: Event) => {
      const detail = (event as CustomEvent<string[]>).detail;
      setAdvisoryLines(Array.isArray(detail) ? detail : []);
    };
    const onTiles = (event: Event) => {
      const detail = (event as CustomEvent<{ pct?: number | null; count?: number }>).detail;
      setTilePct(detail?.pct == null ? null : detail.pct);
    };
    window.addEventListener("fairwater-gate", onGate);
    window.addEventListener("fairwater-fuel", onFuel);
    window.addEventListener("fairwater-bite", onBite);
    window.addEventListener("fairwater-ready", onReady);
    window.addEventListener("fairwater-slots", onSlots);
    window.addEventListener("fairwater-advisories", onAdvisories);
    window.addEventListener("fairwater-tiles", onTiles);
    return () => {
      window.removeEventListener("fairwater-gate", onGate);
      window.removeEventListener("fairwater-fuel", onFuel);
      window.removeEventListener("fairwater-bite", onBite);
      window.removeEventListener("fairwater-ready", onReady);
      window.removeEventListener("fairwater-slots", onSlots);
      window.removeEventListener("fairwater-advisories", onAdvisories);
      window.removeEventListener("fairwater-tiles", onTiles);
    };
  }, []);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [helmMode, sheet]);

  const month = live ? new Date().getMonth() + 1 : 0;
  const hits = useMemo(
    () => searchFairwater(query, { region, month, limit: 10 }),
    [query, region, month],
  );

  function dragPanel(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startW = panelPx;
    function move(ev: PointerEvent) {
      setPanelPx(Math.min(560, Math.max(320, startW - (ev.clientX - startX))));
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.dispatchEvent(new Event("resize"));
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function choose(id: string, regionId: RegionId) {
    setRegion(regionId);
    setGround(id);
    setQuery("");
    setGeoNote(null);
  }

  function openRegs() {
    setHelmMode("fish");
    setSheet("open");
    setQuery("");
    setGeoNote(null);
    window.setTimeout(() => {
      window.dispatchEvent(new Event("fairwater-open-regs"));
    }, 80);
  }

  function chooseHit(hit: SearchHit) {
    if (hit.kind === "regs") {
      openRegs();
      return;
    }
    choose(hit.groundId, hit.region);
    if (hit.kind === "species" || hit.kind === "season") {
      setHelmMode("fish");
      setSheet("open");
    }
  }

  function chooseBand(b: Band) {
    const next = band === b ? "all" : b;
    setBand(next);
    if (next === "all") return;
    const current = GROUNDS.find((g) => g.id === groundId);
    if (!current || current.band !== next) {
      const pick = groundsIn(region, next)[0];
      if (pick) setGround(pick.id);
    }
  }

  /** Map-first: Leave / Run / Fish all default to peek so the chart keeps majority height. */
  function setMode(id: "leave" | "run" | "fish") {
    setHelmMode(id);
    setSheet("peek");
  }

  function nearMe() {
    if (!navigator.geolocation) {
      setGeoNote("This browser won't share a location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const hit = nearest(pos.coords.latitude, pos.coords.longitude, GROUNDS);
        if (!hit) return;
        choose(hit.item.id, hit.item.region);
        setGeoNote(
          hit.distanceMi > 40
            ? `${Math.round(hit.distanceMi)} miles to ${hit.item.name}. You're inland of the fishery.`
            : null,
        );
      },
      () => setGeoNote("Location stayed off. Pick a coast instead."),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  const home = marinaById(homeMarinaId);
  const inlet = inletById(activeInletId);
  const fuelPlan = planFuelNm(OFFSHORE_ONE_WAY_NM, cruiseKt, burnGph, tankGal, reservePct);
  const homeNm = home ? miles(inlet.lat, inlet.lng, home.lat, home.lng) * 0.868976 : null;
  const homeMin = homeNm == null ? null : (homeNm / Math.max(cruiseKt, 1)) * 60;

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-bg text-fg">
      <header className="border-b border-line">
        <div className="flex items-center gap-2 px-3 py-2 lg:gap-3 lg:px-4">
        <div className="hidden shrink-0 sm:block">
          <p className="font-display text-xl leading-none tracking-tight">Necuze On</p>
          <p className="text-xs text-muted">Boat fishing</p>
        </div>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fish, grounds, regs, season"
            aria-label="Search fish, grounds, regs, season"
            className="pr-12 pl-9"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="absolute top-1/2 right-1 flex size-12 -translate-y-1/2 items-center justify-center text-muted"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
          {hits.length ? (
            <ul className="absolute z-30 mt-1 max-h-[min(24rem,55vh)] w-full overflow-y-auto rounded-lg border border-line bg-surface shadow-none">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full flex-col items-start justify-center gap-0.5 px-3 py-2 text-left hover:bg-surface-2"
                    onClick={() => chooseHit(hit)}
                  >
                    <span className="w-full truncate text-sm font-medium text-fg">{formatHitLabel(hit)}</span>
                    <span className="w-full truncate text-xs text-muted">{hit.detail}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Button variant="quiet" onClick={() => setToolsOpen((open) => !open)} aria-expanded={toolsOpen} className="lg:hidden">
          Tools
        </Button>
        <Button
          variant="quiet"
          onClick={() => setNightHelm(!nightHelm)}
          aria-label={nightHelm ? "Day UI" : "Night helm UI"}
          aria-pressed={nightHelm}
          className="hidden sm:inline-flex"
        >
          {nightHelm ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="hidden md:inline">{nightHelm ? "Day" : "Night"}</span>
        </Button>
        <Button variant="quiet" onClick={nearMe} aria-label="Use my location" className="hidden sm:inline-flex">
          <LocateFixed className="size-4" />
          <span className="hidden md:inline">Near me</span>
        </Button>
        </div>
      </header>

      {readyInfo ? (
        <p
          className={cn(
            "border-b border-line px-3 py-1.5 text-xs sm:px-4 sm:text-sm",
            readyInfo.ready ? "text-good" : "text-fair",
          )}
          role="status"
        >
          <span className="font-medium">{readyInfo.ready ? "Ready for sea" : "Not ready"}</span>
          {" · "}
          {readyInfo.line}
          {tilePct != null ? ` · Download ${tilePct}%` : ""}
        </p>
      ) : null}

      {toolsOpen ? (
        <div className="fixed inset-0 z-[1200] flex flex-col bg-bg lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-line px-3">
            <p className="text-sm font-medium text-fg">Chart tools</p>
            <button type="button" className="h-12 rounded-md px-3 text-sm font-medium text-fg" onClick={() => setToolsOpen(false)}>
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-wrap gap-2 border-b border-line px-3 py-2" role="tablist" aria-label="Coast">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={region === r.id}
                  onClick={() => {
                    setRegion(r.id);
                    const current = GROUNDS.find((g) => g.id === groundId);
                    if (!current || current.region !== r.id) {
                      const next = groundsIn(r.id, "all")[0];
                      if (next) setGround(next.id);
                    }
                  }}
                  className={cn(
                    "h-12 rounded-md px-3 text-sm font-medium",
                    region === r.id ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2 border-b border-line px-3 py-2">
              {(["inshore", "nearshore", "offshore"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => chooseBand(b)}
                  className={cn("h-12 rounded-md border px-3 text-left text-sm", band === b ? "border-accent bg-surface-2" : "border-line")}
                >
                  {BAND_LABEL[b]}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 px-3 py-2" role="tablist" aria-label="Map view">
              {CHART_VIEWS.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={chartView === view.id}
                  onClick={() => setChartView(view.id)}
                  className={cn(
                    "h-12 rounded-md px-3 text-left text-sm font-medium",
                    chartView === view.id ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                  )}
                >
                  {view.label}
                </button>
              ))}
              <p className="text-sm text-muted">{CHART_VIEWS.find((view) => view.id === chartView)?.note}</p>
            </div>
            <div className="flex flex-col gap-2 border-t border-line px-3 py-2 sm:hidden">
              <button
                type="button"
                onClick={() => setNightHelm(!nightHelm)}
                className="h-12 rounded-md bg-surface-2 px-3 text-left text-sm font-medium text-fg"
              >
                {nightHelm ? "Day UI" : "Night helm"}
              </button>
              <button
                type="button"
                onClick={() => {
                  nearMe();
                  setToolsOpen(false);
                }}
                className="h-12 rounded-md bg-surface-2 px-3 text-left text-sm font-medium text-fg"
              >
                Near me
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="hidden gap-1 overflow-x-auto border-b border-line px-3 py-2 lg:flex" role="tablist" aria-label="Coast">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={region === r.id}
            onClick={() => {
              setRegion(r.id);
              const current = GROUNDS.find((g) => g.id === groundId);
              if (!current || current.region !== r.id) {
                const next = groundsIn(r.id, "all")[0];
                if (next) setGround(next.id);
              }
            }}
            className={cn(
              "h-12 shrink-0 rounded-md px-3 text-sm font-medium",
              region === r.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {geoNote ? <p className="border-b border-line px-4 py-2 text-sm text-muted">{geoNote}</p> : null}

      {/* Desktop helm */}
      <div className="hidden grid-cols-3 gap-2 border-b border-line px-3 py-2 lg:grid" role="tablist" aria-label="Helm mode">
        {(
          [
            ["leave", "Leave"],
            ["run", "Run"],
            ["fish", "Fish"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={helmMode === id}
            onClick={() => setMode(id)}
            className={cn(
              "h-12 rounded-md text-sm font-medium",
              helmMode === id ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tablet: Leave/Run/Fish + bands in one row */}
      <div className="hidden items-center gap-2 overflow-x-auto border-b border-line px-3 py-2 sm:max-lg:flex">
        <div className="flex shrink-0 gap-1" role="tablist" aria-label="Helm mode">
          {(
            [
              ["leave", "Leave"],
              ["run", "Run"],
              ["fish", "Fish"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={helmMode === id}
              onClick={() => setMode(id)}
              className={cn(
                "h-12 rounded-md px-3 text-sm font-medium",
                helmMode === id ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mx-1 h-8 w-px shrink-0 bg-line" aria-hidden />
        <div className="flex min-w-0 flex-1 gap-1">
          {(["inshore", "nearshore", "offshore"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => chooseBand(b)}
              className={cn(
                "h-12 min-w-0 flex-1 truncate rounded-md border px-2 text-sm font-medium",
                band === b ? "border-accent bg-surface-2 text-fg" : "border-line text-muted",
              )}
            >
              {BAND_LABEL[b]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col sm:flex-row">
        <div className="flex min-h-[52%] flex-1 flex-col sm:min-h-0 sm:w-[60%] sm:flex-none lg:w-auto lg:flex-1">
          <div className="relative min-h-[160px] min-w-0 flex-1">
            <FishingMap
              region={region}
              band={band}
              selectedId={groundId}
              chartView={chartView}
              helmMode={helmMode}
              onSelect={(id) => {
                const g = GROUNDS.find((item) => item.id === id);
                if (g) choose(g.id, g.region);
              }}
            />
          </div>
          {/* Leave peek: Now / +6h / Tomorrow — map-first chrome, not a panel */}
          {helmMode === "leave" ? (
            <div
              className={cn(
                "grid grid-cols-3 gap-1 border-t border-line px-2 py-1.5",
                sheet !== "peek" && "max-sm:hidden",
              )}
              role="tablist"
              aria-label="Departure"
            >
              {(slotOptions.length
                ? slotOptions
                : (
                    [
                      { id: "now" as const, label: "Now", summary: "—", limited: false },
                      { id: "plus6" as const, label: "+6h", summary: "—", limited: true },
                      { id: "tomorrow" as const, label: "Tomorrow", summary: "—", limited: true },
                    ]
                  )
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={slot === opt.id}
                  disabled={opt.limited}
                  onClick={() => {
                    setSlot(opt.id);
                    window.dispatchEvent(new CustomEvent("fairwater-set-slot", { detail: opt.id }));
                  }}
                  className={cn(
                    "min-h-11 rounded-md border px-1.5 py-1 text-left",
                    slot === opt.id ? "border-accent bg-surface-2" : "border-line bg-bg",
                    opt.limited && "opacity-50",
                  )}
                >
                  <span className="block text-xs font-medium text-fg sm:text-sm">{opt.label}</span>
                  <span className="block truncate text-[10px] text-muted sm:text-xs">{opt.summary}</span>
                </button>
              ))}
            </div>
          ) : null}
          {/* Leave peek: boat preset — one compact control, Leave only */}
          {helmMode === "leave" ? (
            <div
              className={cn(
                "grid grid-cols-2 gap-1 border-t border-line px-2 py-1",
                sheet !== "peek" && "max-sm:hidden",
              )}
              role="group"
              aria-label="Boat preset"
            >
              <button
                type="button"
                aria-pressed={boatLabel === SPORTSMAN_262.boatLabel || boatLabel === "Sportsman Open 262"}
                onClick={() => applySportsman262()}
                className={cn(
                  "min-h-9 rounded-md border px-1.5 text-xs font-medium sm:text-sm",
                  boatLabel === SPORTSMAN_262.boatLabel || boatLabel === "Sportsman Open 262"
                    ? "border-accent bg-surface-2 text-fg"
                    : "border-line bg-bg text-muted",
                )}
              >
                Sportsman 262
              </button>
              <button
                type="button"
                aria-pressed={boatLabel === SILVERTON_38_ACMY.boatLabel}
                onClick={() => applySilverton38Acmy()}
                className={cn(
                  "min-h-9 rounded-md border px-1.5 text-xs font-medium sm:text-sm",
                  boatLabel === SILVERTON_38_ACMY.boatLabel
                    ? "border-accent bg-surface-2 text-fg"
                    : "border-line bg-bg text-muted",
                )}
              >
                38′ Silverton ACMY
              </button>
            </div>
          ) : null}
          {/* Thin edge strip: SOG · home nm · fuel · advisories chip */}
          <div className="flex items-center gap-2 border-t border-line px-3 py-1 text-xs tabular-nums text-fg sm:py-1.5 sm:text-sm">
            <p className="min-w-0 flex-1 truncate">
              {cruiseKt.toFixed(0)} kt · {homeNm == null ? "No home marina" : `Home ${homeNm.toFixed(1)} nm`}
              {homeMin != null ? ` · ${Math.round(homeMin)} min` : ""} · Fuel RT {fuelPlan.gallons.toFixed(0)} gal ·{" "}
              {fuelPlan.home ? "HOME OK" : "GO HOME"}
            </p>
            {advisoryLines.length ? (
              <button
                type="button"
                className="h-8 shrink-0 rounded-md border border-line bg-surface-2 px-2 text-xs font-medium text-fg"
                aria-expanded={advisoriesOpen}
                onClick={() => setAdvisoriesOpen((open) => !open)}
              >
                {advisoryLines.length} advisories
              </button>
            ) : null}
          </div>
          {advisoriesOpen && advisoryLines.length ? (
            <ul className="border-t border-line bg-surface px-3 py-2 text-xs text-fg sm:text-sm">
              {advisoryLines.map((line) => (
                <li key={line} className="py-0.5">
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="hidden border-t border-line px-3 py-1.5 text-xs text-muted sm:block">
            Advisory only — not a chartplotter. Confirm with NOAA charts / Coast Pilot / your eyes.
          </p>
        </div>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-valuemin={320}
          aria-valuemax={560}
          aria-valuenow={panelPx}
          tabIndex={0}
          onPointerDown={dragPanel}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") setPanelPx((width) => Math.min(560, width + 24));
            if (event.key === "ArrowRight") setPanelPx((width) => Math.max(320, width - 24));
          }}
          className="hidden w-3 shrink-0 cursor-col-resize items-center justify-center border-line lg:flex"
        >
          <span className="h-12 w-1 rounded-full bg-line" />
        </div>
        <aside
          style={{ "--panel": `${panelPx}px` } as CSSProperties}
          className={cn(
            "flex min-h-0 flex-col border-line bg-bg",
            // Phone: bottom sheet — cap open height so map keeps majority (never a tiny strip)
            sheet === "open"
              ? "max-sm:max-h-[36vh] max-sm:flex-none max-sm:border-t"
              : "max-sm:shrink-0 max-sm:border-t",
            // Tablet: side sheet ~40%, map stays ≥ half
            "sm:h-auto sm:w-[40%] sm:flex-none sm:border-l sm:border-t-0",
            // Desktop: resizable panel width
            "lg:w-[var(--panel)]",
          )}
        >
          <button
            type="button"
            className="flex min-h-14 w-full flex-col items-center justify-center px-4 py-1.5 sm:hidden"
            aria-expanded={sheet === "open"}
            onClick={() => setSheet((value) => (value === "open" ? "peek" : "open"))}
          >
            <span className="mb-1 h-1 w-10 rounded-full bg-line" />
            <span className="flex w-full items-center justify-between gap-3">
              <span className="truncate text-sm font-medium text-fg">{gateLabel ?? groundById(groundId).name}</span>
              <span className="shrink-0 text-sm text-muted">{sheet === "open" ? "Show chart" : "Open"}</span>
            </span>
            <span className="mt-0.5 w-full truncate text-left text-xs text-muted">
              {fuelLabel ?? "Fuel"} · {biteLabel ?? "Bite"}
            </span>
          </button>
          {/* Desktop: bands + chart chips live in the panel, not above the map */}
          <div className="hidden border-b border-line px-3 py-2 lg:block">
            <div className="grid grid-cols-3 gap-2">
              {(["inshore", "nearshore", "offshore"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => chooseBand(b)}
                  className={cn(
                    "min-h-12 rounded-lg border px-2 py-1.5 text-left",
                    band === b ? "border-accent bg-surface-2" : "border-line bg-bg",
                  )}
                >
                  <span className="block text-xs font-medium tracking-wide text-subtle uppercase">{BAND_LABEL[b]}</span>
                  <span className="block truncate text-sm text-fg">
                    {live && month ? seasonNames(region, b, month) : BAND_BLURB[b]}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto" role="tablist" aria-label="Map view">
              {CHART_VIEWS.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={chartView === view.id}
                  onClick={() => setChartView(view.id)}
                  className={cn(
                    "h-12 shrink-0 rounded-md px-3 text-sm font-medium",
                    chartView === view.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2",
                  )}
                >
                  {view.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted">{CHART_VIEWS.find((view) => view.id === chartView)?.note}</p>
          </div>
          <div ref={panelRef} className={cn("min-h-0 flex-1 overflow-y-auto", sheet === "peek" && "max-sm:hidden")}>
            <ConditionsPanel />
          </div>
        </aside>
      </div>
      {/* Phone helm — Leave / Run / Fish */}
      <nav
        className="grid shrink-0 grid-cols-3 gap-2 border-t border-line bg-bg px-3 py-2 sm:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-label="Helm mode"
      >
        {(
          [
            ["leave", "Leave"],
            ["run", "Run"],
            ["fish", "Fish"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-selected={helmMode === id}
            onClick={() => setMode(id)}
            className={cn(
              "h-12 rounded-md text-sm font-medium",
              helmMode === id ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function FairwaterApp() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <Fairwater />
    </QueryClientProvider>
  );
}
