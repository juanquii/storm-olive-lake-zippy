import { create } from "zustand";
import { persist } from "zustand/middleware";
import { miles } from "@/lib/marine/geo";
import type { InletId, MarinaId } from "@/lib/marine/inlets";

export type Waypoint = { id: string; name: string; lat: number; lng: number };
export type TrackPoint = { lat: number; lng: number };
export type CatchLog = {
  id: string;
  species: string;
  at: string;
  lat: number;
  lng: number;
  tide: string;
  moon: string;
};

/** Sportsman Open 262 · twin ~F200 · ~22" draft · ~150–182 gal usable tank. */
export const SPORTSMAN_262 = {
  boatLabel: "Sportsman Open 262 CC",
  draftFt: 1.83,
  cruiseKt: 28,
  burnGph: 15,
  planningBurnGph: 18,
  tankGal: 170,
  reservePct: 25,
  maxSeasFt: 3.5,
  minPeriodS: 6,
  maxWindMph: 18,
} as const;

/** 38′ Silverton ACMY · draft 4′2″ max (38C manual) · 360 gal · published diesel cruise ~22.9 kt / ~34 gph. */
export const SILVERTON_38_ACMY = {
  boatLabel: "38′ Silverton ACMY",
  draftFt: 4.17,
  tankGal: 360,
  cruiseKt: 23,
  burnGph: 34,
  planningBurnGph: 39,
  reservePct: 25,
  maxSeasFt: 5,
  minPeriodS: 6,
  maxWindMph: 22,
} as const;

/** One-way offshore planning leg (nm). planFuelNm doubles this for round-trip. Juan: 40 out / 80 RT. */
export const OFFSHORE_ONE_WAY_NM = 40;
/** @deprecated alias — prefer OFFSHORE_ONE_WAY_NM */
export const OFFSHORE_RT_NM = OFFSHORE_ONE_WAY_NM;

export const CHECKLIST_ITEMS: { id: string; label: string }[] = [
  { id: "gate", label: "Inlet gate reviewed (seas, period, wind, ebb)" },
  { id: "nws", label: "NWS coastal waters read" },
  { id: "fuel", label: "Fuel topped for 40 nm out / 80 nm RT + reserve" },
  { id: "float", label: "Float plan shared (ETA, crew, VHF)" },
  { id: "vhf", label: "VHF radio check + channels 16/22A" },
  { id: "safety", label: "PFDs, throwables, flares, first aid" },
  { id: "kill", label: "Kill-switch lanyard + engine pre-start" },
  { id: "phone", label: "Phone charged · Necuze On offline tiles saved" },
];

type RuleKeys =
  | "draftFt"
  | "cruiseKt"
  | "burnGph"
  | "planningBurnGph"
  | "tankGal"
  | "reservePct"
  | "maxSeasFt"
  | "minPeriodS"
  | "maxWindMph";

type BoatState = {
  boatLabel: string;
  draftFt: number;
  cruiseKt: number;
  burnGph: number;
  planningBurnGph: number;
  tankGal: number;
  reservePct: number;
  maxSeasFt: number;
  minPeriodS: number;
  maxWindMph: number;
  homeMarinaId: MarinaId | null;
  activeInletId: InletId;
  shoalDepthFt: number | null;
  showRings: boolean;
  waypoints: Waypoint[];
  track: TrackPoint[];
  recording: boolean;
  markMode: boolean;
  catches: CatchLog[];
  checklist: Record<string, boolean>;
  nightHelm: boolean;
  setRule: (patch: Partial<Pick<BoatState, RuleKeys>>) => void;
  applySportsman262: () => void;
  applySilverton38Acmy: () => void;
  setHomeMarina: (id: MarinaId | null) => void;
  setActiveInlet: (id: InletId) => void;
  setPlanningBurn: (gph: number) => void;
  setShoalDepth: (ft: number | null) => void;
  toggleRings: () => void;
  addWaypoint: (lat: number, lng: number) => void;
  clearWaypoints: () => void;
  importMarks: (marks: { name: string; lat: number; lng: number }[]) => void;
  toggleMark: () => void;
  setRecording: (recording: boolean) => void;
  addTrack: (point: TrackPoint) => void;
  clearTrack: () => void;
  addCatch: (entry: Omit<CatchLog, "id">) => void;
  updateCatch: (id: string, species: string) => void;
  removeCatch: (id: string) => void;
  toggleCheck: (id: string) => void;
  resetChecklist: () => void;
  setNightHelm: (nightHelm: boolean) => void;
};

function emptyChecklist(): Record<string, boolean> {
  return Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.id, false]));
}

/** Replace legacy bay-boat defaults (40 gal / 1.5 ft / 8 gph) with Sportsman 262. */
function migrateBoat(persisted: unknown): BoatState {
  const state = (persisted ?? {}) as Partial<BoatState> & { tankGal?: number; draftFt?: number; burnGph?: number };
  const looksLegacy =
    state.tankGal === 40 ||
    state.draftFt === 1.5 ||
    state.burnGph === 8 ||
    state.burnGph === 24 ||
    state.tankGal == null;
  const next = {
    ...SPORTSMAN_262,
    ...state,
    boatLabel: looksLegacy ? SPORTSMAN_262.boatLabel : (state.boatLabel ?? SPORTSMAN_262.boatLabel),
    draftFt: looksLegacy ? SPORTSMAN_262.draftFt : (state.draftFt ?? SPORTSMAN_262.draftFt),
    cruiseKt: looksLegacy ? SPORTSMAN_262.cruiseKt : (state.cruiseKt ?? SPORTSMAN_262.cruiseKt),
    burnGph: looksLegacy ? SPORTSMAN_262.burnGph : (state.burnGph ?? SPORTSMAN_262.burnGph),
    planningBurnGph: looksLegacy ? SPORTSMAN_262.planningBurnGph : (state.planningBurnGph ?? SPORTSMAN_262.planningBurnGph),
    tankGal: looksLegacy ? SPORTSMAN_262.tankGal : (state.tankGal ?? SPORTSMAN_262.tankGal),
    reservePct: looksLegacy ? SPORTSMAN_262.reservePct : (state.reservePct ?? SPORTSMAN_262.reservePct),
    maxSeasFt: looksLegacy ? SPORTSMAN_262.maxSeasFt : (state.maxSeasFt ?? SPORTSMAN_262.maxSeasFt),
    minPeriodS: state.minPeriodS ?? SPORTSMAN_262.minPeriodS,
    maxWindMph: state.maxWindMph ?? SPORTSMAN_262.maxWindMph,
    waypoints: state.waypoints ?? [],
    track: state.track ?? [],
    recording: false,
    markMode: false,
    catches: state.catches ?? [],
    homeMarinaId: state.homeMarinaId ?? "70-west",
    activeInletId: state.activeInletId ?? "beaufort",
    shoalDepthFt: state.shoalDepthFt ?? null,
    showRings: state.showRings ?? true,
    checklist: { ...emptyChecklist(), ...(state.checklist ?? {}) },
    nightHelm: state.nightHelm ?? false,
  };
  return next as BoatState;
}

export function planFuelNm(
  nmOneWay: number,
  cruiseKt: number,
  burnGph: number,
  tankGal: number,
  reservePct: number,
) {
  const nm = nmOneWay * 2;
  const hours = nm / Math.max(cruiseKt, 1);
  const gallons = hours * burnGph;
  const usable = tankGal * (1 - reservePct / 100);
  return {
    nm,
    hours,
    gallons,
    usable,
    home: gallons <= usable,
    reserveGal: tankGal - usable,
  };
}

export function routeFuel(
  marks: { lat: number; lng: number }[],
  cruiseKt: number,
  burnGph: number,
  tankGal: number,
  reservePct: number,
) {
  let statute = 0;
  for (let i = 1; i < marks.length; i++) {
    const prev = marks[i - 1];
    const next = marks[i];
    if (!prev || !next) continue;
    statute += miles(prev.lat, prev.lng, next.lat, next.lng);
  }
  const nm = statute * 0.868976;
  const first = marks[0];
  const last = marks[marks.length - 1];
  const closed =
    !!first &&
    !!last &&
    marks.length >= 2 &&
    miles(first.lat, first.lng, last.lat, last.lng) * 0.868976 <= 0.05;
  const tripNm = closed ? nm : nm * 2;
  const hours = tripNm / Math.max(cruiseKt, 1);
  const gallons = hours * burnGph;
  const usable = tankGal * (1 - reservePct / 100);
  return { nm: tripNm, hours, gallons, home: gallons <= usable, closed };
}

export const useBoat = create<BoatState>()(
  persist(
    (set) => ({
      ...SPORTSMAN_262,
      waypoints: [],
      track: [],
      recording: false,
      markMode: false,
      catches: [],
      homeMarinaId: "70-west",
      activeInletId: "beaufort",
      shoalDepthFt: null,
      showRings: true,
      checklist: emptyChecklist(),
      nightHelm: false,
      setRule: (patch) => set(patch),
      applySportsman262: () => set({ ...SPORTSMAN_262 }),
      applySilverton38Acmy: () => set({ ...SILVERTON_38_ACMY }),
      setHomeMarina: (homeMarinaId) => set({ homeMarinaId }),
      setActiveInlet: (activeInletId) => set({ activeInletId }),
      setPlanningBurn: (planningBurnGph) => set({ planningBurnGph }),
      setShoalDepth: (shoalDepthFt) => set({ shoalDepthFt }),
      toggleRings: () => set((s) => ({ showRings: !s.showRings })),
      addWaypoint: (lat, lng) =>
        set((s) => ({
          waypoints: [
            ...s.waypoints,
            { id: `${Date.now()}`, name: `Mark ${s.waypoints.length + 1}`, lat, lng },
          ].slice(-12),
        })),
      clearWaypoints: () => set({ waypoints: [] }),
      importMarks: (marks) =>
        set({
          waypoints: marks.slice(0, 12).map((mark, index) => ({
            id: `${Date.now()}-${index}`,
            name: mark.name || `Mark ${index + 1}`,
            lat: mark.lat,
            lng: mark.lng,
          })),
        }),
      toggleMark: () => set((s) => ({ markMode: !s.markMode })),
      setRecording: (recording) => set({ recording }),
      addTrack: (point) =>
        set((s) => {
          const last = s.track[s.track.length - 1];
          if (last && Math.abs(last.lat - point.lat) < 0.00005 && Math.abs(last.lng - point.lng) < 0.00005) return s;
          return { track: [...s.track, point].slice(-400) };
        }),
      clearTrack: () => set({ track: [], recording: false }),
      addCatch: (entry) =>
        set((s) => ({ catches: [{ ...entry, id: `${Date.now()}` }, ...s.catches].slice(0, 40) })),
      updateCatch: (id, species) =>
        set((s) => ({ catches: s.catches.map((entry) => (entry.id === id ? { ...entry, species } : entry)) })),
      removeCatch: (id) => set((s) => ({ catches: s.catches.filter((entry) => entry.id !== id) })),
      toggleCheck: (id) =>
        set((s) => ({ checklist: { ...s.checklist, [id]: !s.checklist[id] } })),
      resetChecklist: () => set({ checklist: emptyChecklist() }),
      setNightHelm: (nightHelm) => set({ nightHelm }),
    }),
    {
      name: "fairwater-boat",
      skipHydration: true,
      version: 3,
      migrate: (persisted) => migrateBoat(persisted) as never,
    },
  ),
);
