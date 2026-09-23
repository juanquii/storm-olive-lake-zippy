export type InletId = "beaufort" | "bogue" | "masonboro" | "cape-fear" | "lockwoods-folly" | "little-river";

export type Inlet = {
  id: InletId;
  name: string;
  barName: string;
  lat: number;
  lng: number;
  stationId: string;
  stationName: string;
  /** NWS coastal zone sliced out of the office CWF. */
  nwsZoneHint: string;
  notes: string;
  groundId: string;
};

export type MarinaId = "70-west" | "coral-bay" | "sloop-point" | "homer-smith";

export type Marina = {
  id: MarinaId;
  name: string;
  lat: number;
  lng: number;
  defaultInletId: InletId;
};

/** Harmonic CO-OPS ids only. Subordinate stations are not used for the tide request. */
export const INLETS: Inlet[] = [
  {
    id: "beaufort",
    name: "Beaufort / Fort Macon",
    barName: "Beaufort Inlet",
    lat: 34.68,
    lng: -76.66,
    stationId: "8656483",
    stationName: "Beaufort, Duke Marine Lab",
    nwsZoneHint: "AMZ158",
    notes: "Ebb against swell is the rough one",
    groundId: "beaufort-inlet",
  },
  {
    id: "bogue",
    name: "Bogue Inlet",
    barName: "Bogue Inlet",
    lat: 34.65,
    lng: -77.1,
    stationId: "8656613",
    stationName: "Swansboro, nearest harmonic to Bogue Inlet",
    nwsZoneHint: "AMZ158",
    notes: "Shifting bar — local knowledge",
    groundId: "bogue",
  },
  {
    id: "masonboro",
    name: "Masonboro Inlet",
    barName: "Masonboro Inlet",
    lat: 34.18,
    lng: -77.81,
    stationId: "8658163",
    stationName: "Wrightsville Beach",
    nwsZoneHint: "AMZ250",
    notes: "Traffic + swell on ebb",
    groundId: "wrightsville",
  },
  {
    id: "cape-fear",
    name: "Cape Fear approaches",
    barName: "Cape Fear",
    lat: 33.89,
    lng: -78.01,
    stationId: "8659084",
    stationName: "Southport, nearest harmonic to the Cape Fear bar",
    nwsZoneHint: "AMZ252",
    notes: "Shipping + shoals",
    groundId: "cape-fear-approaches",
  },
  {
    id: "lockwoods-folly",
    name: "Lockwoods Folly",
    barName: "Lockwoods Folly Inlet",
    lat: 33.92,
    lng: -78.23,
    stationId: "8659182",
    stationName: "Oak Island, nearest harmonic to Lockwoods Folly",
    nwsZoneHint: "AMZ252",
    notes: "Thin water inside",
    groundId: "lockwoods-folly",
  },
  {
    id: "little-river",
    name: "Little River / Myrtle approaches",
    barName: "Little River Inlet",
    lat: 33.85,
    lng: -78.55,
    stationId: "8659897",
    stationName: "Sunset Beach Pier, nearest harmonic to Little River",
    nwsZoneHint: "AMZ254",
    notes: "ICW traffic",
    groundId: "little-river-inlet",
  },
];

export const MARINAS: Marina[] = [
  { id: "70-west", name: "70 West Marina", lat: 34.72, lng: -76.708, defaultInletId: "beaufort" },
  { id: "coral-bay", name: "Coral Bay Marina", lat: 34.7, lng: -76.767, defaultInletId: "beaufort" },
  { id: "sloop-point", name: "Sloop Point Marina", lat: 34.4, lng: -77.6, defaultInletId: "masonboro" },
  { id: "homer-smith", name: "Homer Smith Docks & Marina", lat: 34.7224, lng: -76.6650, defaultInletId: "beaufort" },
];

export function inletById(id: InletId): Inlet {
  return INLETS.find((inlet) => inlet.id === id) ?? INLETS[0]!;
}

export function marinaById(id: MarinaId | null): Marina | null {
  if (!id) return null;
  return MARINAS.find((marina) => marina.id === id) ?? null;
}

export function nwsOffice(zone: string): "MHX" | "ILM" {
  return zone.startsWith("AMZ1") ? "MHX" : "ILM";
}
