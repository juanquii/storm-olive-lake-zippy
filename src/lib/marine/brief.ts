import { createServerFn } from "@tanstack/react-start";
import { nwsOffice } from "./inlets";

export type Proclamation = {
  id: string;
  title: string;
  href: string;
  issued: string;
  effective: string;
};

export type Closure = {
  id: string;
  summary: string;
  href: string;
  effective: string;
  counties: string;
};

export type MarineBrief = {
  zoneId: string;
  issued: string | null;
  forecast: string | null;
  proclamations: Proclamation[];
  closures: Closure[];
  errors: string[];
};

const UA = "NecuzeOn/1.0 (NC boat fishing)";
const DMF =
  "https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/fisheries-management-proclamations";
const PA =
  "https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/polluted-area-proclamations";

let cache = new Map<string, { at: number; brief: MarineBrief }>();

export const getBrief = createServerFn({ method: "GET" })
  .validator((input: { zone?: string; inletId?: string } | undefined) => {
    const zone = input?.zone ?? "AMZ158";
    const inletId = input?.inletId ?? "beaufort";
    if (!/^AMZ\d{3}$/.test(zone)) throw new Error("Unknown marine zone.");
    if (!/^[a-z0-9-]{2,40}$/.test(inletId)) throw new Error("Unknown inlet.");
    return { zone, inletId };
  })
  .handler(async ({ data }): Promise<MarineBrief> => {
    const key = `${data.zone}:${data.inletId}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < 10 * 60 * 1000) return hit.brief;
    const errors: string[] = [];
    const [forecast, proclamations, closures] = await Promise.all([
      coastalForecast(data.zone).catch(() => {
        errors.push("NWS coastal forecast didn't answer.");
        return { issued: null, forecast: null };
      }),
      loadProclamations().catch(() => {
        errors.push("NC DMF proclamations page didn't parse.");
        return [];
      }),
      loadClosures(data.inletId).catch(() => {
        errors.push("Shellfish closure page didn't parse.");
        return [];
      }),
    ]);
    const brief: MarineBrief = {
      zoneId: data.zone,
      issued: forecast.issued,
      forecast: forecast.forecast,
      proclamations,
      closures,
      errors,
    };
    cache.set(key, { at: Date.now(), brief });
    return brief;
  });

async function coastalForecast(zone: string): Promise<{ issued: string | null; forecast: string | null }> {
  const list = await nws(`https://api.weather.gov/products?type=CWF&location=${nwsOffice(zone)}`);
  const graph = list && typeof list === "object" ? (list as { "@graph"?: unknown })["@graph"] : null;
  const first = Array.isArray(graph) ? graph[0] : null;
  if (!first || typeof first !== "object") return { issued: null, forecast: null };
  const id = (first as { id?: unknown }).id;
  const issued = (first as { issuanceTime?: unknown }).issuanceTime;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return { issued: null, forecast: null };
  const product = await nws(`https://api.weather.gov/products/${id}`);
  const text = product && typeof product === "object" ? (product as { productText?: unknown }).productText : null;
  if (typeof text !== "string") return { issued: null, forecast: null };
  return {
    issued: typeof issued === "string" ? issued : null,
    forecast: sliceZone(text, zone),
  };
}

async function nws(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/geo+json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error("nws");
  return res.json();
}

function sliceZone(text: string, zone: string): string | null {
  const start = text.indexOf(`${zone}-`);
  if (start < 0) return null;
  const rest = text.slice(start);
  const next = rest.slice(zone.length).search(/\nAMZ\d{3}-/);
  const dollar = rest.indexOf("\n$$");
  let end = rest.length;
  if (next >= 0) end = Math.min(end, next + zone.length);
  if (dollar > 0) end = Math.min(end, dollar);
  return rest.slice(0, end).trim();
}

async function loadProclamations(): Promise<Proclamation[]> {
  const html = await page(DMF);
  const out: Proclamation[] = [];
  const re =
    /<h5 class="field-content">([^<]+)<\/h5>[\s\S]*?<a href="(https:\/\/files\.nc\.gov\/[^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<time datetime="([^"]+)"[^>]*>([^<]*)<\/time>[\s\S]*?Effective Date:[\s\S]*?<p><strong>([^<]*)<\/strong>/g;
  for (const match of html.matchAll(re)) {
    const id = match[3].trim();
    if (!/^(FF|M|SH|CR)-/i.test(id)) continue;
    out.push({
      id,
      title: clean(match[1]),
      href: match[2].split("?")[0],
      issued: match[5].trim() || match[4],
      effective: clean(match[6]),
    });
  }
  const rec = out.filter((item) => /recreational|flounder|drum|trout|cobia|mackerel|snapper|grouper/i.test(item.title));
  const rest = out.filter((item) => !rec.includes(item));
  return [...rec, ...rest].slice(0, 6);
}

async function loadClosures(inletId: string): Promise<Closure[]> {
  const html = await page(PA);
  const out: Closure[] = [];
  const countiesOk = countyPattern(inletId);
  const re =
    /<h3><a href="(https:\/\/files\.nc\.gov\/[^"]+)">([^<]+)<\/a><\/h3><p>([^<]+)<\/p><p><strong>Effective Date: <\/strong>([^<]+)<\/p><p><strong>Issued Date:<\/strong>\s*([^<]+)<\/p><p><strong>Counties Affected:<\/strong>\s*([^<]+)<\/p>/g;
  for (const match of html.matchAll(re)) {
    const counties = clean(match[6]);
    if (!countiesOk.test(counties)) continue;
    out.push({
      id: clean(match[2]),
      href: match[1].split("?")[0],
      summary: clean(match[3]),
      effective: clean(match[4]),
      counties,
    });
    if (out.length === 3) break;
  }
  return out;
}

async function page(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error("page");
  return res.text();
}

function countyPattern(inletId: string): RegExp {
  if (inletId === "masonboro") return /new hanover|onslow/i;
  if (inletId === "cape-fear" || inletId === "lockwoods-folly") return /brunswick|new hanover/i;
  if (inletId === "little-river") return /horry|brunswick/i;
  return /carteret|onslow/i;
}

function clean(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
