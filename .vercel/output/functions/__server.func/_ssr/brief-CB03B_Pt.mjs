import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as nwsOffice } from "./inlets-CRIPgh8K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brief-CB03B_Pt.js
var UA = "Fairwater/1.0 (NC fishing chart)";
var DMF = "https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/fisheries-management-proclamations";
var PA = "https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/polluted-area-proclamations";
var cache = /* @__PURE__ */ new Map();
var getBrief_createServerFn_handler = createServerRpc({
	id: "1926244775a0cd63a3841cbe0b3ede874970fb1fddf6ea935c4765cbb9de610c",
	name: "getBrief",
	filename: "src/lib/marine/brief.ts"
}, (opts) => getBrief.__executeServer(opts));
var getBrief = createServerFn({ method: "GET" }).validator((input) => {
	const zone = input?.zone ?? "AMZ158";
	if (!/^AMZ\d{3}$/.test(zone)) throw new Error("Unknown marine zone.");
	return { zone };
}).handler(getBrief_createServerFn_handler, async ({ data }) => {
	const hit = cache.get(data.zone);
	if (hit && Date.now() - hit.at < 6e5) return hit.brief;
	const errors = [];
	const [forecast, proclamations, closures] = await Promise.all([
		coastalForecast(data.zone).catch(() => {
			errors.push("NWS coastal forecast didn't answer.");
			return {
				issued: null,
				forecast: null
			};
		}),
		loadProclamations().catch(() => {
			errors.push("NC DMF proclamations page didn't parse.");
			return [];
		}),
		loadClosures().catch(() => {
			errors.push("Shellfish closure page didn't parse.");
			return [];
		})
	]);
	const brief = {
		zoneId: data.zone,
		issued: forecast.issued,
		forecast: forecast.forecast,
		proclamations,
		closures,
		errors
	};
	cache.set(data.zone, {
		at: Date.now(),
		brief
	});
	return brief;
});
async function coastalForecast(zone) {
	const list = await nws(`https://api.weather.gov/products?type=CWF&location=${nwsOffice(zone)}`);
	const graph = list && typeof list === "object" ? list["@graph"] : null;
	const first = Array.isArray(graph) ? graph[0] : null;
	if (!first || typeof first !== "object") return {
		issued: null,
		forecast: null
	};
	const id = first.id;
	const issued = first.issuanceTime;
	if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return {
		issued: null,
		forecast: null
	};
	const product = await nws(`https://api.weather.gov/products/${id}`);
	const text = product && typeof product === "object" ? product.productText : null;
	if (typeof text !== "string") return {
		issued: null,
		forecast: null
	};
	return {
		issued: typeof issued === "string" ? issued : null,
		forecast: sliceZone(text, zone)
	};
}
async function nws(url) {
	const res = await fetch(url, {
		headers: {
			"User-Agent": UA,
			Accept: "application/geo+json"
		},
		signal: AbortSignal.timeout(15e3)
	});
	if (!res.ok) throw new Error("nws");
	return res.json();
}
function sliceZone(text, zone) {
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
async function loadProclamations() {
	const html = await page(DMF);
	const out = [];
	for (const match of html.matchAll(/<h5 class="field-content">([^<]+)<\/h5>[\s\S]*?<a href="(https:\/\/files\.nc\.gov\/[^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<time datetime="([^"]+)"[^>]*>([^<]*)<\/time>[\s\S]*?Effective Date:[\s\S]*?<p><strong>([^<]*)<\/strong>/g)) {
		const id = match[3].trim();
		if (!/^(FF|M|SH|CR)-/i.test(id)) continue;
		out.push({
			id,
			title: clean(match[1]),
			href: match[2].split("?")[0],
			issued: match[5].trim() || match[4],
			effective: clean(match[6])
		});
	}
	const rec = out.filter((item) => /recreational|flounder|drum|trout|cobia|mackerel|snapper|grouper/i.test(item.title));
	const rest = out.filter((item) => !rec.includes(item));
	return [...rec, ...rest].slice(0, 6);
}
async function loadClosures() {
	const html = await page(PA);
	const out = [];
	for (const match of html.matchAll(/<h3><a href="(https:\/\/files\.nc\.gov\/[^"]+)">([^<]+)<\/a><\/h3><p>([^<]+)<\/p><p><strong>Effective Date: <\/strong>([^<]+)<\/p><p><strong>Issued Date:<\/strong>\s*([^<]+)<\/p><p><strong>Counties Affected:<\/strong>\s*([^<]+)<\/p>/g)) {
		const counties = clean(match[6]);
		if (!/carteret|onslow/i.test(counties)) continue;
		out.push({
			id: clean(match[2]),
			href: match[1].split("?")[0],
			summary: clean(match[3]),
			effective: clean(match[4]),
			counties
		});
		if (out.length === 3) break;
	}
	return out;
}
async function page(url) {
	const res = await fetch(url, {
		headers: { "User-Agent": UA },
		signal: AbortSignal.timeout(15e3)
	});
	if (!res.ok) throw new Error("page");
	return res.text();
}
function clean(value) {
	return value.replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}
//#endregion
export { getBrief_createServerFn_handler };
