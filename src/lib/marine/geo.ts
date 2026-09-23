export function miles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 3958.8;
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat);
  const dLng = r(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Degrees true, from the first point toward the second. */
export function bearing(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const y = Math.sin(r(bLng - aLng)) * Math.cos(r(bLat));
  const x =
    Math.cos(r(aLat)) * Math.sin(r(bLat)) -
    Math.sin(r(aLat)) * Math.cos(r(bLat)) * Math.cos(r(bLng - aLng));
  return (Math.atan2(y, x) * 180) / Math.PI;
}

export function nearest<T extends { lat: number; lng: number }>(
  lat: number,
  lng: number,
  items: T[],
): { item: T; distanceMi: number } | null {
  let best: T | null = null;
  let dist = Infinity;
  for (const item of items) {
    const d = miles(lat, lng, item.lat, item.lng);
    if (d < dist) {
      dist = d;
      best = item;
    }
  }
  return best ? { item: best, distanceMi: dist } : null;
}
