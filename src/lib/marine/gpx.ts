export function toGpx(
  waypoints: { name: string; lat: number; lng: number }[],
  track: { lat: number; lng: number }[],
): string {
  const wpt = waypoints
    .map(
      (mark) =>
        `  <wpt lat="${mark.lat.toFixed(6)}" lon="${mark.lng.toFixed(6)}"><name>${escapeXml(mark.name)}</name></wpt>`,
    )
    .join("\n");
  const pts = track
    .map((point) => `      <trkpt lat="${point.lat.toFixed(6)}" lon="${point.lng.toFixed(6)}"></trkpt>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Fairwater" xmlns="http://www.topografix.com/GPX/1/1">
${wpt}
  <trk>
    <name>Fairwater track</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>
`;
}

export function catchesCsv(
  rows: { species: string; at: string; lat: number; lng: number; tide: string; moon: string }[],
): string {
  const header = "species,at,lat,lng,tide,moon";
  const body = rows.map((row) =>
    [row.species, row.at, row.lat.toFixed(5), row.lng.toFixed(5), row.tide, row.moon].map(csvCell).join(","),
  );
  return [header, ...body].join("\n");
}

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;")
    .replace(/'/g, "&" + "apos;");
}

export function parseGpx(xml: string): {
  waypoints: { name: string; lat: number; lng: number }[];
  track: { lat: number; lng: number }[];
} {
  const waypoints: { name: string; lat: number; lng: number }[] = [];
  const track: { lat: number; lng: number }[] = [];
  for (const block of xml.matchAll(/<wpt\b([^>]*)>([\s\S]*?)<\/wpt>/gi)) {
    const lat = attr(block[1] ?? "", "lat");
    const lon = attr(block[1] ?? "", "lon");
    if (lat == null || lon == null) continue;
    const name = unescapeXml(block[2]?.match(/<name>([^<]*)<\/name>/i)?.[1] ?? "Mark");
    waypoints.push({ name, lat, lng: lon });
  }
  for (const block of xml.matchAll(/<trkpt\b([^>]*)\/?>/gi)) {
    const lat = attr(block[1] ?? "", "lat");
    const lon = attr(block[1] ?? "", "lon");
    if (lat == null || lon == null) continue;
    track.push({ lat, lng: lon });
  }
  return { waypoints, track };
}

function attr(source: string, name: string): number | null {
  const match = source.match(new RegExp(`${name}="([^"]+)"`, "i"));
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function unescapeXml(value: string): string {
  const named = (name: string) => new RegExp("&" + name + ";", "g");
  return value
    .replace(named("apos"), "'")
    .replace(named("quot"), '"')
    .replace(named("gt"), ">")
    .replace(named("lt"), "<")
    .replace(named("amp"), "&");
}

export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
