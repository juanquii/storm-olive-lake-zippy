import { useEffect, useRef, useState } from "react";
import { Ellipsis } from "lucide-react";
import type { LayerGroup, Map as LeafletMap, Renderer, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { bearing, miles } from "@/lib/marine/geo";
import { groundById, groundsIn } from "@/lib/marine/grounds";
import { inletById, marinaById } from "@/lib/marine/inlets";
import type { Band, RegionId } from "@/lib/marine/types";
import { OFFSHORE_ONE_WAY_NM, planFuelNm, useBoat } from "@/store/boat";
import type { ChartView, HelmMode } from "@/store/trip";

const OCEAN =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
const SATELLITE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const NOAA =
  "https://gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer";

const STATE_LINE: [number, number][] = [
  [36.3, -75.62],
  [36.0, -75.58],
  [35.55, -75.4],
  [35.22, -75.42],
  [34.95, -75.95],
  [34.7, -76.25],
  [34.55, -76.5],
  [34.48, -76.85],
  [34.38, -77.25],
  [34.22, -77.62],
  [34.05, -77.78],
  [33.85, -77.95],
];

const FILL: Record<Band, string> = {
  inshore: "#1f6f62",
  nearshore: "#1d4e89",
  offshore: "#3d4c7c",
};

/** Depth numbers / channel markers — match UI copy that gates below z12. */
const DEPTH_OVERLAY_MIN_ZOOM = 12;

type Props = {
  region: RegionId | "all";
  band: Band | "all";
  selectedId: string;
  chartView: ChartView;
  helmMode: HelmMode;
  onSelect: (id: string) => void;
};

function tileBbox(x: number, y: number, z: number): string {
  const n = 2 ** z;
  const R = 6378137;
  const corner = (tx: number, ty: number) => {
    const lon = (tx / n) * 360 - 180;
    const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI;
    const mx = ((lon * Math.PI) / 180) * R;
    const my = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2)) * R;
    return [mx, my] as const;
  };
  const [minx, maxy] = corner(x, y);
  const [maxx, miny] = corner(x + 1, y + 1);
  return `${minx},${miny},${maxx},${maxy}`;
}

function wmsUrl(layers: string, x: number, y: number, z: number): string {
  const params = new URLSearchParams({
    service: "WMS",
    request: "GetMap",
    version: "1.3.0",
    layers,
    styles: "",
    crs: "EPSG:3857",
    bbox: tileBbox(x, y, z),
    width: "256",
    height: "256",
    format: "image/png",
    transparent: "true",
  });
  return `${NOAA}?${params.toString()}`;
}

let chartCache: Promise<Cache> | null = null;

function chartStore(): Promise<Cache> {
  chartCache ??= caches.open("fairwater-charts");
  return chartCache;
}

function paintImageTile(
  tile: HTMLImageElement,
  url: string,
  done: (error: Error | undefined, tile: HTMLElement) => void,
) {
  let settled = false;
  const succeed = () => {
    if (settled) return;
    settled = true;
    done(undefined, tile);
  };
  tile.alt = "";
  tile.decoding = "async";
  tile.onload = succeed;
  tile.onerror = () => {
    if (settled) return;
    void chartStore()
      .then((cache) => cache.match(url))
      .then(async (hit) => {
        if (!hit) {
          done(new Error("tile"), tile);
          return;
        }
        tile.onload = succeed;
        tile.src = URL.createObjectURL(await hit.blob());
      })
      .catch(() => done(new Error("tile"), tile));
  };
  tile.src = url;
}

async function fetchOverlay(url: string): Promise<Blob | null> {
  try {
    const cache = await chartStore();
    const hit = await cache.match(url);
    if (hit) return hit.blob();
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.blob();
  } catch {
    return null;
  }
}

/** Drop the flat depth-area paint and keep the dark soundings and contours. */
function keepSoundings(image: ImageData) {
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const a = data[i + 3] ?? 0;
    if (a < 16) {
      data[i + 3] = 0;
      continue;
    }
    const lum = 0.3 * r + 0.59 * g + 0.11 * b;
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (lum < 165 || chroma > 40) continue;
    data[i + 3] = 0;
  }
}

export function FishingMap({ region, band, selectedId, chartView, helmMode, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const groupRef = useRef<LayerGroup | null>(null);
  const navRef = useRef<LayerGroup | null>(null);
  const chartRef = useRef<TileLayer | null>(null);
  const baseRef = useRef<TileLayer | null>(null);
  const overlayRef = useRef<TileLayer | null>(null);
  const canvasRef = useRef<Renderer | null>(null);
  const viewRef = useRef(chartView);
  viewRef.current = chartView;
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const regionRef = useRef(region);
  const bandRef = useRef(band);
  regionRef.current = region;
  bandRef.current = band;
  const [booted, setBooted] = useState(false);
  const [zoom, setZoom] = useState(14);
  const [savedTiles, setSavedTiles] = useState(0);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [measure, setMeasure] = useState<string | null>(null);
  const [draftOn, setDraftOn] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const waypoints = useBoat((s) => s.waypoints);
  const track = useBoat((s) => s.track);
  const markMode = useBoat((s) => s.markMode);
  const recording = useBoat((s) => s.recording);
  const toggleMark = useBoat((s) => s.toggleMark);
  const setRecording = useBoat((s) => s.setRecording);
  const activeInletId = useBoat((s) => s.activeInletId);
  const homeMarinaId = useBoat((s) => s.homeMarinaId);
  const showRings = useBoat((s) => s.showRings);
  const cruiseKt = useBoat((s) => s.cruiseKt);
  const burnGph = useBoat((s) => s.burnGph);
  const tankGal = useBoat((s) => s.tankGal);
  const reservePct = useBoat((s) => s.reservePct);
  const draftFt = useBoat((s) => s.draftFt);
  const shoalDepthFt = useBoat((s) => s.shoalDepthFt);
  const addWaypoint = useBoat((s) => s.addWaypoint);
  const markRef = useRef(markMode);
  const addRef = useRef(addWaypoint);
  markRef.current = markMode;
  addRef.current = addWaypoint;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let alive = true;
    let map: LeafletMap | null = null;
    let zoomSettleTimer: number | undefined;

    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default;
      if (!alive || !host.current) return;
      const ground = groundById(selectedId);
      map = L.map(host.current, {
        zoomControl: false,
        attributionControl: true,
        minZoom: 4,
        maxZoom: 18,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        fadeAnimation: false,
        zoomAnimation: true,
      }).setView([ground.lat, ground.lng], 14);
      L.control.zoom({ position: "topright" }).addTo(map);
      L.control.scale({ imperial: true, metric: false, position: "bottomleft" }).addTo(map);
      const Cached = L.TileLayer.extend({
        createTile(coords: { x: number; y: number; z: number }, done: (error: Error | undefined, tile: HTMLElement) => void) {
          const tile = document.createElement("img");
          paintImageTile(tile, this.getTileUrl(coords), done);
          return tile;
        },
      });
      const CachedLayer = Cached as new (url: string, options: Record<string, unknown>) => TileLayer;
      const base = new CachedLayer(OCEAN, {
        attribution: "Esri",
        maxZoom: 18,
        maxNativeZoom: 13,
        updateWhenIdle: false,
        keepBuffer: 2,
      });
      base.addTo(map);
      baseRef.current = base;
      const Chart = L.TileLayer.WMS.extend({
        createTile(coords: { x: number; y: number; z: number }, done: (error: Error | undefined, tile: HTMLElement) => void) {
          const tile = document.createElement("img");
          paintImageTile(tile, this.getTileUrl(coords), done);
          return tile;
        },
      });
      const ChartLayer = Chart as new (url: string, options: Record<string, unknown>) => TileLayer;
      const layer = new ChartLayer(NOAA, {
        layers: "0,1,2,3,4,5,6,7,8,9,10,11,12",
        format: "image/png",
        transparent: false,
        version: "1.3.0",
        attribution: "NOAA Chart Display Service",
        maxZoom: 18,
        updateWhenIdle: false,
        keepBuffer: 2,
      });
      layer.addTo(map);
      chartRef.current = layer;
      const Overlay = L.GridLayer.extend({
        createTile(coords: { x: number; y: number; z: number }, done: (error: Error | undefined, tile: HTMLElement) => void) {
          const canvas = document.createElement("canvas");
          canvas.width = 256;
          canvas.height = 256;
          // Skip WMS + keepSoundings below the depth-number threshold — empty tile until zoom settles at z12+.
          if (coords.z < DEPTH_OVERLAY_MIN_ZOOM) {
            done(undefined, canvas);
            return canvas;
          }
          void (async () => {
            try {
              const depthBlob = await fetchOverlay(wmsUrl("2", coords.x, coords.y, coords.z));
              const markBlob = await fetchOverlay(wmsUrl("1,3,4,6,7", coords.x, coords.y, coords.z));
              const ctx = canvas.getContext("2d");
              if (!ctx) throw new Error("canvas");
              if (depthBlob) {
                const depth = await createImageBitmap(depthBlob);
                ctx.drawImage(depth, 0, 0);
                depth.close();
                const pixels = ctx.getImageData(0, 0, 256, 256);
                keepSoundings(pixels);
                ctx.putImageData(pixels, 0, 0);
              }
              if (markBlob) {
                const marks = await createImageBitmap(markBlob);
                ctx.drawImage(marks, 0, 0);
                marks.close();
              }
              done(undefined, canvas);
            } catch (error) {
              done(error instanceof Error ? error : new Error("overlay"), canvas);
            }
          })();
          return canvas;
        },
      });
      const OverlayLayer = Overlay as new (options: Record<string, unknown>) => TileLayer;
      // updateWhenIdle: paint heavy depth tiles only after zoom/pan settles (no mid-gesture redraw).
      overlayRef.current = new OverlayLayer({
        maxZoom: 18,
        minZoom: DEPTH_OVERLAY_MIN_ZOOM,
        updateWhenIdle: true,
        updateWhenZooming: false,
        attribution: "NOAA",
      });
      canvasRef.current = L.canvas({ padding: 0.5 });
      groupRef.current = L.layerGroup().addTo(map);
      navRef.current = L.layerGroup().addTo(map);
      map.on("zoomstart", () => {
        if (zoomSettleTimer) window.clearTimeout(zoomSettleTimer);
        const live = mapRef.current;
        const overlay = overlayRef.current;
        // Hide heavy overlay mid-gesture so keepSoundings work does not run during pinch/zoom.
        if (live && overlay && live.hasLayer(overlay)) live.removeLayer(overlay);
      });
      map.on("zoomend", () => {
        if (!map) return;
        const z = map.getZoom();
        setZoom(z);
        if (zoomSettleTimer) window.clearTimeout(zoomSettleTimer);
        zoomSettleTimer = window.setTimeout(() => {
          const overlay = overlayRef.current;
          if (!overlay || !mapRef.current) return;
          const view = viewRef.current;
          const wantsOverlay = view === "hybrid" || view === "fishing";
          if (wantsOverlay && z >= DEPTH_OVERLAY_MIN_ZOOM) {
            if (!mapRef.current.hasLayer(overlay)) overlay.addTo(mapRef.current);
            else overlay.redraw();
          } else if (mapRef.current.hasLayer(overlay)) {
            mapRef.current.removeLayer(overlay);
          }
        }, 120);
      });
      mapRef.current = map;
      map.invalidateSize();
      window.setTimeout(() => {
        map?.invalidateSize();
        map?.dragging.enable();
        map?.touchZoom.enable();
      }, 300);
      void caches.open("fairwater-charts").then(async (cache) => {
        const keys = await cache.keys();
        if (alive) setSavedTiles(keys.length);
      });
      if (alive) setBooted(true);
    })();

    return () => {
      alive = false;
      if (zoomSettleTimer) window.clearTimeout(zoomSettleTimer);
      map?.remove();
      mapRef.current = null;
      groupRef.current = null;
      navRef.current = null;
      chartRef.current = null;
      baseRef.current = null;
      overlayRef.current = null;
      canvasRef.current = null;
      setBooted(false);
    };
    // The chart should open on the inlet already selected, then stay put while the user pans.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!booted) return;
    let cancelled = false;
    (async () => {
      const leaflet = await import("leaflet");
      const L = leaflet.default;
      if (cancelled || !groupRef.current) return;
      groupRef.current.clearLayers();
      const renderer = canvasRef.current ?? undefined;
      for (const ground of groundsIn(region, band)) {
        const selected = ground.id === selectedId;
        const marker = L.circleMarker([ground.lat, ground.lng], {
          radius: selected ? 9 : 6,
          color: "#102028",
          weight: 2,
          fillColor: selected ? "#f4f1e8" : FILL[ground.band],
          fillOpacity: 1,
          renderer,
        });
        marker.on("click", (event) => {
          L.DomEvent.stopPropagation(event);
          selectRef.current(ground.id);
        });
        marker.bindTooltip(ground.name, {
          permanent: selected,
          direction: "top",
          offset: [0, -8],
          className: "fw-label",
        });
        groupRef.current.addLayer(marker);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [booted, region, band, selectedId]);

  useEffect(() => {
    if (!booted || !mapRef.current) return;
    const ground = groundById(selectedId);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    mapRef.current.flyTo([ground.lat, ground.lng], 14, {
      animate: !motion,
      duration: motion ? 0 : 0.45,
    });
  }, [booted, selectedId]);

  useEffect(() => {
    if (!booted || !mapRef.current) return;
    const map = mapRef.current;
    const onClick = (event: { latlng: { lat: number; lng: number } }) => {
      setMeasure(null);
      if (!markRef.current) return;
      addRef.current(event.latlng.lat, event.latlng.lng);
    };
    const onHold = (event: { latlng: { lat: number; lng: number } }) => {
      const here = inletById(useBoat.getState().activeInletId);
      const home = marinaById(useBoat.getState().homeMarinaId);
      const toInlet = miles(event.latlng.lat, event.latlng.lng, here.lat, here.lng) * 0.868976;
      const deg = (bearing(event.latlng.lat, event.latlng.lng, here.lat, here.lng) + 360) % 360;
      const homeLine = home
        ? `Home ${(miles(event.latlng.lat, event.latlng.lng, home.lat, home.lng) * 0.868976).toFixed(1)} nm`
        : "No home marina";
      setMeasure(`${homeLine} · ${here.barName} ${toInlet.toFixed(1)} nm at ${Math.round(deg)}°`);
    };
    map.on("click", onClick);
    map.on("contextmenu", onHold);
    return () => {
      map.off("click", onClick);
      map.off("contextmenu", onHold);
    };
  }, [booted]);

  useEffect(() => {
    if (!booted || !navRef.current) return;
    let cancelled = false;
    void import("leaflet").then((leaflet) => {
      if (cancelled || !navRef.current) return;
      const L = leaflet.default;
      navRef.current.clearLayers();
      const renderer = canvasRef.current ?? undefined;
      if (region === "outer-banks") {
        L.polyline(STATE_LINE, { color: "#8a6844", weight: 2, dashArray: "6 6" })
          .bindTooltip("Approximate 3 nm state line. Inside is state water, outside is federal. Not a legal boundary.", {
            sticky: true,
          })
          .addTo(navRef.current);
      }
      if (track.length > 1) {
        L.polyline(track.map((point) => [point.lat, point.lng] as [number, number]), {
          color: "#d9897b",
          weight: 3,
        }).addTo(navRef.current);
      }
      if (waypoints.length > 1) {
        L.polyline(waypoints.map((point) => [point.lat, point.lng] as [number, number]), {
          color: "#102028",
          weight: 2,
        }).addTo(navRef.current);
      }
      for (const mark of waypoints) {
        L.circleMarker([mark.lat, mark.lng], {
          radius: 6,
          color: "#102028",
          weight: 2,
          fillColor: "#d4b483",
          fillOpacity: 1,
          renderer,
        })
          .bindTooltip(mark.name, { permanent: true, direction: "top", className: "fw-label" })
          .addTo(navRef.current);
      }
      const inlet = inletById(activeInletId);
      const home = marinaById(homeMarinaId);
      L.circleMarker([inlet.lat, inlet.lng], { radius: 8, color: "#8a3030", weight: 2, fillColor: "#d9897b", fillOpacity: 1, renderer })
        .bindTooltip(inlet.name, { permanent: true, direction: "right", className: "fw-label" })
        .addTo(navRef.current);
      if (home) {
        L.circleMarker([home.lat, home.lng], { radius: 8, color: "#102028", weight: 2, fillColor: "#f4f1e8", fillOpacity: 1, renderer })
          .bindTooltip(home.name, { permanent: true, direction: "left", className: "fw-label" })
          .addTo(navRef.current);
      }
      if (helmMode === "run" && showRings) {
        const origin = home ?? inlet;
        const plan = planFuelNm(OFFSHORE_ONE_WAY_NM, cruiseKt, burnGph, tankGal, reservePct);
        const usableOneWay = ((plan.usable / Math.max(burnGph, 0.1)) * cruiseKt) / 2;
        const fullOneWay = ((tankGal / Math.max(burnGph, 0.1)) * cruiseKt) / 2;
        L.circle([origin.lat, origin.lng], { radius: usableOneWay * 1852, color: "#3d6b4f", weight: 2, fillOpacity: 0.04 })
          .bindTooltip(`Usable one-way about ${usableOneWay.toFixed(0)} nm`, { sticky: true })
          .addTo(navRef.current);
        L.circle([origin.lat, origin.lng], { radius: OFFSHORE_ONE_WAY_NM * 1852, color: "#8a6844", weight: 2, fill: false })
          .bindTooltip("40 nm out", { sticky: true })
          .addTo(navRef.current);
        L.circle([origin.lat, origin.lng], { radius: fullOneWay * 1852, color: "#8a3030", weight: 1, dashArray: "6 6", fill: false })
          .bindTooltip("Includes reserve. Dashed on purpose.", { sticky: true })
          .addTo(navRef.current);
      }
      if ((chartView === "hybrid" || chartView === "fishing") && draftOn && shoalDepthFt != null && shoalDepthFt < draftFt + 1) {
        L.circle([inlet.lat, inlet.lng], { radius: 400, color: "#8a3030", weight: 2, fillColor: "#8a3030", fillOpacity: 0.25 })
          .bindTooltip("Depth advisory only — not a clearance guarantee.", { sticky: true })
          .addTo(navRef.current);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [booted, region, track, waypoints, activeInletId, homeMarinaId, showRings, helmMode, cruiseKt, burnGph, tankGal, reservePct, chartView, draftOn, shoalDepthFt, draftFt]);


  useEffect(() => {
    const map = mapRef.current;
    const base = baseRef.current;
    const chart = chartRef.current;
    const overlay = overlayRef.current;
    if (!booted || !map || !base || !chart || !overlay) return;
    const photo = chartView === "satellite" || chartView === "hybrid";
    base.setUrl(photo ? SATELLITE : OCEAN);
    base.options.maxNativeZoom = photo ? 19 : 13;
    base.options.attribution = photo ? "Esri World Imagery" : "Esri Ocean";
    if (chartView === "chart") {
      if (!map.hasLayer(chart)) chart.addTo(map);
      if (map.hasLayer(overlay)) map.removeLayer(overlay);
    } else if (chartView === "satellite") {
      if (map.hasLayer(chart)) map.removeLayer(chart);
      if (map.hasLayer(overlay)) map.removeLayer(overlay);
    } else {
      if (map.hasLayer(chart)) map.removeLayer(chart);
      // Heavy depth overlay only at z12+ and after idle — aligns with depth-number UI copy.
      if (map.getZoom() >= DEPTH_OVERLAY_MIN_ZOOM) {
        if (!map.hasLayer(overlay)) overlay.addTo(map);
        overlay.redraw();
      } else if (map.hasLayer(overlay)) {
        map.removeLayer(overlay);
      }
    }
    if (groupRef.current) {
      groupRef.current.remove();
      groupRef.current.addTo(map);
    }
    if (navRef.current) {
      navRef.current.remove();
      navRef.current.addTo(map);
    }
    base.redraw();
  }, [booted, chartView]);

  useEffect(() => {
    const map = mapRef.current;
    if (!booted || !map) return;
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [booted]);

  async function cacheUrl(url: string) {
    if (await caches.open("fairwater-charts").then((cache) => cache.match(url))) return;
    const res = await fetch(url);
    if (!res.ok) return;
    const cache = await caches.open("fairwater-charts");
    await cache.put(url, new Response(await res.blob()));
  }

  async function saveView() {
    const map = mapRef.current;
    const layer = chartRef.current;
    const base = baseRef.current;
    if (!map || !layer || !base) return;
    const zoom = map.getZoom();
    const view = viewRef.current;
    if (view !== "satellite" && zoom < 12) {
      setSaveNote("Zoom to the inlet first. The whole coast is not stored on the phone.");
      return;
    }
    const zooms = view === "chart" ? [zoom, Math.min(16, zoom + 1)] : [zoom];
    const coords: { x: number; y: number; z: number }[] = [];
    for (const z of zooms) {
      const bounds = map.getBounds();
      const nw = map.project(bounds.getNorthWest(), z);
      const se = map.project(bounds.getSouthEast(), z);
      for (let x = Math.floor(nw.x / 256); x <= Math.floor(se.x / 256); x++) {
        for (let y = Math.floor(nw.y / 256); y <= Math.floor(se.y / 256); y++) coords.push({ x, y, z });
      }
    }
    if (coords.length > (view === "chart" ? 80 : 40)) {
      setSaveNote("That view is too wide. Zoom in, then save it.");
      return;
    }
    setSaveNote("Saving this view…");
    window.dispatchEvent(new CustomEvent("fairwater-tiles", { detail: { pct: 0, count: 0 } }));
    let done = 0;
    for (const coord of coords) {
      await cacheUrl(base.getTileUrl(coord as never));
      if (view === "chart") await cacheUrl(layer.getTileUrl(coord as never));
      if (view === "hybrid" || view === "fishing") {
        await cacheUrl(wmsUrl("2", coord.x, coord.y, coord.z));
        await cacheUrl(wmsUrl("1,3,4,6,7", coord.x, coord.y, coord.z));
      }
      done += 1;
      const pct = Math.round((done / coords.length) * 100);
      window.dispatchEvent(new CustomEvent("fairwater-tiles", { detail: { pct, count: done } }));
      setSaveNote(`Saving this view… ${pct}%`);
    }
    const keys = await caches.open("fairwater-charts").then((cache) => cache.keys());
    setSavedTiles(keys.length);
    window.dispatchEvent(new CustomEvent("fairwater-tiles", { detail: { pct: null, count: keys.length } }));
    setSaveNote(`${keys.length} tiles saved for this view. Water you have not opened is not on the phone.`);
  }

  function showCoast() {
    const map = mapRef.current;
    if (!map) return;
    void import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      const visible = groundsIn(regionRef.current, bandRef.current);
      if (!visible.length) return;
      map.fitBounds(L.latLngBounds(visible.map((g) => [g.lat, g.lng] as [number, number])).pad(0.35), {
        animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        padding: [28, 28],
        maxZoom: 9,
      });
    });
  }

  return (
    <div className="relative h-full w-full touch-none">
      <div ref={host} className="fairwater-map h-full w-full" />
      <div className="absolute top-3 left-3 z-[1000] flex max-w-[min(100%-1.5rem,18rem)] flex-col items-start gap-2">
        {/* Phone: Run chips (Mark/Record) + one Tools overflow. Desktop: quiet overlays stay visible. */}
        {helmMode === "run" ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleMark()}
              className={`h-11 rounded-md border border-line px-3 text-sm font-medium ${markMode ? "bg-accent text-accent-fg" : "bg-surface/95 text-fg"}`}
            >
              {markMode ? "Marking" : "Mark"}
            </button>
            <button
              type="button"
              onClick={() => setRecording(!recording)}
              className={`h-11 rounded-md border border-line px-3 text-sm font-medium ${recording ? "bg-poor text-bg" : "bg-surface/95 text-fg"}`}
            >
              {recording ? "Stop" : "Record"}
            </button>
          </div>
        ) : null}

        {/* Phone / tablet: single overflow control */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setToolsOpen((open) => !open)}
            aria-expanded={toolsOpen}
            aria-label="Map tools"
            className="flex h-11 items-center gap-1.5 rounded-md border border-line bg-surface/95 px-3 text-sm font-medium text-fg"
          >
            <Ellipsis className="size-4" aria-hidden />
            Tools
          </button>
          {toolsOpen ? (
            <div className="absolute top-full left-0 mt-1 flex min-w-[11rem] flex-col gap-1 rounded-lg border border-line bg-surface p-1 shadow-none">
              <button
                type="button"
                onClick={() => {
                  showCoast();
                  setToolsOpen(false);
                }}
                className="h-11 rounded-md px-3 text-left text-sm font-medium text-fg hover:bg-surface-2"
              >
                Whole coast
              </button>
              <button
                type="button"
                onClick={() => {
                  void saveView();
                  setToolsOpen(false);
                }}
                className="h-11 rounded-md px-3 text-left text-sm font-medium text-fg hover:bg-surface-2"
              >
                Save view
              </button>
              {helmMode === "run" ? (
                <button
                  type="button"
                  onClick={() => {
                    useBoat.getState().toggleRings();
                    setToolsOpen(false);
                  }}
                  className="h-11 rounded-md px-3 text-left text-sm font-medium text-fg hover:bg-surface-2"
                >
                  {showRings ? "Hide rings" : "Range rings"}
                </button>
              ) : null}
              {chartView === "hybrid" || chartView === "fishing" ? (
                <button
                  type="button"
                  onClick={() => {
                    setDraftOn((on) => !on);
                    setToolsOpen(false);
                  }}
                  className="h-11 rounded-md px-3 text-left text-sm font-medium text-fg hover:bg-surface-2"
                >
                  {draftOn ? "Hide draft danger" : "Draft danger"}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Desktop: quiet map overlays (no tall stack on phone) */}
        <div className="hidden flex-col gap-2 lg:flex">
          <button
            type="button"
            onClick={showCoast}
            className="h-11 rounded-md border border-line bg-surface/95 px-3 text-sm font-medium text-fg"
          >
            Whole coast
          </button>
          <button
            type="button"
            onClick={() => void saveView()}
            className="h-11 rounded-md border border-line bg-surface/95 px-3 text-sm font-medium text-fg"
          >
            Save view
          </button>
          {helmMode === "run" ? (
            <button
              type="button"
              onClick={() => useBoat.getState().toggleRings()}
              className="h-11 rounded-md border border-line bg-surface/95 px-3 text-sm font-medium text-fg"
            >
              {showRings ? "Hide rings" : "Range rings"}
            </button>
          ) : null}
          {chartView === "hybrid" || chartView === "fishing" ? (
            <button
              type="button"
              onClick={() => setDraftOn((on) => !on)}
              className="h-11 rounded-md border border-line bg-surface/95 px-3 text-sm font-medium text-fg"
            >
              {draftOn ? "Hide draft danger" : "Draft danger"}
            </button>
          ) : null}
        </div>
      </div>
      {saveNote ? (
        <p className="absolute right-3 bottom-7 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted">
          {saveNote}
        </p>
      ) : savedTiles > 0 ? (
        <p className="absolute right-3 bottom-7 z-[1000] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted">
          {savedTiles} chart tiles saved
        </p>
      ) : (
        <p className="absolute right-3 bottom-7 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted">
          Save tiles for home area
        </p>
      )}
      {measure ? (
        <p className="absolute bottom-16 left-3 z-[1000] max-w-[18rem] rounded-md bg-surface/95 px-2 py-1 text-sm text-fg">
          {measure}
        </p>
      ) : null}
      {chartView === "satellite" ? (
        <p className="absolute bottom-7 left-3 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted">
          Photo only. No depths and no buoys on this view.
        </p>
      ) : zoom < DEPTH_OVERLAY_MIN_ZOOM ? (
        <p className="absolute bottom-7 left-3 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted">
          Zoom in for depth numbers and the red and green channel markers.
        </p>
      ) : null}
    </div>
  );
}