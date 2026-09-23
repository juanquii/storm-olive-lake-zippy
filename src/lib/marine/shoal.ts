export function shoalAdvisory(opts: {
  draftFt: number;
  marginFt: number;
  depthFtMllw: number | null;
  tideFtMllw: number | null;
}): { level: "ok" | "thin" | "risk" | "unknown"; reason: string } {
  if (opts.depthFtMllw == null || opts.tideFtMllw == null) {
    return {
      level: "unknown",
      reason: "Enter the chart sounding and wait for the NOAA tide. No depth is invented here.",
    };
  }
  const water = opts.depthFtMllw + opts.tideFtMllw;
  const need = opts.draftFt + opts.marginFt;
  if (water >= need + 0.5) {
    return {
      level: "ok",
      reason: `About ${water.toFixed(1)} ft of water over a ${opts.depthFtMllw.toFixed(1)} ft sounding. You asked for ${need.toFixed(1)} ft.`,
    };
  }
  if (water >= need) {
    return {
      level: "thin",
      reason: `About ${water.toFixed(1)} ft of water. That is inside half a foot of draft plus margin.`,
    };
  }
  return {
    level: "risk",
    reason: `About ${water.toFixed(1)} ft of water. That is less than draft ${opts.draftFt.toFixed(2)} ft plus ${opts.marginFt.toFixed(1)} ft margin.`,
  };
}
