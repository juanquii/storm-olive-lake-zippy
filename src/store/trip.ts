import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Band, RegionId } from "@/lib/marine/types";

export type ChartView = "chart" | "satellite" | "hybrid" | "fishing";
export type HelmMode = "leave" | "run" | "fish";

type TripState = {
  groundId: string;
  region: RegionId | "all";
  band: Band | "all";
  dayOffset: 0 | 1 | 2;
  chartView: ChartView;
  helmMode: HelmMode;
  saved: string[];
  setGround: (id: string) => void;
  setRegion: (region: RegionId | "all") => void;
  setBand: (band: Band | "all") => void;
  setDayOffset: (dayOffset: 0 | 1 | 2) => void;
  setChartView: (chartView: ChartView) => void;
  setHelmMode: (helmMode: HelmMode) => void;
  toggleSaved: (id: string) => void;
};

export const useTrip = create<TripState>()(
  persist(
    (set) => ({
      groundId: "beaufort-inlet",
      region: "outer-banks",
      band: "all",
      dayOffset: 0,
      chartView: "chart",
      helmMode: "leave",
      saved: [],
      setGround: (groundId) => set({ groundId }),
      setRegion: (region) => set({ region }),
      setBand: (band) => set({ band }),
      setDayOffset: (dayOffset) => set({ dayOffset }),
      setChartView: (chartView) => set({ chartView }),
      setHelmMode: (helmMode) => set({ helmMode }),
      toggleSaved: (id) =>
        set((s) => ({
          saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
        })),
    }),
    {
      name: "fairwater",
      skipHydration: true,
      version: 4,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<TripState>;
        return {
          groundId: state.groundId || "beaufort-inlet",
          region: state.region || "outer-banks",
          band: state.band ?? "all",
          dayOffset: state.dayOffset ?? 0,
          chartView: state.chartView ?? "chart",
          helmMode: state.helmMode ?? "leave",
          saved: state.saved ?? [],
        };
      },
    },
  ),
);
