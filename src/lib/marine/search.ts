import { GROUNDS, BAND_LABEL, REGIONS } from "./grounds";
import type { Ground, RegionId, Species } from "./types";

export type SearchHit =
  | {
      kind: "ground";
      id: string;
      label: string;
      detail: string;
      groundId: string;
      region: RegionId;
    }
  | {
      kind: "species";
      id: string;
      label: string;
      detail: string;
      groundId: string;
      region: RegionId;
      speciesName: string;
    }
  | {
      kind: "regs";
      id: string;
      label: string;
      detail: string;
      speciesHint?: string;
    }
  | {
      kind: "season";
      id: string;
      label: string;
      detail: string;
      groundId: string;
      region: RegionId;
      speciesName: string;
    };

const KIND_PREFIX: Record<SearchHit["kind"], string> = {
  ground: "Ground",
  species: "Fish",
  regs: "Regs",
  season: "Season",
};

const MONTH_SHORT = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const REGS_TOPICS: { id: string; title: string; needles: string[]; speciesHint?: string }[] = [
  {
    id: "regs-check",
    title: "Check regs · NC DMF proclamations",
    needles: ["reg", "regs", "legal", "keep", "bag", "size", "limit", "proclamation", "dmf", "closure", "closed"],
  },
  {
    id: "regs-flounder",
    title: "Flounder season / bag",
    needles: ["flounder", "fluke"],
    speciesHint: "Flounder",
  },
  {
    id: "regs-red-drum",
    title: "Red drum / redfish regs",
    needles: ["red drum", "redfish", "drum"],
    speciesHint: "Red drum",
  },
  {
    id: "regs-trout",
    title: "Speckled trout regs",
    needles: ["speckled trout", "speck", "trout", "weakfish"],
    speciesHint: "Speckled trout",
  },
  {
    id: "regs-striped",
    title: "Striped bass regs",
    needles: ["striped bass", "striper", "rockfish"],
    speciesHint: "Striped bass",
  },
  {
    id: "regs-cobia",
    title: "Cobia regs",
    needles: ["cobia"],
    speciesHint: "Cobia",
  },
  {
    id: "regs-shellfish",
    title: "Shellfish closures",
    needles: ["shellfish", "oyster", "clam", "closure", "polluted"],
  },
];

function regionLabel(id: RegionId): string {
  return REGIONS.find((r) => r.id === id)?.label ?? id;
}

export function monthsLabel(months: number[]): string {
  if (!months.length) return "";
  const sorted = [...new Set(months)].filter((m) => m >= 1 && m <= 12).sort((a, b) => a - b);
  if (!sorted.length) return "";
  const parts: string[] = [];
  let start = sorted[0]!;
  let prev = start;
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
      continue;
    }
    parts.push(start === prev ? MONTH_SHORT[start]! : `${MONTH_SHORT[start]}–${MONTH_SHORT[prev]}`);
    if (cur != null) {
      start = cur;
      prev = cur;
    }
  }
  return parts.join(", ");
}

function uniqueSpecies(): { name: string; grounds: Ground[]; sample: Species }[] {
  const map = new Map<string, { name: string; grounds: Ground[]; sample: Species }>();
  for (const ground of GROUNDS) {
    for (const species of ground.species) {
      const key = species.name.toLowerCase();
      const hit = map.get(key);
      if (hit) {
        if (!hit.grounds.includes(ground)) hit.grounds.push(ground);
      } else {
        map.set(key, { name: species.name, grounds: [ground], sample: species });
      }
    }
  }
  return [...map.values()];
}

const SPECIES_INDEX = uniqueSpecies();

function scoreText(hay: string, q: string): number {
  if (!q) return 0;
  if (hay === q) return 100;
  if (hay.startsWith(q)) return 80;
  const idx = hay.indexOf(q);
  if (idx === 0) return 80;
  if (idx > 0) return 50 - Math.min(idx, 20);
  return 0;
}

/** Prefer in-season ground in current region, else any in region, else first ground with species. */
export function bestGroundForSpecies(
  speciesName: string,
  region: RegionId | "all",
  month: number,
): Ground | null {
  const name = speciesName.toLowerCase();
  const withSpecies = GROUNDS.filter((g) => g.species.some((s) => s.name.toLowerCase() === name));
  if (!withSpecies.length) return null;
  const inRegion = region === "all" ? withSpecies : withSpecies.filter((g) => g.region === region);
  const pool = inRegion.length ? inRegion : withSpecies;
  if (month > 0) {
    const seasonal = pool.find((g) => g.species.some((s) => s.name.toLowerCase() === name && s.months.includes(month)));
    if (seasonal) return seasonal;
  }
  return pool[0] ?? null;
}

function speciesNote(speciesName: string, ground: Ground): Species | undefined {
  return ground.species.find((s) => s.name.toLowerCase() === speciesName.toLowerCase());
}

export function formatHitLabel(hit: SearchHit): string {
  return `${KIND_PREFIX[hit.kind]} · ${hit.label}`;
}

/**
 * Mixed search rows for the Fairwater header field.
 * Cap ~10; prefer fish / regs / season when the query looks like a fish or regs word.
 */
export function searchFairwater(
  raw: string,
  opts: { region: RegionId | "all"; month: number; limit?: number } = { region: "all", month: 0 },
): SearchHit[] {
  const q = raw.trim().toLowerCase();
  if (q.length < 1) return [];
  const short = q.length < 2;
  const limit = opts.limit ?? 10;
  const region = opts.region;
  const month = opts.month;

  const scored: { score: number; hit: SearchHit }[] = [];

  // Grounds
  for (const g of GROUNDS) {
    const nameLc = g.name.toLowerCase();
    const hay = `${g.id} ${nameLc} ${g.region} ${g.band} ${g.structure}`.toLowerCase();
    let score = scoreText(nameLc, q) || scoreText(g.id.toLowerCase(), q);
    if (!score && !short && hay.includes(q)) score = 35;
    if (!score) continue;
    if (short && !(nameLc.startsWith(q) || g.id.toLowerCase().startsWith(q))) continue;
    if (region !== "all" && g.region === region) score += 8;
    scored.push({
      score,
      hit: {
        kind: "ground",
        id: `ground:${g.id}`,
        label: g.name,
        detail: `${BAND_LABEL[g.band]} · ${regionLabel(g.region)}`,
        groundId: g.id,
        region: g.region,
      },
    });
  }

  // Species-first rows
  for (const entry of SPECIES_INDEX) {
    const nameLc = entry.name.toLowerCase();
    let score = scoreText(nameLc, q);
    if (!score) {
      if (!short && nameLc.includes(q) && q.length >= 2) score = 45;
      else continue;
    }
    if (short && !nameLc.startsWith(q)) continue;
    const ground = bestGroundForSpecies(entry.name, region, month);
    if (!ground) continue;
    const sp = speciesNote(entry.name, ground) ?? entry.sample;
    const season = monthsLabel(sp.months);
    const nearby = entry.grounds
      .filter((g) => region === "all" || g.region === region)
      .slice(0, 2)
      .map((g) => g.name);
    const where = nearby.length ? nearby.join(", ") : ground.name;
    const inNow = month > 0 && sp.months.includes(month);
    scored.push({
      score: score + (inNow ? 6 : 0) + (region !== "all" && ground.region === region ? 4 : 0),
      hit: {
        kind: "species",
        id: `species:${nameLc}`,
        label: entry.name,
        detail: `${where}${season ? ` · ${season}` : ""}${inNow ? " · in season" : ""}`,
        groundId: ground.id,
        region: ground.region,
        speciesName: entry.name,
      },
    });

    // Seasonal / historical movement from note + months (same species)
    const note = sp.note.toLowerCase();
    const seasonQuery =
      /season|migrat|movement|histor|when|run|spring|summer|fall|autumn|winter|month/.test(q) ||
      note.includes(q) ||
      score >= 50;
    if (seasonQuery || score >= 70) {
      const seasonScore = scoreText(nameLc, q) || (note.includes(q) ? 40 : 0);
      if (seasonScore || /season|migrat|movement|histor|when/.test(q)) {
        scored.push({
          score: (seasonScore || score) - 5 + (/season|migrat|movement|histor/.test(q) ? 12 : 0),
          hit: {
            kind: "season",
            id: `season:${nameLc}:${ground.id}`,
            label: `${entry.name} movement`,
            detail: `${sp.note}${season ? ` · ${season}` : ""}`,
            groundId: ground.id,
            region: ground.region,
            speciesName: entry.name,
          },
        });
      }
    }
  }

  // Explicit seasonal query without a fish name: surface a few in-season / noted movements in region
  if (/^(season|migrat|movement|histor|when|run)/.test(q) || q === "seasonal") {
    for (const entry of SPECIES_INDEX) {
      const ground = bestGroundForSpecies(entry.name, region, month);
      if (!ground) continue;
      const sp = speciesNote(entry.name, ground) ?? entry.sample;
      if (month > 0 && !sp.months.includes(month)) continue;
      scored.push({
        score: 55,
        hit: {
          kind: "season",
          id: `season-browse:${entry.name.toLowerCase()}`,
          label: `${entry.name} movement`,
          detail: `${sp.note} · ${monthsLabel(sp.months)}`,
          groundId: ground.id,
          region: ground.region,
          speciesName: entry.name,
        },
      });
      if (scored.filter((s) => s.hit.kind === "season").length >= 4) break;
    }
  }

  // Regs rows from DMF / closures topics (static needles; UI opens Check regs)
  const regsIntent = /reg|legal|keep|bag|size|limit|proclamation|dmf|closure|closed|shellfish/.test(q);
  for (const topic of REGS_TOPICS) {
    const matched = topic.needles.some((n) => q.includes(n) || n.includes(q));
    if (!matched && !regsIntent) continue;
    if (!matched && topic.id !== "regs-check") continue;
    let score = matched ? 70 : regsIntent ? 40 : 0;
    if (topic.id === "regs-check" && regsIntent) score = Math.max(score, 75);
    if (!score) continue;
    scored.push({
      score,
      hit: {
        kind: "regs",
        id: topic.id,
        label: topic.title,
        detail: "Opens Check regs in Fish mode",
        speciesHint: topic.speciesHint,
      },
    });
  }

  // Deduplicate by id, keep highest score, mix kinds
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: SearchHit[] = [];
  const kindCount: Record<string, number> = { ground: 0, species: 0, regs: 0, season: 0 };
  for (const row of scored) {
    if (seen.has(row.hit.id)) continue;
    // Soft cap per kind so one type doesn't flood
    if ((kindCount[row.hit.kind] ?? 0) >= 4 && out.length >= 4) continue;
    seen.add(row.hit.id);
    kindCount[row.hit.kind] = (kindCount[row.hit.kind] ?? 0) + 1;
    out.push(row.hit);
    if (out.length >= limit) break;
  }
  return out;
}
