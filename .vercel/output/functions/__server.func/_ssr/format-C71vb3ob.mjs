//#region node_modules/.nitro/vite/services/ssr/assets/format-C71vb3ob.js
function miles(aLat, aLng, bLat, bLng) {
	const R = 3958.8;
	const r = (d) => d * Math.PI / 180;
	const dLat = r(bLat - aLat);
	const dLng = r(bLng - aLng);
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
/** Degrees true, from the first point toward the second. */
function bearing(aLat, aLng, bLat, bLng) {
	const r = (d) => d * Math.PI / 180;
	const y = Math.sin(r(bLng - aLng)) * Math.cos(r(bLat));
	const x = Math.cos(r(aLat)) * Math.sin(r(bLat)) - Math.sin(r(aLat)) * Math.cos(r(bLat)) * Math.cos(r(bLng - aLng));
	return Math.atan2(y, x) * 180 / Math.PI;
}
function nearest(lat, lng, items) {
	let best = null;
	let dist = Infinity;
	for (const item of items) {
		const d = miles(lat, lng, item.lat, item.lng);
		if (d < dist) {
			dist = d;
			best = item;
		}
	}
	return best ? {
		item: best,
		distanceMi: dist
	} : null;
}
var DIRS = [
	"N",
	"NNE",
	"NE",
	"ENE",
	"E",
	"ESE",
	"SE",
	"SSE",
	"S",
	"SSW",
	"SW",
	"WSW",
	"W",
	"WNW",
	"NW",
	"NNW"
];
function compass(deg) {
	if (deg == null || Number.isNaN(deg)) return "—";
	return DIRS[Math.round(rev(deg) / 22.5) % 16] ?? "—";
}
function rev(deg) {
	return (deg % 360 + 360) % 360;
}
function feet(n, digits = 1) {
	if (n == null || Number.isNaN(n)) return "—";
	return `${n.toFixed(digits)} ft`;
}
function knots(n) {
	if (n == null || Number.isNaN(n)) return "—";
	return `${n.toFixed(1)} kt`;
}
function mph(n) {
	if (n == null || Number.isNaN(n)) return "—";
	return `${Math.round(n)} mph`;
}
function clock(date) {
	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit"
	});
}
function weekday(date) {
	return date.toLocaleDateString([], { weekday: "short" });
}
function sky(code) {
	if (code == null) return "—";
	if (code === 0) return "Clear";
	if (code <= 2) return "Fair";
	if (code === 3) return "Overcast";
	if (code <= 49) return "Fog";
	if (code <= 59) return "Drizzle";
	if (code <= 69) return "Rain";
	if (code <= 79) return "Snow";
	if (code <= 82) return "Showers";
	return "Storms";
}
function mToFt(m) {
	if (m == null || Number.isNaN(m)) return null;
	return m * 3.28084;
}
function kmhToKt(kmh) {
	if (kmh == null || Number.isNaN(kmh)) return null;
	return kmh / 1.852;
}
function cToF(c) {
	if (c == null || Number.isNaN(c)) return null;
	return c * 9 / 5 + 32;
}
//#endregion
export { feet as a, mToFt as c, nearest as d, sky as f, compass as i, miles as l, cToF as n, kmhToKt as o, weekday as p, clock as r, knots as s, bearing as t, mph as u };
