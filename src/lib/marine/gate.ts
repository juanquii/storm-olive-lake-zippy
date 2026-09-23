export type Gate = "go" | "caution" | "no-go";

export type BoatRules = {
  maxSeasFt: number;
  minPeriodS: number;
  maxWindMph: number;
};

export function nwsWind(forecast: string | null): { mph: number; label: string } | null {
  if (!forecast) return null;
  const range = forecast.match(/winds?\s+(\d+)\s+to\s+(\d+)\s+kt/i);
  if (range) {
    const low = Number(range[1]);
    const high = Number(range[2]);
    return { mph: ((low + high) / 2) * 1.15078, label: `NWS ${low}–${high} kt` };
  }
  const one = forecast.match(/winds?\s+(\d+)\s+kt/i);
  if (!one) return null;
  const kt = Number(one[1]);
  return { mph: kt * 1.15078, label: `NWS ${kt} kt` };
}

export function inletGate(opts: {
  seasFt: number | null;
  periodS: number | null;
  windMph: number | null;
  stage: "flood" | "ebb" | "slack" | null;
  currentKt: number | null;
  forecast: string | null;
  rules: BoatRules;
  inletName: string;
  nwsZone: string;
}): { gate: Gate; reasons: string[] } {
  const reasons: string[] = [];
  let gate: Gate = "go";
  const bump = (next: Gate) => {
    if (next === "no-go" || gate === "go") gate = next;
  };
  const forecast = opts.forecast?.toUpperCase() ?? "";
  if (/STORM WARNING|HURRICANE|TROPICAL STORM/.test(forecast)) {
    bump("no-go");
    reasons.push("NWS has a storm warning on this coastal zone.");
  } else if (/GALE WARNING/.test(forecast)) {
    bump("no-go");
    reasons.push(
      opts.nwsZone === "AMZ158"
        ? "NWS gale warning on Cape Lookout to Surf City."
        : `NWS gale warning on ${opts.nwsZone}.`,
    );
  } else if (/SMALL CRAFT ADVISORY/.test(forecast)) {
    bump("caution");
    reasons.push("Small craft advisory is up.");
  }

  if (opts.seasFt == null || opts.windMph == null) {
    bump("caution");
    reasons.push("A buoy or wind feed is missing, so this is not a green light.");
  }
  if (opts.seasFt != null && opts.seasFt > opts.rules.maxSeasFt) {
    bump("no-go");
    reasons.push(`Seas ${opts.seasFt.toFixed(1)} ft are over your ${opts.rules.maxSeasFt} ft limit.`);
  } else if (
    opts.seasFt != null &&
    opts.periodS != null &&
    opts.seasFt >= Math.max(2, opts.rules.maxSeasFt - 1) &&
    opts.periodS < opts.rules.minPeriodS
  ) {
    bump("no-go");
    reasons.push(`${opts.seasFt.toFixed(1)} ft at ${Math.round(opts.periodS)} sec is too short a period for this boat.`);
  } else if (opts.seasFt != null && opts.seasFt > opts.rules.maxSeasFt - 0.7) {
    bump("caution");
    reasons.push(`Seas are close to your ${opts.rules.maxSeasFt} ft limit.`);
  }
  if (opts.windMph != null && opts.windMph > opts.rules.maxWindMph) {
    bump("no-go");
    reasons.push(`Wind ${Math.round(opts.windMph)} mph is over your ${opts.rules.maxWindMph} mph limit.`);
  }
  if (opts.stage === "ebb" && (opts.currentKt ?? 0) >= 1 && (opts.seasFt ?? 0) >= opts.rules.maxSeasFt - 0.5) {
    bump("no-go");
    reasons.push(`Ebb against the sea at ${opts.inletName}. That is the rough one.`);
  }
  if (gate === "go") reasons.push("Under the limits you set for this boat.");
  return { gate, reasons: reasons.slice(0, 4) };
}
