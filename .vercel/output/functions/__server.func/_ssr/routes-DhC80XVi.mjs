import { i as __toESM } from "../_runtime.mjs";
import { i as require_react, n as QueryClientProvider, r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as marinaById, n as MARINAS, r as inletById, t as INLETS } from "./inlets-CRIPgh8K.mjs";
import { a as feet, d as nearest, f as sky, i as compass, l as miles, p as weekday, r as clock$1, s as knots, t as bearing, u as mph } from "./format-C71vb3ob.mjs";
import { a as Search, i as Star, o as Moon, r as Sun, s as LocateFixed, t as X } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as ReferenceLine, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhC80XVi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REGIONS = [
	{
		id: "outer-banks",
		label: "North Carolina"
	},
	{
		id: "chesapeake",
		label: "Chesapeake"
	},
	{
		id: "southeast",
		label: "Southeast"
	},
	{
		id: "florida",
		label: "Florida"
	},
	{
		id: "gulf",
		label: "Gulf"
	},
	{
		id: "northeast",
		label: "Northeast"
	},
	{
		id: "pacific",
		label: "Pacific"
	}
];
function blob(lat, lng, rLat, rLng) {
	const pts = [];
	for (let i = 0; i < 6; i++) {
		const a = Math.PI / 3 * i - Math.PI / 6;
		const j = .86 + i * 3 % 4 * .05;
		pts.push([Math.round((lat + Math.sin(a) * rLat * j) * 1e3) / 1e3, Math.round((lng + Math.cos(a) * rLng * j) * 1e3) / 1e3]);
	}
	return pts;
}
function sp(name, months, note) {
	return {
		name,
		months,
		note
	};
}
function ground(id, name, region, band, exposure, lat, lng, rLat, rLng, depth, structure, tactic, species) {
	return {
		id,
		name,
		region,
		band,
		exposure,
		lat,
		lng,
		ring: blob(lat, lng, rLat, rLng),
		depth,
		structure,
		tactic,
		species
	};
}
var GROUNDS = [
	ground("cbbt", "Chesapeake Bay Bridge-Tunnel", "chesapeake", "nearshore", "coastal", 36.98, -76.1, .12, .09, "20–55 ft", "Pilings, rock islands, tube", "Fish the upcurrent side of the islands. Live bait or bucktails when the tide is moving; slack is a coffee break.", [
		sp("Striped bass", [
			3,
			4,
			5,
			10,
			11,
			12
		], "Spring trophies and the fall run on eels and plugs."),
		sp("Cobia", [
			5,
			6,
			7,
			8,
			9
		], "Sight-fish buoys and the islands on calm days."),
		sp("Sheepshead", [
			4,
			5,
			6,
			7,
			8,
			9,
			10
		], "Fiddler crabs tight to the concrete."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Drifting minnows along the tube."),
		sp("Spadefish", [
			6,
			7,
			8,
			9
		], "Chum the islands and drop clam."),
		sp("Red drum", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Bulls on the shoals in spring and fall."),
		sp("Tautog", [
			11,
			12,
			1,
			2,
			3,
			4
		], "Green crab on the rock when the bass are gone.")
	]),
	ground("lynnhaven", "Lynnhaven & Rudee", "chesapeake", "inshore", "protected", 36.89, -76.05, .07, .08, "4–18 ft", "Inlet, docks, grass edges", "Work the last of the incoming into the grass, then the first of the outgoing at the inlet mouth.", [
		sp("Speckled trout", [
			4,
			5,
			6,
			9,
			10,
			11
		], "Soft plastics on grass points at dawn."),
		sp("Red drum", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Puppy drum on finger mullet and gold spoons."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Mud minnows along the channel edge."),
		sp("Bluefish", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Small metals when birds are working."),
		sp("Striped bass", [
			3,
			4,
			11,
			12
		], "Schoolies in the fall inside Rudee.")
	]),
	ground("hampton", "Hampton Roads", "chesapeake", "inshore", "protected", 36.98, -76.33, .08, .1, "12–40 ft", "Bridge pilings, channel edges", "The HRBT and Monitor-Merrimac pilings fish like a smaller CBBT. Stay out of the ship channel.", [
		sp("Sheepshead", [
			4,
			5,
			6,
			7,
			8,
			9,
			10
		], "Crabs on the downcurrent pilings."),
		sp("Striped bass", [
			3,
			4,
			5,
			10,
			11,
			12
		], "Night eels in spring, plugs in the fall."),
		sp("Croaker", [
			5,
			6,
			7,
			8,
			9
		], "Bottom rigs with bloodworm or fish bites."),
		sp("Spot", [
			6,
			7,
			8,
			9
		], "Easy bottom bite for a mixed cooler."),
		sp("Speckled trout", [
			4,
			5,
			9,
			10,
			11
		], "Around lights and creek mouths.")
	]),
	ground("york", "York River mouth", "chesapeake", "inshore", "protected", 37.22, -76.45, .08, .1, "8–30 ft", "Drop-offs, oyster bars", "Drift the channel bends. The river fishes best on a moving tide and a light northwest or southwest breeze.", [
		sp("Striped bass", [
			3,
			4,
			5,
			10,
			11
		], "Spring run staging, fall schoolies."),
		sp("Speckled trout", [
			4,
			5,
			9,
			10,
			11
		], "Grass and oyster at the mouth."),
		sp("Red drum", [
			5,
			6,
			8,
			9,
			10
		], "Puppy drum on the flats off the mouth."),
		sp("Croaker", [
			5,
			6,
			7,
			8
		], "Bottom in the channel."),
		sp("Flounder", [
			5,
			6,
			7,
			8
		], "Along the deeper edge.")
	]),
	ground("cape-henry", "Cape Henry shoals", "chesapeake", "nearshore", "coastal", 36.93, -75.95, .07, .08, "15–40 ft", "Shoals, tide rips", "The rip on a falling tide stacks bait. Don't anchor in the channel; drift or spot-lock the edge.", [
		sp("Red drum", [
			4,
			5,
			6,
			9,
			10
		], "Bull reds on the shoal in spring."),
		sp("Cobia", [
			5,
			6,
			7,
			8
		], "Sight-casting when the water is green-clear."),
		sp("Bluefish", [
			4,
			5,
			6,
			9,
			10
		], "Metals through the bait balls."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Fast retrieve just under the surface."),
		sp("Striped bass", [
			4,
			5,
			11
		], "When the ocean run is on.")
	]),
	ground("ches-light", "Chesapeake Light", "chesapeake", "nearshore", "open", 36.91, -75.71, .08, .1, "40–70 ft", "Tower, wrecks, hard bottom", "About 14 miles out. Fish the tower shadow and nearby wrecks. Leave a weather window to get home.", [
		sp("Cobia", [
			5,
			6,
			7,
			8,
			9
		], "Sight-fish the buoy line on the way out."),
		sp("Spadefish", [
			6,
			7,
			8,
			9
		], "Chum the tower legs."),
		sp("Amberjack", [
			6,
			7,
			8,
			9
		], "Live bait on the wrecks. Check size rules."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Drifting the hard bottom around the tower."),
		sp("King mackerel", [
			7,
			8,
			9
		], "Slow-troll live bait when the water warms.")
	]),
	ground("tangier", "Tangier Sound", "chesapeake", "inshore", "protected", 37.85, -75.98, .12, .12, "6–20 ft", "Grass, islands, guts", "A small-boat sound. Poling and trolling motors beat a big wake. Watch the skinny water east of the islands.", [
		sp("Speckled trout", [
			4,
			5,
			6,
			9,
			10,
			11
		], "The classic fall sound bite."),
		sp("Red drum", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Puppy drum on the grass edges."),
		sp("Striped bass", [
			4,
			5,
			10,
			11
		], "Schoolies around the islands."),
		sp("Flounder", [
			5,
			6,
			7,
			8
		], "Channel edges of the sound.")
	]),
	ground("lookout", "Point Lookout", "chesapeake", "inshore", "protected", 38.04, -76.32, .07, .08, "8–35 ft", "Point rip, bridge, channel", "The Potomac dumps into the Bay here. Fish the rip on the outgoing and the bridge pilings at night in season.", [
		sp("Striped bass", [
			3,
			4,
			5,
			10,
			11,
			12
		], "One of the Bay's better spring and fall points."),
		sp("Speckled trout", [
			5,
			6,
			9,
			10
		], "Inside the point on smaller tides."),
		sp("Bluefish", [
			5,
			6,
			9,
			10
		], "With the bass in the fall."),
		sp("Croaker", [
			6,
			7,
			8
		], "Daytime bottom bite.")
	]),
	ground("norfolk-canyon", "Norfolk Canyon", "chesapeake", "offshore", "open", 37.03, -74.62, .16, .2, "100–1000 ftm", "Canyon wall, tile bottom", "A real offshore run from Rudee or the Bay. Pick a calm window. Tilefish on the bottom, pelagics on the wall and temperature breaks.", [
		sp("Yellowfin tuna", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Troll and chunk the edge when the Gulf Stream bends in."),
		sp("Mahi", [
			6,
			7,
			8,
			9
		], "Weedlines and anything floating."),
		sp("White marlin", [
			7,
			8,
			9
		], "Spread of dredges and naked ballyhoo."),
		sp("Blueline tilefish", [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12
		], "Deep drop. Know the bag limit."),
		sp("Bluefin tuna", [
			12,
			1,
			2,
			3
		], "Winter fish when the water is cold and the forecast is kind."),
		sp("Wahoo", [
			8,
			9,
			10
		], "High-speed along the break.")
	]),
	ground("washington-canyon", "Washington Canyon", "chesapeake", "offshore", "open", 37.42, -74.48, .14, .18, "80–800 ftm", "Canyon mouth, lobes", "Often the closer canyon if you leave from Ocean City or Chincoteague. Same rules: weather first, then the temperature break.", [
		sp("Yellowfin tuna", [
			6,
			7,
			8,
			9,
			10
		], "Chunking after a midday troll."),
		sp("Mahi", [
			6,
			7,
			8,
			9
		], "Any board or crate on the way."),
		sp("White marlin", [
			7,
			8,
			9
		], "The late-summer canyon bite."),
		sp("Swordfish", [
			6,
			7,
			8,
			9
		], "Night deep-drop. Not a first offshore trip."),
		sp("Tilefish", [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12
		], "Daytime bottom on the slope.")
	]),
	ground("oregon", "Oregon Inlet", "outer-banks", "inshore", "coastal", 35.77, -75.53, .07, .08, "8–30 ft", "Inlet, bridge, shoals", "The inlet moves. Use the markers, not memory. Bridge pilings and the inlet shoulders on a moving tide.", [
		sp("Red drum", [
			4,
			5,
			6,
			9,
			10,
			11
		], "Spring bulls on the shoals, puppies inside."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Sound side of the bridge."),
		sp("Striped bass", [
			11,
			12,
			1,
			2,
			3
		], "Winter ocean-side when it's calm enough."),
		sp("Bluefish", [
			4,
			5,
			10,
			11
		], "With the fall bait."),
		sp("Flounder", [
			5,
			6,
			7,
			8
		], "Drifting the inlet channel.")
	]),
	ground("hatteras-inlet", "Hatteras Inlet", "outer-banks", "inshore", "coastal", 35.2, -75.76, .06, .07, "6–25 ft", "Inlet sloughs", "A short, serious inlet. Fish the sloughs on the last of the incoming. If the swell is up, stay in the sound.", [
		sp("Red drum", [
			4,
			5,
			10,
			11
		], "Sight-fishing the sloughs in clear water."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Sound-side grass when the ocean is ugly."),
		sp("Bluefish", [
			4,
			5,
			10
		], "Choppers in the fall."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Along the beach when it's calm.")
	]),
	ground("diamond", "Diamond Shoals", "outer-banks", "nearshore", "open", 35.15, -75.4, .1, .14, "30–90 ft", "Shoal, rips, wrecks", "The bend in the Banks. Rips, bait, and everything that eats it. Give the breakers a wide berth.", [
		sp("Red drum", [
			4,
			5,
			10,
			11
		], "Big fish on the shoal edges."),
		sp("Cobia", [
			5,
			6,
			7
		], "Buoys and rays on the way to the stream."),
		sp("King mackerel", [
			5,
			6,
			9,
			10
		], "Slow-troll the color change."),
		sp("Spanish mackerel", [
			6,
			7,
			8
		], "Fast troll in the green water."),
		sp("Amberjack", [
			5,
			6,
			7,
			8
		], "Nearby wrecks.")
	]),
	ground("hatteras-canyon", "Hatteras Canyon", "outer-banks", "offshore", "open", 35.35, -74.85, .16, .22, "100–1000 ftm", "Canyon, Gulf Stream edge", "The stream is close here, which is why Hatteras is Hatteras. A short bad forecast gets worse fast.", [
		sp("Yellowfin tuna", [
			4,
			5,
			6,
			7,
			8,
			9,
			10
		], "A long season when the stream is on the shelf."),
		sp("Blue marlin", [
			6,
			7,
			8
		], "Summer troll. Heavy tackle."),
		sp("White marlin", [
			7,
			8,
			9
		], "With the yellowfin spread."),
		sp("Mahi", [
			5,
			6,
			7,
			8,
			9
		], "Weedlines between the inlet and the canyon."),
		sp("Wahoo", [
			8,
			9,
			10
		], "First light, high speed."),
		sp("Blackfin tuna", [
			5,
			6,
			7,
			8,
			9
		], "Smaller feathers in the spread.")
	]),
	ground("duck", "Duck & Kitty Hawk", "outer-banks", "nearshore", "coastal", 36.17, -75.75, .08, .07, "8–40 ft", "Piers, beach, nearshore", "Pier and beach water on the northern Banks. Fall is drum, blues, and albacore. If the surf is ugly, drop back into the sound.", [
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Fall bulls in the trough and along the pier."),
		sp("Bluefish", [
			4,
			5,
			9,
			10,
			11
		], "Choppers with the mullet run."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Fast metals just off the beach."),
		sp("False albacore", [
			9,
			10,
			11
		], "Tiny metals when they crash bait."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Sound side, not in the surf."),
		sp("King mackerel", [9, 10], "A short run off the beach in the fall.")
	]),
	ground("roanoke", "Roanoke Sound", "outer-banks", "inshore", "protected", 35.91, -75.67, .08, .09, "4–15 ft", "Sound grass, bridge", "Behind Nags Head and Manteo. Small-boat water. The ocean swell does not belong in this read.", [
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Grass points at dawn on a moving tide."),
		sp("Red drum", [
			5,
			6,
			9,
			10,
			11
		], "Puppy drum on the flats."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Channel edges and the bridge."),
		sp("Striped bass", [
			12,
			1,
			2,
			3
		], "Winter, when they push into the sound.")
	]),
	ground("pamlico", "Pamlico Sound", "outer-banks", "inshore", "protected", 35.45, -76.05, .16, .18, "6–20 ft", "Grass, shoals, guts", "The big sound behind the Banks. Wind chop matters more than ocean swell. A north or southwest breeze lays one side down.", [
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "The fall sound bite is the reason people come."),
		sp("Red drum", [
			5,
			6,
			9,
			10,
			11
		], "Puppies on the grass, a few bulls on the shoals."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Drift the deeper edges."),
		sp("Striped bass", [
			11,
			12,
			1,
			2,
			3
		], "Winter fish in the western sound."),
		sp("Bluefish", [
			5,
			6,
			9,
			10
		], "With the bait schools.")
	]),
	ground("ocracoke", "Ocracoke Inlet", "outer-banks", "inshore", "coastal", 35.07, -76, .05, .06, "8–30 ft", "Inlet, sloughs", "A shifting inlet between the sound and the ocean. Fish the sloughs on the last of the flood. Stay in the sound if the swell is up.", [
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Sight-fish clear sloughs."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Sound side of the inlet."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "The channel on a drift."),
		sp("Bluefish", [9, 10], "Fall bait."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Ocean side on a calm day.")
	]),
	ground("core-sound", "Core Sound", "outer-banks", "inshore", "protected", 34.82, -76.35, .1, .1, "3–12 ft", "Grass, shell, creeks", "Down East water between the Banks and the mainland. Skinny, and it fishes best on a moving tide with a light breeze.", [
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "A classic fall trout sound."),
		sp("Red drum", [
			5,
			6,
			9,
			10,
			11
		], "Puppies along the grass."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Creek mouths."),
		sp("Sheepshead", [
			4,
			5,
			6,
			10,
			11
		], "Docks and shell with fiddlers.")
	]),
	ground("cape-lookout", "Cape Lookout shoals", "outer-banks", "nearshore", "coastal", 34.58, -76.52, .08, .09, "10–40 ft", "Shoals, cape, rips", "The cape bends the tide and stacks bait. Give the breakers room. Drum in the surf line, kings and cobia just outside.", [
		sp("Red drum", [
			4,
			5,
			10,
			11
		], "Big fish on the shoals in spring and fall."),
		sp("Cobia", [
			5,
			6,
			7
		], "Buoys and rays on the way out."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Green water along the beach."),
		sp("King mackerel", [
			5,
			6,
			9,
			10
		], "Slow-troll the color change."),
		sp("False albacore", [9, 10], "Fall, on small metals.")
	]),
	ground("beaufort-inlet", "Beaufort Inlet", "outer-banks", "inshore", "coastal", 34.69, -76.67, .05, .06, "10–40 ft", "Inlet, port, jetties", "The Crystal Coast front door. Sheepshead and flounder on the rocks, drum and spanish on the shoulders. Watch the shipping channel.", [
		sp("Sheepshead", [
			4,
			5,
			6,
			10,
			11
		], "Fiddlers tight to the rocks."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Drift the inlet with a minnow."),
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Slot fish and a few bulls."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Along the beachfront."),
		sp("Cobia", [5, 6], "Sight-fishing on the way to the cape."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Inside the inlet when the ocean is rough.")
	]),
	ground("bogue", "Bogue Sound & Inlet", "outer-banks", "inshore", "coastal", 34.66, -77.02, .06, .1, "4–20 ft", "Sound, inlet, surf", "Emerald Isle and the sound behind it. The inlet is the ocean door. The sound is the bad-weather plan.", [
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Sound grass and docks."),
		sp("Red drum", [
			5,
			6,
			9,
			10,
			11
		], "Inlet shoulders and the surf."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Inlet drift."),
		sp("Sheepshead", [
			4,
			5,
			10,
			11
		], "Docks and the jetty rock."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Just off the beach.")
	]),
	ground("big-rock", "Big Rock", "outer-banks", "offshore", "open", 34.22, -76.2, .12, .16, "100–600 ftm", "Ledge, Gulf Stream edge", "The Morehead fleet's blue water, out past the 90 and toward the stream. Leave a weather window. This is not a pin to run to.", [
		sp("Yellowfin tuna", [
			4,
			5,
			6,
			7,
			8,
			9,
			10
		], "Troll at dawn, chunk if they stay."),
		sp("Blue marlin", [
			6,
			7,
			8
		], "The June tournament is famous. The fish are here in summer."),
		sp("White marlin", [
			7,
			8,
			9
		], "In the spread with the tuna."),
		sp("Mahi", [
			5,
			6,
			7,
			8,
			9
		], "Weedlines on the way out."),
		sp("Wahoo", [
			8,
			9,
			10
		], "High-speed at first light."),
		sp("Blackfin tuna", [
			5,
			6,
			7,
			8,
			9
		], "Small feathers.")
	]),
	ground("new-river", "New River Inlet", "outer-banks", "inshore", "coastal", 34.55, -77.34, .05, .06, "6–25 ft", "Inlet, surf, nearshore", "Topsail and the inlet. Fish the inlet and the beach. The upper river is a military range — stay in the public inlet and surf.", [
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Surf and inlet in the fall."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Inside on a northeast blow."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Inlet channel."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Along the beach."),
		sp("Bluefish", [9, 10], "With the mullet.")
	]),
	ground("wrightsville", "Wrightsville & Masonboro", "outer-banks", "inshore", "coastal", 34.19, -77.79, .06, .07, "6–30 ft", "Inlets, piers, beach", "Two inlets and a pier. Kings show up just off the beach in the fall. Masonboro is the small-boat inlet — respect the ebb.", [
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Inlet and surf."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "The creeks behind the beach."),
		sp("King mackerel", [9, 10], "Slow-troll live bait just offshore."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Beach pods."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Both inlets."),
		sp("Sheepshead", [
			4,
			5,
			10,
			11
		], "The pier pilings and rocks.")
	]),
	ground("cape-fear", "Cape Fear & Bald Head", "outer-banks", "nearshore", "coastal", 33.85, -77.97, .07, .08, "10–50 ft", "Cape, river mouth, shoals", "The river meets the ocean at Bald Head and Oak Island. Shoals move. Use the markers. Drum and kings use the same tide rip.", [
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Shoals and the beach in spring and fall."),
		sp("King mackerel", [
			5,
			6,
			9,
			10
		], "The nearshore color change."),
		sp("Cobia", [5, 6], "Buoys in late spring."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Along the beach."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "The river mouth."),
		sp("Sheepshead", [
			4,
			5,
			10,
			11
		], "Jetties and dock pilings."),
		sp("Striped bass", [
			12,
			1,
			2,
			3
		], "Winter, up the river, not on the shoals.")
	]),
	ground("frying-pan", "Frying Pan Tower", "outer-banks", "nearshore", "open", 33.49, -77.59, .08, .1, "40–70 ft", "Tower, live bottom", "About 30 miles off Cape Fear. A short offshore run, not a canyon. Kings live here in season. Leave time to get home.", [
		sp("King mackerel", [
			5,
			6,
			9,
			10
		], "Live bait around the tower."),
		sp("Cobia", [5, 6], "Sight-fish the legs and nearby buoys."),
		sp("Amberjack", [
			5,
			6,
			7,
			8,
			9
		], "On the structure. Check the size rule."),
		sp("Mahi", [
			6,
			7,
			8
		], "Weed on the ride out."),
		sp("Black sea bass", [
			1,
			2,
			3,
			4,
			5,
			10,
			11,
			12
		], "Bottom around the tower."),
		sp("Grouper", [
			5,
			6,
			7,
			8
		], "Only if the season is open.")
	]),
	ground("charleston-jetty", "Charleston jetties", "southeast", "inshore", "coastal", 32.73, -79.85, .06, .08, "10–35 ft", "Jetties, harbor mouth", "The jetties fish like a reef that reaches the beach. Live shrimp and fiddlers. Watch the ship traffic.", [
		sp("Sheepshead", [
			3,
			4,
			5,
			10,
			11
		], "Fiddlers in the rocks."),
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Slot reds along the rocks."),
		sp("Black drum", [
			3,
			4,
			5
		], "Spring, on crab."),
		sp("Flounder", [
			4,
			5,
			6,
			9,
			10
		], "Mud minnows at the base."),
		sp("Trout", [
			4,
			5,
			10,
			11
		], "Harbor creeks when the ocean is rough.")
	]),
	ground("georgetown", "Georgetown reef", "southeast", "nearshore", "coastal", 33.15, -78.95, .1, .12, "40–90 ft", "Live bottom, ledges", "A nearshore reef run. Bottom fish the ledges, troll the top for kings when the water is blue-green.", [
		sp("Black sea bass", [
			1,
			2,
			3,
			4,
			5,
			10,
			11,
			12
		], "The dependable bottom fish."),
		sp("Vermilion snapper", [
			5,
			6,
			7,
			8,
			9
		], "Small baits on the ledges."),
		sp("King mackerel", [
			4,
			5,
			6,
			9,
			10
		], "Slow-troll the color."),
		sp("Cobia", [
			4,
			5,
			6
		], "Buoys on the way out."),
		sp("Grouper", [
			5,
			6,
			7,
			8
		], "Know the season before you drop.")
	]),
	ground("charleston-ledge", "Charleston Hole & ledge", "southeast", "offshore", "open", 32.4, -78.7, .16, .22, "150–400 ft", "Ledge, Gulf Stream water", "The ledge is the southeast's easy offshore. Bottom fish it, or troll the edge when the stream pushes in.", [
		sp("Wahoo", [
			4,
			5,
			6,
			9,
			10
		], "High-speed at dawn."),
		sp("Mahi", [
			5,
			6,
			7,
			8
		], "Weed and rips."),
		sp("Yellowfin tuna", [
			4,
			5,
			6
		], "Blackfins more often than yellowfin; both show up."),
		sp("Blackfin tuna", [
			4,
			5,
			6,
			7
		], "Small feathers."),
		sp("Grouper", [
			4,
			5,
			6,
			7,
			8
		], "Bottom. Seasons open and close — check them.")
	]),
	ground("sebastian", "Sebastian Inlet", "florida", "inshore", "coastal", 27.86, -80.45, .05, .06, "6–20 ft", "Inlet, jetties, beach trough", "A small inlet with a big reputation. Snook and reds at the jetties; pompano in the trough when the surf is moderate.", [
		sp("Snook", [
			3,
			4,
			5,
			6,
			9,
			10,
			11
		], "Jetties at night on the moving tide. Handle them wet."),
		sp("Red drum", [
			1,
			2,
			3,
			4,
			9,
			10,
			11,
			12
		], "Year-round, best on the tide swing."),
		sp("Pompano", [
			2,
			3,
			4,
			10,
			11
		], "Surf, small jigs in the trough."),
		sp("Spanish mackerel", [
			11,
			12,
			1,
			2,
			3
		], "Winter beach run."),
		sp("Tarpon", [
			5,
			6,
			7
		], "Migrating fish along the beach. Mostly release.")
	]),
	ground("jupiter", "Jupiter reef", "florida", "nearshore", "coastal", 26.94, -80.02, .08, .1, "60–120 ft", "Reef line, wrecks", "The reef is close. Drift the ledges for kings and sails in season; bottom fish when the current allows.", [
		sp("Sailfish", [
			11,
			12,
			1,
			2,
			3
		], "The winter kite and live-bait fishery."),
		sp("King mackerel", [
			11,
			12,
			1,
			2,
			3,
			4
		], "Slow-troll the reef edge."),
		sp("Mahi", [
			4,
			5,
			6
		], "Spring weed."),
		sp("Cobia", [
			3,
			4,
			5
		], "Rays and buoys."),
		sp("Mutton snapper", [
			5,
			6,
			7,
			8
		], "The reef. Check Atlantic snapper rules.")
	]),
	ground("islamorada", "Islamorada flats", "florida", "inshore", "protected", 24.92, -80.64, .08, .1, "1–8 ft", "Flats, channels, bridges", "Push-pole water. Tarpon in the channels in spring, bones and permit on the flats. Don't run the flats at speed.", [
		sp("Tarpon", [
			3,
			4,
			5,
			6,
			7
		], "Channels and bridges. Release fishery."),
		sp("Bonefish", [
			1,
			2,
			3,
			4,
			5,
			10,
			11,
			12
		], "Flood tide on the oceanside flats."),
		sp("Permit", [
			3,
			4,
			5,
			6,
			7
		], "Wrecks and flat edges. A hard fish. Worth it."),
		sp("Snook", [
			1,
			2,
			3,
			4,
			10,
			11,
			12
		], "Bridge shadows at night."),
		sp("Redfish", [
			1,
			2,
			3,
			4,
			9,
			10,
			11,
			12
		], "Backcountry shorelines.")
	]),
	ground("miami-blue", "Miami blue water", "florida", "offshore", "open", 25.7, -79.85, .16, .22, "400–1200 ft", "Stream edge, weedlines", "The Gulf Stream is in sight of the skyline. Sailfish in winter, dolphin in spring and summer. Afternoon storms build fast.", [
		sp("Sailfish", [
			11,
			12,
			1,
			2,
			3
		], "Live ballyhoo and kites."),
		sp("Mahi", [
			4,
			5,
			6,
			7,
			8
		], "Weedlines. The dependable offshore meal."),
		sp("Blackfin tuna", [
			1,
			2,
			3,
			4,
			11,
			12
		], "Low light on the color change."),
		sp("Swordfish", [
			4,
			5,
			6,
			7
		], "Daytime deep. Specialized."),
		sp("Wahoo", [
			11,
			12,
			1,
			2
		], "Winter high-speed.")
	]),
	ground("boca-grande", "Boca Grande Pass", "florida", "inshore", "coastal", 26.71, -82.26, .06, .07, "30–70 ft", "Pass, deep hole", "The tarpon pass. Crowded in May and June — be polite and don't anchor in the traffic. The rest of the year is snook, reds, and grouper nearby.", [
		sp("Tarpon", [
			4,
			5,
			6,
			7
		], "The pass migration. Mostly release. Know the gear rules."),
		sp("Snook", [
			3,
			4,
			5,
			9,
			10,
			11
		], "Beach and docks around the pass."),
		sp("Redfish", [
			1,
			2,
			3,
			9,
			10,
			11,
			12
		], "Back bays off the pass."),
		sp("Gag grouper", [
			6,
			7,
			8,
			9
		], "Nearby wrecks when the season is open."),
		sp("Spanish mackerel", [
			3,
			4,
			10,
			11
		], "Beach pods.")
	]),
	ground("orange-beach", "Orange Beach nearshore", "gulf", "nearshore", "coastal", 30.22, -87.55, .08, .12, "40–90 ft", "Reefs, gas platforms in sight", "Short run to reefs and small platforms. Live bait under a float for kings; bottom rigs for snapper when open.", [
		sp("Red snapper", [
			5,
			6,
			7,
			8
		], "Federal and state seasons differ. Check before you go."),
		sp("King mackerel", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Float a menhaden."),
		sp("Cobia", [
			3,
			4,
			5
		], "Sight-fish the buoys in spring."),
		sp("Mangrove snapper", [
			5,
			6,
			7,
			8,
			9
		], "Small hooks, small baits."),
		sp("Triggerfish", [
			5,
			6,
			7,
			8
		], "On the reefs with the snapper.")
	]),
	ground("venice", "Venice lumps", "gulf", "offshore", "open", 28.6, -89.4, .18, .22, "200–600 ft", "Lumps, rigs, river plume", "The Mississippi plume sets up a tuna bite that can be world-class and can also be mud. Watch the river height and the thunderstorms.", [
		sp("Yellowfin tuna", [
			4,
			5,
			6,
			7,
			8
		], "Chunk the lumps at dawn."),
		sp("Mahi", [
			5,
			6,
			7,
			8
		], "Rigs and weed on the way."),
		sp("Blue marlin", [
			6,
			7,
			8
		], "Summer, when the water is blue outside the river."),
		sp("Wahoo", [
			5,
			6,
			9
		], "Around the rip."),
		sp("Swordfish", [
			6,
			7,
			8
		], "Night or deep daytime.")
	]),
	ground("galveston", "Galveston jetties", "gulf", "inshore", "coastal", 29.33, -94.73, .06, .08, "8–30 ft", "Jetties, beach gut", "The north and south jetties. Sheepshead in the rocks, trout in the guts, bulls in the fall surf when the bait is there.", [
		sp("Sheepshead", [
			2,
			3,
			4,
			11,
			12
		], "Shrimp and fiddlers in the rocks."),
		sp("Speckled trout", [
			3,
			4,
			5,
			9,
			10,
			11
		], "Wading the guts on a light wind."),
		sp("Red drum", [
			9,
			10,
			11
		], "Bulls in the surf in fall."),
		sp("Spanish mackerel", [
			5,
			6,
			7
		], "Along the beach."),
		sp("Flounder", [10, 11], "Fall migration at the jetty mouth.")
	]),
	ground("flower-gardens", "Flower Garden Banks", "gulf", "offshore", "open", 27.9, -93.82, .14, .18, "60–400 ft", "Sanctuary banks", "A national marine sanctuary about 100 miles off Texas. Fishing is allowed with strict gear and anchoring rules. Read them before you leave the dock.", [
		sp("Red snapper", [
			6,
			7,
			8
		], "Only in the open season, and not on the coral."),
		sp("Wahoo", [
			5,
			6,
			7,
			8
		], "Troll the edge of the bank."),
		sp("Mahi", [
			5,
			6,
			7
		], "Weed on the ride."),
		sp("Blackfin tuna", [
			5,
			6,
			7
		], "Around the rigs between here and the beach."),
		sp("Grouper", [
			6,
			7,
			8
		], "Season and sanctuary rules both apply.")
	]),
	ground("barnegat", "Barnegat Inlet", "northeast", "inshore", "coastal", 39.76, -74.1, .05, .06, "8–25 ft", "Inlet, south jetty", "A rough little inlet when the ebb meets an east swell. Fish the bay side if the ocean is white. South jetty for tog and bass in season.", [
		sp("Striped bass", [
			4,
			5,
			6,
			10,
			11
		], "Jetty plugs at dawn, eels at night."),
		sp("Fluke", [
			5,
			6,
			7,
			8,
			9
		], "Drift the inlet and the bay flats."),
		sp("Bluefish", [
			5,
			6,
			9,
			10
		], "With the bass."),
		sp("Tautog", [
			10,
			11,
			12,
			4
		], "Green crab in the rocks."),
		sp("Weakfish", [
			5,
			6,
			9
		], "Bay side when they show.")
	]),
	ground("montauk", "Montauk Point", "northeast", "nearshore", "coastal", 41.07, -71.86, .07, .09, "20–70 ft", "Rips, point, wrecks", "The rips off the point are the whole fishery. Bass and blues on the surface, fluke on the drifts behind the point. Give the rocks room.", [
		sp("Striped bass", [
			5,
			6,
			7,
			9,
			10,
			11
		], "The fall run is the famous one. Dawn eels and plugs."),
		sp("Bluefish", [
			6,
			7,
			9,
			10
		], "Gators in the rip. Wire leaders."),
		sp("Fluke", [
			6,
			7,
			8,
			9
		], "Drift the backside."),
		sp("False albacore", [9, 10], "Tiny metals when they crash bait."),
		sp("Black sea bass", [
			6,
			7,
			8,
			9,
			10
		], "Wrecks in between.")
	]),
	ground("hudson", "Hudson Canyon", "northeast", "offshore", "open", 39.55, -72.35, .18, .24, "100–1000 ftm", "Canyon walls", "The northeast's home canyon. Long ride from Jersey or Long Island. Tilefish on the bottom year-round, tuna when the temp break sets up.", [
		sp("Yellowfin tuna", [
			6,
			7,
			8,
			9
		], "Chunk and troll the mouth."),
		sp("Bigeye tuna", [
			8,
			9,
			10
		], "Night chunking. A specialist trip."),
		sp("Mahi", [7, 8], "Weed on the way out."),
		sp("White marlin", [
			7,
			8,
			9
		], "Late summer."),
		sp("Tilefish", [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12
		], "Golden tiles on the mud. Deep and specific."),
		sp("Bluefin tuna", [9, 10], "Some years, on the inshore lumps before the canyon.")
	]),
	ground("cape-cod-bay", "Cape Cod Bay", "northeast", "inshore", "protected", 41.85, -70.35, .14, .16, "20–120 ft", "Bay, rips, beaches", "Protected from a southwest wind, exposed to a northeast. Stripers on the beaches in June, flounder early, tuna in the deep bay some summers.", [
		sp("Striped bass", [
			5,
			6,
			7,
			9,
			10
		], "Beach and estuary fish."),
		sp("Bluefish", [
			6,
			7,
			8,
			9
		], "With the bass."),
		sp("Flounder", [
			4,
			5,
			6
		], "Early season in the harbors."),
		sp("Bluefin tuna", [
			7,
			8,
			9
		], "Some years in the deep bay. A different boat than the bass skiff."),
		sp("Bonito", [8, 9], "Small metals.")
	]),
	ground("la-jolla", "La Jolla kelp", "pacific", "nearshore", "coastal", 32.85, -117.28, .05, .06, "20–80 ft", "Kelp, canyon head", "Kelp bass, calico, and yellowtail when the water is warm. The canyon head is why pelagics come this close. Watch the divers.", [
		sp("Yellowtail", [
			5,
			6,
			7,
			8,
			9
		], "Live sardine or iron when birds are up."),
		sp("Kelp bass", [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12
		], "The everyday fish. Check the size."),
		sp("Calico bass", [
			4,
			5,
			6,
			7,
			8,
			9
		], "Same fishery, warmer months."),
		sp("White seabass", [
			4,
			5,
			6
		], "Squid at night in spring."),
		sp("Dorado", [8, 9], "Warm-water years, outside the kelp.")
	]),
	ground("catalina", "Catalina & 14 Mile", "pacific", "offshore", "open", 33.35, -118.45, .12, .16, "80–600 ft", "Island, bank", "A crossing, not a bay trip. Yellowtail and yellowfin in warm years on the bank; island kelp on the lee side if the channel is up.", [
		sp("Yellowtail", [
			5,
			6,
			7,
			8,
			9,
			10
		], "The reason the boats run."),
		sp("Yellowfin tuna", [
			8,
			9,
			10
		], "Warm-water summers on the 14."),
		sp("Bluefin tuna", [
			6,
			7,
			8
		], "Some years, and they can be anywhere."),
		sp("Dorado", [8, 9], "Kelp paddies."),
		sp("White seabass", [
			4,
			5,
			6
		], "Island at night.")
	]),
	ground("monterey", "Monterey Canyon", "pacific", "offshore", "open", 36.72, -122.05, .12, .14, "50–1000 ftm", "Canyon wall, kelp edge", "The canyon starts inside the bay, which is why salmon, rockfish, and sometimes albacore are a short run. Afternoons get windy. Leave early.", [
		sp("Rockfish", [
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11
		], "The reliable bottom bite. Depth rules change — check them."),
		sp("Chinook salmon", [
			5,
			6,
			7,
			8
		], "When the season is open. Troll the color."),
		sp("Lingcod", [
			4,
			5,
			10,
			11
		], "With the rockfish, bigger iron."),
		sp("Albacore", [8, 9], "Warm years, outside."),
		sp("Halibut", [
			5,
			6,
			7
		], "Sand inside the bay.")
	]),
	ground("grays", "Grays Harbor", "pacific", "nearshore", "coastal", 46.9, -124.18, .08, .1, "20–80 ft", "Bar, nearshore, jetties", "The bar is the hazard. Cross only on a fair tide and a modest swell, or fish the jetties and the harbor. Salmon and lingcod outside when it's civil.", [
		sp("Chinook salmon", [
			6,
			7,
			8,
			9
		], "Buoy 2 and the nearshore, in season."),
		sp("Coho salmon", [
			7,
			8,
			9
		], "Just outside, when they're in."),
		sp("Lingcod", [
			4,
			5,
			6,
			7
		], "Reefs on a calm day."),
		sp("Black rockfish", [
			4,
			5,
			6,
			7,
			8,
			9
		], "The everyday nearshore fish."),
		sp("Dungeness crab", [
			12,
			1,
			2,
			3
		], "Pots, in the winter season. Not a rod fishery.")
	]),
	ground("radio-island", "Radio Island", "outer-banks", "inshore", "protected", 34.721, -76.685, .02, .02, "6–20 ft", "Spoil bank, creek mouth", "A short idle from Morehead. Trout and drum on the bank when the ocean is too rough to run the inlet. Confirm the channel with the chart, not this pin.", [
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Often this time of year inside. Check the proclamation before you keep one."),
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Slot fish on the bank edges."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9,
			10
		], "Along the drop. Season changes by proclamation.")
	]),
	ground("cape-fear-approaches", "Cape Fear approaches", "outer-banks", "nearshore", "open", 33.89, -78.01, .06, .07, "15–40 ft", "Shipping channel, shoals", "The river meets the ocean here. Give the ship channel room and do not treat the pin as the bar. Kings and spanish when the water is clean.", [
		sp("King mackerel", [
			5,
			6,
			9,
			10
		], "Outside the shoals, not in the channel."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Along the beach color."),
		sp("Red drum", [
			4,
			5,
			10,
			11
		], "Shoals on a rising tide, with eyes on the swell.")
	]),
	ground("lockwoods-folly", "Lockwoods Folly Inlet", "outer-banks", "inshore", "coastal", 33.92, -78.23, .03, .04, "4–15 ft", "Shallow inlet, marsh", "Thin water inside. This pin is the approach, not a surveyed path across the bar.", [
		sp("Red drum", [
			4,
			5,
			9,
			10,
			11
		], "Marsh edges when you can float."),
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Creek mouths. Check the proclamation."),
		sp("Speckled trout", [
			4,
			5,
			10,
			11
		], "Inside, not on the ocean bar.")
	]),
	ground("little-river-inlet", "Little River Inlet", "outer-banks", "inshore", "coastal", 33.85, -78.55, .04, .05, "8–25 ft", "Inlet, ICW, jetties", "The NC/SC line is right here. ICW traffic mixes with inlet swell. NC rules on the north side, SC rules on the south.", [
		sp("Flounder", [
			5,
			6,
			7,
			8,
			9
		], "Jetties and the edges. Confirm which state's rules you are under."),
		sp("Sheepshead", [
			4,
			5,
			6,
			10,
			11
		], "Fiddlers on the rocks."),
		sp("Spanish mackerel", [
			6,
			7,
			8,
			9
		], "Just outside on a calm morning.")
	]),
	ground("myrtle-ar", "Myrtle Beach artificial reefs", "outer-banks", "nearshore", "open", 33.68, -78.72, .08, .08, "30–60 ft", "Published reef material", "A planning pin for the Myrtle nearshore reefs, not a surveyed reef coordinate. Use the state's latest reef list before you anchor.", [
		sp("Black sea bass", [
			1,
			2,
			3,
			4,
			5,
			10,
			11,
			12
		], "Bottom on the material. Check the federal or state rule for where you are sitting."),
		sp("King mackerel", [
			5,
			6,
			9,
			10
		], "Troll the reef line, not through traffic."),
		sp("Cobia", [5, 6], "Sight-fish on calm days. Season is a proclamation, not this calendar.")
	])
];
function groundById(id) {
	return GROUNDS.find((g) => g.id === id) ?? GROUNDS[0];
}
function groundsIn(region, band) {
	return GROUNDS.filter((g) => (region === "all" || g.region === region) && (band === "all" || g.band === band));
}
var BAND_LABEL = {
	inshore: "Inshore",
	nearshore: "Nearshore",
	offshore: "Offshore"
};
var BAND_BLURB = {
	inshore: "Bays, inlets, grass, bridges",
	nearshore: "A short run. Reefs, towers, shoals",
	offshore: "Canyons, stream, blue water"
};
/** Sportsman Open 262 · twin ~F200 · ~22" draft · ~150–182 gal usable tank. */
var SPORTSMAN_262 = {
	boatLabel: "Sportsman Open 262",
	draftFt: 1.83,
	cruiseKt: 28,
	burnGph: 15,
	planningBurnGph: 18,
	tankGal: 170,
	reservePct: 25,
	maxSeasFt: 3.5,
	minPeriodS: 6,
	maxWindMph: 18
};
var CHECKLIST_ITEMS = [
	{
		id: "gate",
		label: "Inlet gate reviewed (seas, period, wind, ebb)"
	},
	{
		id: "nws",
		label: "NWS coastal waters (AMZ158) read"
	},
	{
		id: "fuel",
		label: "Fuel topped for 40 nm out / 80 nm RT + reserve"
	},
	{
		id: "float",
		label: "Float plan shared (ETA, crew, VHF)"
	},
	{
		id: "vhf",
		label: "VHF radio check + channels 16/22A"
	},
	{
		id: "safety",
		label: "PFDs, throwables, flares, first aid"
	},
	{
		id: "kill",
		label: "Kill-switch lanyard + engine pre-start"
	},
	{
		id: "phone",
		label: "Phone charged · Fairwater offline tiles saved"
	}
];
function emptyChecklist() {
	return Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.id, false]));
}
/** Replace legacy bay-boat defaults (40 gal / 1.5 ft / 8 gph) with Sportsman 262. */
function migrateBoat(persisted) {
	const state = persisted ?? {};
	const looksLegacy = state.tankGal === 40 || state.draftFt === 1.5 || state.burnGph === 8 || state.burnGph === 24 || state.tankGal == null;
	return {
		...SPORTSMAN_262,
		...state,
		boatLabel: looksLegacy ? SPORTSMAN_262.boatLabel : state.boatLabel ?? SPORTSMAN_262.boatLabel,
		draftFt: looksLegacy ? SPORTSMAN_262.draftFt : state.draftFt ?? SPORTSMAN_262.draftFt,
		cruiseKt: looksLegacy ? SPORTSMAN_262.cruiseKt : state.cruiseKt ?? SPORTSMAN_262.cruiseKt,
		burnGph: looksLegacy ? SPORTSMAN_262.burnGph : state.burnGph ?? SPORTSMAN_262.burnGph,
		planningBurnGph: looksLegacy ? SPORTSMAN_262.planningBurnGph : state.planningBurnGph ?? SPORTSMAN_262.planningBurnGph,
		tankGal: looksLegacy ? SPORTSMAN_262.tankGal : state.tankGal ?? SPORTSMAN_262.tankGal,
		reservePct: looksLegacy ? SPORTSMAN_262.reservePct : state.reservePct ?? SPORTSMAN_262.reservePct,
		maxSeasFt: looksLegacy ? SPORTSMAN_262.maxSeasFt : state.maxSeasFt ?? SPORTSMAN_262.maxSeasFt,
		minPeriodS: state.minPeriodS ?? SPORTSMAN_262.minPeriodS,
		maxWindMph: state.maxWindMph ?? SPORTSMAN_262.maxWindMph,
		waypoints: state.waypoints ?? [],
		track: state.track ?? [],
		recording: false,
		markMode: false,
		catches: state.catches ?? [],
		homeMarinaId: state.homeMarinaId ?? "70-west",
		activeInletId: state.activeInletId ?? "beaufort",
		shoalDepthFt: state.shoalDepthFt ?? null,
		showRings: state.showRings ?? true,
		checklist: {
			...emptyChecklist(),
			...state.checklist ?? {}
		},
		nightHelm: state.nightHelm ?? false
	};
}
function planFuelNm(nmOneWay, cruiseKt, burnGph, tankGal, reservePct) {
	const nm = nmOneWay * 2;
	const hours = nm / Math.max(cruiseKt, 1);
	const gallons = hours * burnGph;
	const usable = tankGal * (1 - reservePct / 100);
	return {
		nm,
		hours,
		gallons,
		usable,
		home: gallons <= usable,
		reserveGal: tankGal - usable
	};
}
function routeFuel(marks, cruiseKt, burnGph, tankGal, reservePct) {
	let statute = 0;
	for (let i = 1; i < marks.length; i++) {
		const prev = marks[i - 1];
		const next = marks[i];
		if (!prev || !next) continue;
		statute += miles(prev.lat, prev.lng, next.lat, next.lng);
	}
	const nm = statute * .868976;
	const first = marks[0];
	const last = marks[marks.length - 1];
	const closed = !!first && !!last && marks.length >= 2 && miles(first.lat, first.lng, last.lat, last.lng) * .868976 <= .05;
	const tripNm = closed ? nm : nm * 2;
	const hours = tripNm / Math.max(cruiseKt, 1);
	const gallons = hours * burnGph;
	return {
		nm: tripNm,
		hours,
		gallons,
		home: gallons <= tankGal * (1 - reservePct / 100),
		closed
	};
}
var useBoat = create()(persist((set) => ({
	...SPORTSMAN_262,
	waypoints: [],
	track: [],
	recording: false,
	markMode: false,
	catches: [],
	homeMarinaId: "70-west",
	activeInletId: "beaufort",
	shoalDepthFt: null,
	showRings: true,
	checklist: emptyChecklist(),
	nightHelm: false,
	setRule: (patch) => set(patch),
	applySportsman262: () => set({ ...SPORTSMAN_262 }),
	setHomeMarina: (homeMarinaId) => set({ homeMarinaId }),
	setActiveInlet: (activeInletId) => set({ activeInletId }),
	setPlanningBurn: (planningBurnGph) => set({ planningBurnGph }),
	setShoalDepth: (shoalDepthFt) => set({ shoalDepthFt }),
	toggleRings: () => set((s) => ({ showRings: !s.showRings })),
	addWaypoint: (lat, lng) => set((s) => ({ waypoints: [...s.waypoints, {
		id: `${Date.now()}`,
		name: `Mark ${s.waypoints.length + 1}`,
		lat,
		lng
	}].slice(-12) })),
	clearWaypoints: () => set({ waypoints: [] }),
	toggleMark: () => set((s) => ({ markMode: !s.markMode })),
	setRecording: (recording) => set({ recording }),
	addTrack: (point) => set((s) => {
		const last = s.track[s.track.length - 1];
		if (last && Math.abs(last.lat - point.lat) < 5e-5 && Math.abs(last.lng - point.lng) < 5e-5) return s;
		return { track: [...s.track, point].slice(-400) };
	}),
	clearTrack: () => set({
		track: [],
		recording: false
	}),
	addCatch: (entry) => set((s) => ({ catches: [{
		...entry,
		id: `${Date.now()}`
	}, ...s.catches].slice(0, 40) })),
	updateCatch: (id, species) => set((s) => ({ catches: s.catches.map((entry) => entry.id === id ? {
		...entry,
		species
	} : entry) })),
	removeCatch: (id) => set((s) => ({ catches: s.catches.filter((entry) => entry.id !== id) })),
	toggleCheck: (id) => set((s) => ({ checklist: {
		...s.checklist,
		[id]: !s.checklist[id]
	} })),
	resetChecklist: () => set({ checklist: emptyChecklist() }),
	setNightHelm: (nightHelm) => set({ nightHelm })
}), {
	name: "fairwater-boat",
	skipHydration: true,
	version: 3,
	migrate: (persisted) => migrateBoat(persisted)
}));
var OCEAN = "https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
var SATELLITE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
var NOAA = "https://gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer";
var STATE_LINE = [
	[36.3, -75.62],
	[36, -75.58],
	[35.55, -75.4],
	[35.22, -75.42],
	[34.95, -75.95],
	[34.7, -76.25],
	[34.55, -76.5],
	[34.48, -76.85],
	[34.38, -77.25],
	[34.22, -77.62],
	[34.05, -77.78],
	[33.85, -77.95]
];
var FILL = {
	inshore: "#1f6f62",
	nearshore: "#1d4e89",
	offshore: "#3d4c7c"
};
function tileBbox(x, y, z) {
	const n = 2 ** z;
	const R = 6378137;
	const corner = (tx, ty) => {
		const lon = tx / n * 360 - 180;
		const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * ty / n))) * 180 / Math.PI;
		return [lon * Math.PI / 180 * R, Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 180 / 2)) * R];
	};
	const [minx, maxy] = corner(x, y);
	const [maxx, miny] = corner(x + 1, y + 1);
	return `${minx},${miny},${maxx},${maxy}`;
}
function wmsUrl(layers, x, y, z) {
	return `${NOAA}?${new URLSearchParams({
		service: "WMS",
		request: "GetMap",
		version: "1.3.0",
		layers,
		styles: "",
		crs: "EPSG:3857",
		bbox: tileBbox(x, y, z),
		width: "256",
		height: "256",
		format: "image/png",
		transparent: "true"
	}).toString()}`;
}
async function cachedBlob(url) {
	try {
		const cache = await caches.open("fairwater-charts");
		const hit = await cache.match(url);
		if (hit) return hit.blob();
		const res = await fetch(url);
		if (!res.ok) return null;
		const body = await res.blob();
		await cache.put(url, new Response(body));
		return body;
	} catch {
		return null;
	}
}
/** Drop the flat depth-area paint and keep the dark soundings and contours. */
function keepSoundings(image) {
	const data = image.data;
	for (let i = 0; i < data.length; i += 4) {
		const r = data[i] ?? 0;
		const g = data[i + 1] ?? 0;
		const b = data[i + 2] ?? 0;
		if ((data[i + 3] ?? 0) < 16) {
			data[i + 3] = 0;
			continue;
		}
		const lum = .3 * r + .59 * g + .11 * b;
		const chroma = Math.max(r, g, b) - Math.min(r, g, b);
		if (lum < 165 || chroma > 40) continue;
		data[i + 3] = 0;
	}
}
function FishingMap({ region, band, selectedId, chartView, helmMode, onSelect }) {
	const host = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const groupRef = (0, import_react.useRef)(null);
	const navRef = (0, import_react.useRef)(null);
	const chartRef = (0, import_react.useRef)(null);
	const baseRef = (0, import_react.useRef)(null);
	const overlayRef = (0, import_react.useRef)(null);
	const viewRef = (0, import_react.useRef)(chartView);
	viewRef.current = chartView;
	const selectRef = (0, import_react.useRef)(onSelect);
	selectRef.current = onSelect;
	const regionRef = (0, import_react.useRef)(region);
	const bandRef = (0, import_react.useRef)(band);
	regionRef.current = region;
	bandRef.current = band;
	const [booted, setBooted] = (0, import_react.useState)(false);
	const [zoom, setZoom] = (0, import_react.useState)(14);
	const [savedTiles, setSavedTiles] = (0, import_react.useState)(0);
	const [saveNote, setSaveNote] = (0, import_react.useState)(null);
	const waypoints = useBoat((s) => s.waypoints);
	const track = useBoat((s) => s.track);
	const markMode = useBoat((s) => s.markMode);
	const activeInletId = useBoat((s) => s.activeInletId);
	const homeMarinaId = useBoat((s) => s.homeMarinaId);
	const showRings = useBoat((s) => s.showRings);
	const cruiseKt = useBoat((s) => s.cruiseKt);
	const burnGph = useBoat((s) => s.burnGph);
	const tankGal = useBoat((s) => s.tankGal);
	const reservePct = useBoat((s) => s.reservePct);
	const addWaypoint = useBoat((s) => s.addWaypoint);
	const markRef = (0, import_react.useRef)(markMode);
	const addRef = (0, import_react.useRef)(addWaypoint);
	markRef.current = markMode;
	addRef.current = addWaypoint;
	(0, import_react.useEffect)(() => {
		if (!host.current) return;
		let alive = true;
		let map = null;
		(async () => {
			const L = (await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default;
			if (!alive || !host.current) return;
			const ground = groundById(selectedId);
			map = L.map(host.current, {
				zoomControl: false,
				attributionControl: true,
				minZoom: 4,
				maxZoom: 18,
				dragging: true,
				touchZoom: true,
				scrollWheelZoom: true
			}).setView([ground.lat, ground.lng], 14);
			L.control.zoom({ position: "topright" }).addTo(map);
			L.control.scale({
				imperial: true,
				metric: false,
				position: "bottomleft"
			}).addTo(map);
			const base = new (L.TileLayer.extend({ createTile(coords, done) {
				const tile = document.createElement("img");
				const url = this.getTileUrl(coords);
				const show = (direct) => {
					tile.onload = () => done(void 0, tile);
					tile.onerror = () => {
						if (direct) {
							done(/* @__PURE__ */ new Error("tile"), tile);
							return;
						}
						show(true);
						tile.src = url;
					};
				};
				(async () => {
					try {
						const blob = await cachedBlob(url);
						if (blob) {
							show(false);
							tile.src = URL.createObjectURL(blob);
						} else {
							show(true);
							tile.src = url;
						}
					} catch {
						show(true);
						tile.src = url;
					}
				})();
				return tile;
			} }))(OCEAN, {
				attribution: "Esri",
				maxZoom: 18,
				maxNativeZoom: 13
			});
			base.addTo(map);
			baseRef.current = base;
			const layer = new (L.TileLayer.WMS.extend({ createTile(coords, done) {
				const tile = document.createElement("img");
				const url = this.getTileUrl(coords);
				const show = (direct) => {
					tile.onload = () => done(void 0, tile);
					tile.onerror = () => {
						if (direct) {
							done(/* @__PURE__ */ new Error("chart"), tile);
							return;
						}
						show(true);
						tile.src = url;
					};
				};
				(async () => {
					try {
						const blob = await cachedBlob(url);
						if (blob) {
							show(false);
							tile.src = URL.createObjectURL(blob);
						} else {
							show(true);
							tile.src = url;
						}
					} catch {
						show(true);
						tile.src = url;
					}
				})();
				return tile;
			} }))(NOAA, {
				layers: "0,1,2,3,4,5,6,7,8,9,10,11,12",
				format: "image/png",
				transparent: false,
				version: "1.3.0",
				attribution: "NOAA Chart Display Service",
				maxZoom: 18
			});
			layer.addTo(map);
			chartRef.current = layer;
			const OverlayLayer = L.GridLayer.extend({ createTile(coords, done) {
				const canvas = document.createElement("canvas");
				canvas.width = 256;
				canvas.height = 256;
				(async () => {
					try {
						const depthBlob = await cachedBlob(wmsUrl("2", coords.x, coords.y, coords.z));
						const markBlob = await cachedBlob(wmsUrl("1,3,4,6,7", coords.x, coords.y, coords.z));
						const ctx = canvas.getContext("2d");
						if (!ctx) throw new Error("canvas");
						if (depthBlob) {
							const depth = await createImageBitmap(depthBlob);
							ctx.drawImage(depth, 0, 0);
							depth.close();
							const pixels = ctx.getImageData(0, 0, 256, 256);
							keepSoundings(pixels);
							ctx.putImageData(pixels, 0, 0);
						}
						if (markBlob) {
							const marks = await createImageBitmap(markBlob);
							ctx.drawImage(marks, 0, 0);
							marks.close();
						}
						done(void 0, canvas);
					} catch (error) {
						done(error instanceof Error ? error : /* @__PURE__ */ new Error("overlay"), canvas);
					}
				})();
				return canvas;
			} });
			overlayRef.current = new OverlayLayer({
				maxZoom: 18,
				attribution: "NOAA"
			});
			groupRef.current = L.layerGroup().addTo(map);
			navRef.current = L.layerGroup().addTo(map);
			map.on("zoomend", () => {
				if (map) setZoom(map.getZoom());
				caches.open("fairwater-charts").then(async (cache) => {
					const keys = await cache.keys();
					if (alive) setSavedTiles(keys.length);
				});
			});
			mapRef.current = map;
			map.invalidateSize();
			window.setTimeout(() => {
				map?.invalidateSize();
				map?.dragging.enable();
				map?.touchZoom.enable();
			}, 300);
			caches.open("fairwater-charts").then(async (cache) => {
				const keys = await cache.keys();
				if (alive) setSavedTiles(keys.length);
			});
			if (alive) setBooted(true);
		})();
		return () => {
			alive = false;
			map?.remove();
			mapRef.current = null;
			groupRef.current = null;
			navRef.current = null;
			chartRef.current = null;
			baseRef.current = null;
			overlayRef.current = null;
			setBooted(false);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!booted) return;
		let cancelled = false;
		(async () => {
			const L = (await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default;
			if (cancelled || !groupRef.current) return;
			groupRef.current.clearLayers();
			for (const ground of groundsIn(region, band)) {
				const selected = ground.id === selectedId;
				const marker = L.circleMarker([ground.lat, ground.lng], {
					radius: selected ? 9 : 6,
					color: "#102028",
					weight: 2,
					fillColor: selected ? "#f4f1e8" : FILL[ground.band],
					fillOpacity: 1
				});
				marker.on("click", (event) => {
					L.DomEvent.stopPropagation(event);
					selectRef.current(ground.id);
				});
				marker.bindTooltip(ground.name, {
					permanent: selected,
					direction: "top",
					offset: [0, -8],
					className: "fw-label"
				});
				groupRef.current.addLayer(marker);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		booted,
		region,
		band,
		selectedId
	]);
	(0, import_react.useEffect)(() => {
		if (!booted || !mapRef.current) return;
		const ground = groundById(selectedId);
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		mapRef.current.flyTo([ground.lat, ground.lng], 14, {
			animate: !motion,
			duration: motion ? 0 : .45
		});
	}, [booted, selectedId]);
	(0, import_react.useEffect)(() => {
		if (!booted || !mapRef.current) return;
		const map = mapRef.current;
		const onClick = (event) => {
			if (!markRef.current) return;
			addRef.current(event.latlng.lat, event.latlng.lng);
		};
		map.on("click", onClick);
		return () => {
			map.off("click", onClick);
		};
	}, [booted]);
	(0, import_react.useEffect)(() => {
		if (!booted || !navRef.current) return;
		let cancelled = false;
		import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then((leaflet) => {
			if (cancelled || !navRef.current) return;
			const L = leaflet.default;
			navRef.current.clearLayers();
			if (region === "outer-banks") L.polyline(STATE_LINE, {
				color: "#8a6844",
				weight: 2,
				dashArray: "6 6"
			}).bindTooltip("Approximate 3 nm state line. Inside is state water, outside is federal. Not a legal boundary.", { sticky: true }).addTo(navRef.current);
			if (track.length > 1) L.polyline(track.map((point) => [point.lat, point.lng]), {
				color: "#d9897b",
				weight: 3
			}).addTo(navRef.current);
			if (waypoints.length > 1) L.polyline(waypoints.map((point) => [point.lat, point.lng]), {
				color: "#102028",
				weight: 2
			}).addTo(navRef.current);
			for (const mark of waypoints) L.circleMarker([mark.lat, mark.lng], {
				radius: 6,
				color: "#102028",
				weight: 2,
				fillColor: "#d4b483",
				fillOpacity: 1
			}).bindTooltip(mark.name, {
				permanent: true,
				direction: "top",
				className: "fw-label"
			}).addTo(navRef.current);
			const inlet = inletById(activeInletId);
			const home = marinaById(homeMarinaId);
			L.circleMarker([inlet.lat, inlet.lng], {
				radius: 8,
				color: "#8a3030",
				weight: 2,
				fillColor: "#d9897b",
				fillOpacity: 1
			}).bindTooltip(inlet.name, {
				permanent: true,
				direction: "right",
				className: "fw-label"
			}).addTo(navRef.current);
			if (home) L.circleMarker([home.lat, home.lng], {
				radius: 8,
				color: "#102028",
				weight: 2,
				fillColor: "#f4f1e8",
				fillOpacity: 1
			}).bindTooltip(home.name, {
				permanent: true,
				direction: "left",
				className: "fw-label"
			}).addTo(navRef.current);
			if (helmMode === "run" && showRings) {
				const origin = home ?? inlet;
				const usableOneWay = planFuelNm(40, cruiseKt, burnGph, tankGal, reservePct).usable / Math.max(burnGph, .1) * cruiseKt / 2;
				const fullOneWay = tankGal / Math.max(burnGph, .1) * cruiseKt / 2;
				const nmToM = 1852;
				L.circle([origin.lat, origin.lng], {
					radius: usableOneWay * nmToM,
					color: "#3d6b4f",
					weight: 2,
					fillOpacity: .04
				}).bindTooltip(`Usable one-way about ${usableOneWay.toFixed(0)} nm, then home`, { sticky: true }).addTo(navRef.current);
				L.circle([origin.lat, origin.lng], {
					radius: 40 * nmToM,
					color: "#8a6844",
					weight: 2,
					fill: false
				}).bindTooltip("40 nm out", { sticky: true }).addTo(navRef.current);
				L.circle([origin.lat, origin.lng], {
					radius: fullOneWay * nmToM,
					color: "#8a3030",
					weight: 1,
					dashArray: "6 6",
					fill: false
				}).bindTooltip("Includes reserve. Dashed on purpose.", { sticky: true }).addTo(navRef.current);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [
		booted,
		region,
		track,
		waypoints,
		activeInletId,
		homeMarinaId,
		showRings,
		helmMode,
		cruiseKt,
		burnGph,
		tankGal,
		reservePct
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		const base = baseRef.current;
		const chart = chartRef.current;
		const overlay = overlayRef.current;
		if (!booted || !map || !base || !chart || !overlay) return;
		const photo = chartView === "satellite" || chartView === "hybrid";
		base.setUrl(photo ? SATELLITE : OCEAN);
		base.options.maxNativeZoom = photo ? 19 : 13;
		base.options.attribution = photo ? "Esri World Imagery" : "Esri Ocean";
		if (chartView === "chart") {
			if (!map.hasLayer(chart)) chart.addTo(map);
			if (map.hasLayer(overlay)) map.removeLayer(overlay);
		} else if (chartView === "satellite") {
			if (map.hasLayer(chart)) map.removeLayer(chart);
			if (map.hasLayer(overlay)) map.removeLayer(overlay);
		} else {
			if (map.hasLayer(chart)) map.removeLayer(chart);
			if (!map.hasLayer(overlay)) overlay.addTo(map);
			overlay.redraw();
		}
		if (groupRef.current) {
			groupRef.current.remove();
			groupRef.current.addTo(map);
		}
		if (navRef.current) {
			navRef.current.remove();
			navRef.current.addTo(map);
		}
		base.redraw();
	}, [booted, chartView]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!booted || !map) return;
		const onResize = () => map.invalidateSize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [booted]);
	async function cacheUrl(url) {
		if (await caches.open("fairwater-charts").then((cache) => cache.match(url))) return;
		const res = await fetch(url);
		if (!res.ok) return;
		await (await caches.open("fairwater-charts")).put(url, new Response(await res.blob()));
	}
	async function saveView() {
		const map = mapRef.current;
		const layer = chartRef.current;
		const base = baseRef.current;
		if (!map || !layer || !base) return;
		const zoom = map.getZoom();
		const view = viewRef.current;
		if (view !== "satellite" && zoom < 12) {
			setSaveNote("Zoom to the inlet first. The whole coast is not stored on the phone.");
			return;
		}
		const zooms = view === "chart" ? [zoom, Math.min(16, zoom + 1)] : [zoom];
		const coords = [];
		for (const z of zooms) {
			const bounds = map.getBounds();
			const nw = map.project(bounds.getNorthWest(), z);
			const se = map.project(bounds.getSouthEast(), z);
			for (let x = Math.floor(nw.x / 256); x <= Math.floor(se.x / 256); x++) for (let y = Math.floor(nw.y / 256); y <= Math.floor(se.y / 256); y++) coords.push({
				x,
				y,
				z
			});
		}
		if (coords.length > (view === "chart" ? 80 : 40)) {
			setSaveNote("That view is too wide. Zoom in, then save it.");
			return;
		}
		setSaveNote("Saving this view…");
		for (const coord of coords) {
			await cacheUrl(base.getTileUrl(coord));
			if (view === "chart") await cacheUrl(layer.getTileUrl(coord));
			if (view === "hybrid" || view === "fishing") {
				await cacheUrl(wmsUrl("2", coord.x, coord.y, coord.z));
				await cacheUrl(wmsUrl("1,3,4,6,7", coord.x, coord.y, coord.z));
			}
		}
		const keys = await caches.open("fairwater-charts").then((cache) => cache.keys());
		setSavedTiles(keys.length);
		setSaveNote(`${keys.length} tiles saved for this view. Water you have not opened is not on the phone.`);
	}
	function showCoast() {
		const map = mapRef.current;
		if (!map) return;
		import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())).then((leaflet) => {
			const L = leaflet.default;
			const visible = groundsIn(regionRef.current, bandRef.current);
			if (!visible.length) return;
			map.fitBounds(L.latLngBounds(visible.map((g) => [g.lat, g.lng])).pad(.35), {
				animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
				padding: [28, 28],
				maxZoom: 9
			});
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full w-full touch-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: host,
				className: "fairwater-map h-full w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-3 left-3 z-[1000] flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: showCoast,
						className: "h-12 rounded-md border border-line bg-surface px-3 text-sm font-medium text-fg",
						children: "Whole coast"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void saveView(),
						className: "h-12 rounded-md border border-line bg-surface px-3 text-sm font-medium text-fg",
						children: "Save view"
					}),
					helmMode === "run" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useBoat.getState().toggleRings(),
						className: "h-12 rounded-md border border-line bg-surface px-3 text-sm font-medium text-fg",
						children: showRings ? "Hide rings" : "Range rings"
					}) : null
				]
			}),
			saveNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute right-3 bottom-7 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted",
				children: saveNote
			}) : savedTiles > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "absolute right-3 bottom-7 z-[1000] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted",
				children: [savedTiles, " chart tiles saved"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute right-3 bottom-7 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted",
				children: "Save tiles for home area"
			}),
			chartView === "satellite" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute bottom-7 left-3 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted",
				children: "Photo only. No depths and no buoys on this view."
			}) : zoom < 12 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute bottom-7 left-3 z-[1000] max-w-[16rem] rounded-md bg-surface/95 px-2 py-1 text-xs text-muted",
				children: "Zoom in for depth numbers and the red and green channel markers."
			}) : null
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ variant = "quiet", size = "md", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-opacity duration-150", "disabled:pointer-events-none disabled:opacity-40", size === "md" ? "h-12 min-w-12 px-3 text-sm" : "h-12 min-w-12 px-3 text-sm", variant === "primary" && "bg-accent text-accent-fg hover:opacity-90", variant === "quiet" && "border border-line bg-surface-2 text-fg hover:bg-surface", variant === "ghost" && "text-fg hover:bg-surface-2", className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getBrief = createServerFn({ method: "GET" }).validator((input) => {
	const zone = input?.zone ?? "AMZ158";
	if (!/^AMZ\d{3}$/.test(zone)) throw new Error("Unknown marine zone.");
	return { zone };
}).handler(createSsrRpc("1926244775a0cd63a3841cbe0b3ede874970fb1fddf6ea935c4765cbb9de610c"));
var getConditions = createServerFn({ method: "GET" }).validator((input) => {
	if (!Number.isFinite(input.lat) || input.lat < -85 || input.lat > 85) throw new Error("Latitude is out of range.");
	if (!Number.isFinite(input.lng) || input.lng < -180 || input.lng > 180) throw new Error("Longitude is out of range.");
	if (!/^\d{7}$/.test(input.stationId)) throw new Error("Unknown tide station.");
	if (!Number.isFinite(input.distanceMi) || input.distanceMi < 0 || input.distanceMi > 5e3) throw new Error("Bad station distance.");
	const stationName = input.stationName.replace(/[^\w\s,.'’\-]/g, "").slice(0, 80);
	return {
		...input,
		stationName
	};
}).handler(createSsrRpc("98a34f61d7d480c5523c5d66733cba4ddaa0ac5927fb723a6f399773779f7aeb"));
function currentAt(bundle, t) {
	if (!bundle || bundle.events.length < 2) return null;
	const events = bundle.events;
	if (t < new Date(events[0].time).getTime()) return null;
	for (let i = 1; i < events.length; i++) {
		const prev = events[i - 1];
		const next = events[i];
		const t0 = new Date(prev.time).getTime();
		const t1 = new Date(next.time).getTime();
		if (t > t1) continue;
		const span = t1 - t0 || 1;
		const u = Math.min(1, Math.max(0, (t - t0) / span));
		const vel = prev.velKt + (next.velKt - prev.velKt) * u;
		const speedKt = Math.abs(vel);
		const stage = speedKt < .2 ? "slack" : vel > 0 ? "flood" : "ebb";
		return {
			speedKt,
			dir: stage === "flood" ? prev.floodDir : stage === "ebb" ? prev.ebbDir : null,
			stage
		};
	}
	return null;
}
function toGpx(waypoints, track) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Fairwater" xmlns="http://www.topografix.com/GPX/1/1">
${waypoints.map((mark) => `  <wpt lat="${mark.lat.toFixed(6)}" lon="${mark.lng.toFixed(6)}"><name>${escapeXml(mark.name)}</name></wpt>`).join("\n")}
  <trk>
    <name>Fairwater track</name>
    <trkseg>
${track.map((point) => `      <trkpt lat="${point.lat.toFixed(6)}" lon="${point.lng.toFixed(6)}"></trkpt>`).join("\n")}
    </trkseg>
  </trk>
</gpx>
`;
}
function catchesCsv(rows) {
	return ["species,at,lat,lng,tide,moon", ...rows.map((row) => [
		row.species,
		row.at,
		row.lat.toFixed(5),
		row.lng.toFixed(5),
		row.tide,
		row.moon
	].map(csvCell).join(","))].join("\n");
}
function csvCell(value) {
	const text = String(value);
	if (/[",\n]/.test(text)) return `"${text.replace(/"/g, "\"\"")}"`;
	return text;
}
function escapeXml(value) {
	return value.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}
function downloadText(filename, text, mime) {
	const blob = new Blob([text], { type: mime });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function freshness(iso) {
	if (!iso) return "missing";
	const age = Date.now() - new Date(iso).getTime();
	if (!Number.isFinite(age) || age < 0) return "missing";
	if (age < 36e5) return "good";
	if (age < 216e5) return "caution";
	return "poor";
}
function ageLabel(iso) {
	const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 6e4));
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.round(mins / 60);
	if (hrs < 48) return `${hrs}h ago`;
	return `${Math.round(hrs / 24)}d ago`;
}
function nwsWind(forecast) {
	if (!forecast) return null;
	const range = forecast.match(/winds?\s+(\d+)\s+to\s+(\d+)\s+kt/i);
	if (range) {
		const low = Number(range[1]);
		const high = Number(range[2]);
		return {
			mph: (low + high) / 2 * 1.15078,
			label: `NWS ${low}–${high} kt`
		};
	}
	const one = forecast.match(/winds?\s+(\d+)\s+kt/i);
	if (!one) return null;
	const kt = Number(one[1]);
	return {
		mph: kt * 1.15078,
		label: `NWS ${kt} kt`
	};
}
function inletGate(opts) {
	const reasons = [];
	let gate = "go";
	const bump = (next) => {
		if (next === "no-go" || gate === "go") gate = next;
	};
	const forecast = opts.forecast?.toUpperCase() ?? "";
	if (/STORM WARNING|HURRICANE|TROPICAL STORM/.test(forecast)) {
		bump("no-go");
		reasons.push("NWS has a storm warning on this coastal zone.");
	} else if (/GALE WARNING/.test(forecast)) {
		bump("no-go");
		reasons.push(opts.nwsZone === "AMZ158" ? "NWS gale warning on Cape Lookout to Surf City." : `NWS gale warning on ${opts.nwsZone}.`);
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
	} else if (opts.seasFt != null && opts.periodS != null && opts.seasFt >= Math.max(2, opts.rules.maxSeasFt - 1) && opts.periodS < opts.rules.minPeriodS) {
		bump("no-go");
		reasons.push(`${opts.seasFt.toFixed(1)} ft at ${Math.round(opts.periodS)} sec is too short a period for this boat.`);
	} else if (opts.seasFt != null && opts.seasFt > opts.rules.maxSeasFt - .7) {
		bump("caution");
		reasons.push(`Seas are close to your ${opts.rules.maxSeasFt} ft limit.`);
	}
	if (opts.windMph != null && opts.windMph > opts.rules.maxWindMph) {
		bump("no-go");
		reasons.push(`Wind ${Math.round(opts.windMph)} mph is over your ${opts.rules.maxWindMph} mph limit.`);
	}
	if (opts.stage === "ebb" && (opts.currentKt ?? 0) >= 1 && (opts.seasFt ?? 0) >= opts.rules.maxSeasFt - .5) {
		bump("no-go");
		reasons.push(`Ebb against the sea at ${opts.inletName}. That is the rough one.`);
	}
	if (gate === "go") reasons.push("Under the limits you set for this boat.");
	return {
		gate,
		reasons: reasons.slice(0, 4)
	};
}
var SYNODIC = 29.530588853;
var KNOWN_NEW = Date.UTC(2e3, 0, 6, 18, 14, 0);
function rev(deg) {
	return (deg % 360 + 360) % 360;
}
function rad(d) {
	return d * Math.PI / 180;
}
function deg(r) {
	return r * 180 / Math.PI;
}
function moonInfo(date) {
	const age = ((date.getTime() - KNOWN_NEW) / 864e5 % SYNODIC + SYNODIC) % SYNODIC;
	const illumination = (1 - Math.cos(2 * Math.PI * age / SYNODIC)) / 2;
	const waxing = age < SYNODIC / 2;
	let name = "Waxing crescent";
	if (age < 1.5) name = "New moon";
	else if (age < 6.5) name = "Waxing crescent";
	else if (age < 8.5) name = "First quarter";
	else if (age < 13.5) name = "Waxing gibbous";
	else if (age < 16.2) name = "Full moon";
	else if (age < 21.5) name = "Waning gibbous";
	else if (age < 23.5) name = "Last quarter";
	else if (age < 28) name = "Waning crescent";
	else name = "New moon";
	return {
		illumination,
		ageDays: age,
		name,
		waxing
	};
}
/** Days since 1999-12-31 00:00 UTC (Schlyter day number). */
function schlyterDay(date) {
	return date.getTime() / 864e5 - 10956;
}
function moonEquatorial(d) {
	const N = rev(125.1228 - .0529538083 * d);
	const i = 5.1454;
	const w = rev(318.0634 + .1643573223 * d);
	const a = 60.2666;
	const e = .0549;
	const M = rev(115.3654 + 13.0649929509 * d);
	let E = M + deg(e) * Math.sin(rad(M)) * (1 + e * Math.cos(rad(M)));
	for (let k = 0; k < 6; k++) E = E - (E - deg(e * Math.sin(rad(E))) - M) / (1 - e * Math.cos(rad(E)));
	const xv = a * (Math.cos(rad(E)) - e);
	const yv = a * Math.sqrt(1 - e * e) * Math.sin(rad(E));
	const v = deg(Math.atan2(yv, xv));
	const r = Math.hypot(xv, yv);
	const xh = r * (Math.cos(rad(N)) * Math.cos(rad(v + w)) - Math.sin(rad(N)) * Math.sin(rad(v + w)) * Math.cos(rad(i)));
	const yh = r * (Math.sin(rad(N)) * Math.cos(rad(v + w)) + Math.cos(rad(N)) * Math.sin(rad(v + w)) * Math.cos(rad(i)));
	const zh = r * Math.sin(rad(v + w)) * Math.sin(rad(i));
	const obl = 23.4393 - 3.563e-7 * d;
	const xe = xh;
	const ye = yh * Math.cos(rad(obl)) - zh * Math.sin(rad(obl));
	const ze = yh * Math.sin(rad(obl)) + zh * Math.cos(rad(obl));
	return {
		ra: rev(deg(Math.atan2(ye, xe))),
		dec: deg(Math.atan2(ze, Math.hypot(xe, ye)))
	};
}
function altitude(date, lat, lng) {
	const jd = date.getTime() / 864e5 + 2440587.5;
	const { ra, dec } = moonEquatorial(schlyterDay(date));
	const T = (jd - 2451545) / 36525;
	let ha = rev(rev(280.46061837 + 360.98564736629 * (jd - 2451545) + 387933e-9 * T * T) + lng) - ra;
	if (ha > 180) ha -= 360;
	if (ha < -180) ha += 360;
	const sinAlt = Math.sin(rad(lat)) * Math.sin(rad(dec)) + Math.cos(rad(lat)) * Math.cos(rad(dec)) * Math.cos(rad(ha));
	return deg(Math.asin(Math.max(-1, Math.min(1, sinAlt))));
}
function localMidnight(date) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}
/**
* Solunar majors around upper and lower transit, minors around rise and set.
* Good to roughly half an hour — enough to plan a tide, not a launch window.
*/
function solunarWindows(date, lat, lng) {
	const start = localMidnight(date);
	const end = new Date(start.getTime() + 864e5);
	const step = 36e4;
	const samples = [];
	for (let t = start.getTime() - 72e5; t <= end.getTime() + 72e5; t += step) samples.push({
		t,
		alt: altitude(new Date(t), lat, lng)
	});
	let max = samples[0];
	let min = samples[0];
	for (const s of samples) {
		if (s.t < start.getTime() || s.t >= end.getTime()) continue;
		if (s.alt > max.alt) max = s;
		if (s.alt < min.alt) min = s;
	}
	const windows = [];
	const pushTransit = (peakMs, label) => {
		const peak = new Date(peakMs);
		windows.push({
			kind: "major",
			label,
			peak,
			start: /* @__PURE__ */ new Date(peakMs - 36e5),
			end: new Date(peakMs + 36e5)
		});
	};
	if (max.t >= start.getTime() && max.t < end.getTime()) pushTransit(max.t, "Moon overhead");
	if (min.t >= start.getTime() && min.t < end.getTime() && min.t !== max.t) pushTransit(min.t, "Moon underfoot");
	for (let i = 1; i < samples.length; i++) {
		const a = samples[i - 1];
		const b = samples[i];
		if (a.alt === b.alt) continue;
		if (!(a.alt < 0 && b.alt >= 0 || a.alt >= 0 && b.alt < 0)) continue;
		const f = a.alt / (a.alt - b.alt);
		const t = a.t + (b.t - a.t) * f;
		if (t < start.getTime() || t >= end.getTime()) continue;
		const rising = b.alt > a.alt;
		const peak = new Date(t);
		windows.push({
			kind: "minor",
			label: rising ? "Moonrise" : "Moonset",
			peak,
			start: /* @__PURE__ */ new Date(t - 18e5),
			end: new Date(t + 18e5)
		});
	}
	windows.sort((a, b) => a.peak.getTime() - b.peak.getTime());
	return windows;
}
function windowAt(windows, date) {
	const t = date.getTime();
	return windows.find((w) => t >= w.start.getTime() && t <= w.end.getTime()) ?? null;
}
function nextWindow(windows, date) {
	const t = date.getTime();
	return windows.find((w) => w.end.getTime() > t) ?? null;
}
function shoalAdvisory(opts) {
	if (opts.depthFtMllw == null || opts.tideFtMllw == null) return {
		level: "unknown",
		reason: "Enter the chart sounding and wait for the NOAA tide. No depth is invented here."
	};
	const water = opts.depthFtMllw + opts.tideFtMllw;
	const need = opts.draftFt + opts.marginFt;
	if (water >= need + .5) return {
		level: "ok",
		reason: `About ${water.toFixed(1)} ft of water over a ${opts.depthFtMllw.toFixed(1)} ft sounding. You asked for ${need.toFixed(1)} ft.`
	};
	if (water >= need) return {
		level: "thin",
		reason: `About ${water.toFixed(1)} ft of water. That is inside half a foot of draft plus margin.`
	};
	return {
		level: "risk",
		reason: `About ${water.toFixed(1)} ft of water. That is less than draft ${opts.draftFt.toFixed(2)} ft plus ${opts.marginFt.toFixed(1)} ft margin.`
	};
}
var MAX = 126;
function nearestRow(rows, t) {
	let best = null;
	let dist = Infinity;
	for (const row of rows) {
		const d = Math.abs(new Date(row.time).getTime() - t);
		if (d < dist) {
			dist = d;
			best = row;
		}
	}
	if (!best || dist > 6e6) return null;
	return best;
}
function tideAt(tide, t) {
	if (!tide || tide.samples.length < 2) return null;
	let prev = null;
	let next = null;
	for (const s of tide.samples) {
		const ms = new Date(s.time).getTime();
		if (ms <= t) prev = {
			ms,
			height: s.height
		};
		if (ms >= t) {
			next = {
				ms,
				height: s.height
			};
			break;
		}
	}
	if (!prev || !next) return null;
	const span = next.ms - prev.ms;
	const height = span === 0 ? prev.height : prev.height + (next.height - prev.height) * (t - prev.ms) / span;
	const rate = span === 0 ? 0 : (next.height - prev.height) / (span / 36e5);
	return {
		height,
		rate,
		stage: rate > .15 ? "rising" : rate < -.15 ? "falling" : "slack"
	};
}
function tidePoints(rate) {
	const a = Math.abs(rate);
	if (a >= .5) return 26;
	if (a >= .25) return 18;
	if (a >= .12) return 10;
	return 4;
}
function windPoints(mph, exposure) {
	if (mph == null) return 8;
	const [good, ok, bad] = {
		protected: [
			12,
			16,
			22
		],
		coastal: [
			15,
			20,
			25
		],
		open: [
			18,
			25,
			30
		]
	}[exposure];
	if (mph < 4) return exposure === "protected" ? 14 : 12;
	if (mph <= good) return 18;
	if (mph <= ok) return 12;
	if (mph <= bad) return 6;
	return 0;
}
function seaPoints(waveFt, exposure, wind) {
	if (exposure === "protected") {
		if ((wind ?? 0) > 20) return 4;
		if ((waveFt ?? 0) > 7) return 10;
		return 16;
	}
	if (waveFt == null) return 8;
	if (exposure === "coastal") {
		if (waveFt < 2) return 18;
		if (waveFt < 3.5) return 14;
		if (waveFt < 5) return 8;
		if (waveFt < 7) return 3;
		return 0;
	}
	if (waveFt < 3) return 16;
	if (waveFt < 6) return 14;
	if (waveFt < 8) return 8;
	if (waveFt < 12) return 3;
	return 0;
}
function lightPoints(date, exposure) {
	const h = date.getHours() + date.getMinutes() / 60;
	if (h >= 5 && h < 8.5 || h >= 17 && h < 20.5) return 12;
	if (h >= 21 || h < 5) return exposure === "open" ? 6 : 3;
	return 4;
}
function pressurePoints(now, earlier) {
	if (now == null || earlier == null) return {
		pts: 1,
		note: null
	};
	const drop = earlier - now;
	if (drop > 8) return {
		pts: 0,
		note: "Pressure is crashing"
	};
	if (drop > 3) return {
		pts: 4,
		note: "Pressure is falling"
	};
	if (drop < -3) return {
		pts: 2,
		note: "Pressure is rising"
	};
	return {
		pts: 1,
		note: null
	};
}
function observedWave(conditions, when, exposure) {
	const buoy = conditions.buoy;
	if (!buoy || exposure === "protected") return null;
	if (buoy.ageMin > 180 || buoy.distanceMi > 80) return null;
	if (Math.abs(when.getTime() - Date.now()) > 108e5) return null;
	return {
		ft: buoy.waveFt,
		id: buoy.id
	};
}
function labelFor(value) {
	if (value >= 75) return "Strong";
	if (value >= 58) return "Worth going";
	if (value >= 42) return "Marginal";
	return "Tough";
}
function scoreAt(opts) {
	const { when, exposure, band, conditions } = opts;
	const t = when.getTime();
	const marine = nearestRow(conditions.marineHourly, t);
	const weather = nearestRow(conditions.weatherHourly, t);
	const tide = tideAt(conditions.tide, t);
	const windows = solunarWindows(when, opts.lat, opts.lng);
	const active = windowAt(windows, when);
	const moon = moonInfo(when);
	const nearMoon = moon.ageDays < 2 || moon.ageDays > 27.5 || Math.abs(moon.ageDays - SYNODIC_HALF) < 2;
	const weatherPrev = nearestRow(conditions.weatherHourly, t - 108e5);
	const pressure = pressurePoints(weather?.pressureMb ?? null, weatherPrev?.pressureMb ?? null);
	let solunarPts = 2;
	if (active?.kind === "major") solunarPts = 22;
	else if (active?.kind === "minor") solunarPts = 12;
	else {
		const upcoming = nextWindow(windows, when);
		if (upcoming && upcoming.start.getTime() - t < 54e5) solunarPts = 6;
	}
	const tidePts = tide ? tidePoints(tide.rate) : 10;
	const windPts = windPoints(weather?.windMph ?? null, exposure);
	const buoyWave = observedWave(conditions, when, exposure);
	const seaPts = seaPoints(buoyWave?.ft ?? marine?.waveFt ?? null, exposure, weather?.windMph ?? null);
	const light = lightPoints(when, exposure);
	const moonPts = nearMoon ? 6 : 2;
	const raw = 20 + tidePts + solunarPts + light + windPts + seaPts + moonPts + pressure.pts;
	const value = Math.max(0, Math.min(100, Math.round(raw / MAX * 100)));
	const reasons = [];
	if (tide) {
		if (tide.stage === "slack") reasons.push("Tide is slack");
		else reasons.push(`Tide is ${tide.stage} at ${Math.abs(tide.rate).toFixed(1)} ft/hr`);
	} else reasons.push("No tide station on this read");
	if (active) reasons.push(`${active.kind === "major" ? "Major" : "Minor"} solunar · ${active.label.toLowerCase()}`);
	if (weather?.windMph != null) reasons.push(`Wind ${Math.round(weather.windMph)} mph from ${compass(weather.windDir)}`);
	if (buoyWave) reasons.push(`Buoy ${buoyWave.id} ${buoyWave.ft.toFixed(1)} ft`);
	else if (marine?.waveFt != null) reasons.push(`Model seas ${marine.waveFt.toFixed(1)} ft`);
	if (pressure.note) reasons.push(pressure.note);
	return {
		value,
		label: labelFor(value),
		reasons: reasons.slice(0, 4),
		band,
		exposure
	};
}
var SYNODIC_HALF = 29.530588853 / 2;
var PROFILES = [
	{
		band: "inshore",
		exposure: "protected"
	},
	{
		band: "nearshore",
		exposure: "coastal"
	},
	{
		band: "offshore",
		exposure: "open"
	}
];
function recommendBand(opts) {
	const scores = PROFILES.map((p) => scoreAt({
		...opts,
		...p
	}));
	scores.sort((a, b) => b.value - a.value);
	return scores[0];
}
function bestWindow(opts) {
	const midnight = new Date(opts.day);
	midnight.setHours(0, 0, 0, 0);
	const hours = [];
	for (let h = 4; h <= 21; h++) {
		const date = new Date(midnight);
		date.setHours(h, 0, 0, 0);
		if (sameCivilDay(opts.day, /* @__PURE__ */ new Date()) && date.getTime() < Date.now() - 18e5) continue;
		const score = scoreAt({
			when: date,
			...opts
		}).value;
		hours.push({
			date,
			score
		});
	}
	if (!hours.length) return null;
	let peak = hours[0];
	for (const h of hours) if (h.score > peak.score) peak = h;
	const keep = hours.filter((h) => peak.score - h.score <= 8);
	const peakIdx = keep.findIndex((h) => h.date.getTime() === peak.date.getTime());
	let from = peakIdx;
	let to = peakIdx;
	while (from > 0 && keep[from].date.getTime() - keep[from - 1].date.getTime() <= 42e5) from--;
	while (to < keep.length - 1 && keep[to + 1].date.getTime() - keep[to].date.getTime() <= 42e5) to++;
	const start = keep[Math.max(from, peakIdx - 1)].date;
	const endDate = keep[Math.min(to, peakIdx + 1)].date;
	return {
		start,
		end: new Date(endDate.getTime() + 36e5),
		score: peak.score
	};
}
function inSeason(ground, month) {
	return ground.species.filter((s) => s.months.includes(month));
}
function fishingRead(opts) {
	const { ground, tide, seasFt, recommendation, window, month, neighbors, active } = opts;
	const moving = tide == null ? "Tide isn't on this station." : tide.stage === "slack" ? "The tide is slack, so bait isn't being pushed." : `The tide is ${tide.stage}, which is the part worth fishing.`;
	const seas = seasFt == null ? "" : recommendation.band === "inshore" && seasFt >= 4 ? ` Open water is about ${seasFt.toFixed(0)} ft, so stay inside.` : recommendation.band === "offshore" && seasFt < 6 ? ` Seas are about ${seasFt.toFixed(0)} ft — a canyon day if the rest of the forecast holds.` : recommendation.band === "nearshore" && seasFt >= 5 ? ` Seas are about ${seasFt.toFixed(0)} ft. Nearshore only if you like a wet ride; inshore is kinder.` : ` Seas are about ${seasFt.toFixed(0)} ft.`;
	const where = recommendation.band === ground.band ? ` This ${BAND_LABEL[ground.band].toLowerCase()} water is the call.` : ` ${BAND_LABEL[recommendation.band]} looks better than ${BAND_LABEL[ground.band].toLowerCase()} today.`;
	const pool = neighbors.filter((g) => g.band === recommendation.band);
	const names = uniqueSpecies(pool.length ? pool : [ground], month).slice(0, 2);
	return `${moving}${seas}${where}${names.length ? ` Look for ${names.join(" and ")}.` : ""}${active ? ` You're in a ${active.kind} window (${active.label.toLowerCase()}).` : ""}${window ? ` Best window ${clockShort(window.start)}–${clockShort(window.end)}.` : ""}`.replace(/\s+/g, " ").trim();
}
function uniqueSpecies(grounds, month) {
	const names = [];
	for (const g of grounds) for (const s of inSeason(g, month)) if (!names.includes(s.name)) names.push(s.name);
	return names;
}
function clockShort(date) {
	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit"
	});
}
function snapshotMarine(conditions, when) {
	return nearestRow(conditions.marineHourly, when.getTime());
}
function snapshotWeather(conditions, when) {
	return nearestRow(conditions.weatherHourly, when.getTime());
}
function sameCivilDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function toRad(deg) {
	return deg * Math.PI / 180;
}
function toDeg(rad) {
	return rad * 180 / Math.PI;
}
/** USNO approximation. Good for a return time, not a survey. */
function sunTimes(day, lat, lng) {
	const rise = event(day, lat, lng, true);
	const set = event(day, lat, lng, false);
	if (!rise || !set) return null;
	return {
		rise,
		set
	};
}
function event(day, lat, lng, rising) {
	const year = day.getFullYear();
	const month = day.getMonth() + 1;
	const date = day.getDate();
	const n = Math.floor(275 * month / 9) - Math.floor((month + 9) / 12) * (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3)) + date - 30;
	const lngHour = lng / 15;
	const t = rising ? n + (6 - lngHour) / 24 : n + (18 - lngHour) / 24;
	const mean = .9856 * t - 3.289;
	let lon = mean + 1.916 * Math.sin(toRad(mean)) + .02 * Math.sin(toRad(2 * mean)) + 282.634;
	lon = (lon + 360) % 360;
	let ra = toDeg(Math.atan(.91764 * Math.tan(toRad(lon))));
	ra = (ra + 360) % 360;
	const lq = Math.floor(lon / 90) * 90;
	const rq = Math.floor(ra / 90) * 90;
	ra = (ra + (lq - rq)) / 15;
	const sinDec = .39782 * Math.sin(toRad(lon));
	const cosDec = Math.cos(Math.asin(sinDec));
	const cosH = (Math.cos(toRad(90.833)) - sinDec * Math.sin(toRad(lat))) / (cosDec * Math.cos(toRad(lat)));
	if (cosH > 1 || cosH < -1) return null;
	let ut = ((rising ? 360 - toDeg(Math.acos(cosH)) : toDeg(Math.acos(cosH))) / 15 + ra - .06571 * t - 6.622 - lngHour) % 24;
	if (ut < 0) ut += 24;
	const hours = Math.floor(ut);
	const minutes = Math.floor((ut - hours) * 60);
	return new Date(Date.UTC(year, month - 1, date, hours, minutes));
}
/** Coastal NOAA CO-OPS stations used for tide predictions. Ids are 7 digits. */
var TIDE_STATIONS = [
	{
		id: "8638863",
		name: "Chesapeake Bay Bridge Tunnel",
		lat: 36.9667,
		lng: -76.1133
	},
	{
		id: "8638610",
		name: "Sewells Point",
		lat: 36.9467,
		lng: -76.33
	},
	{
		id: "8637689",
		name: "Yorktown",
		lat: 37.2267,
		lng: -76.4786
	},
	{
		id: "8632200",
		name: "Kiptopeke",
		lat: 37.1652,
		lng: -75.9884
	},
	{
		id: "8573364",
		name: "Bishops Head",
		lat: 38.2206,
		lng: -76.0383
	},
	{
		id: "8577330",
		name: "Solomons Island",
		lat: 38.3167,
		lng: -76.4517
	},
	{
		id: "8575512",
		name: "Annapolis",
		lat: 38.9833,
		lng: -76.4817
	},
	{
		id: "8631044",
		name: "Wachapreague",
		lat: 37.6078,
		lng: -75.6858
	},
	{
		id: "8570283",
		name: "Ocean City Inlet",
		lat: 38.3283,
		lng: -75.0917
	},
	{
		id: "8651370",
		name: "Duck",
		lat: 36.1833,
		lng: -75.7467
	},
	{
		id: "8652587",
		name: "Oregon Inlet Marina",
		lat: 35.795,
		lng: -75.5483
	},
	{
		id: "8654467",
		name: "Hatteras",
		lat: 35.2086,
		lng: -75.7042
	},
	{
		id: "8656483",
		name: "Beaufort",
		lat: 34.7173,
		lng: -76.6707
	},
	{
		id: "8656613",
		name: "Swansboro",
		lat: 34.6866,
		lng: -77.1181
	},
	{
		id: "8658120",
		name: "Wilmington",
		lat: 34.2267,
		lng: -77.9533
	},
	{
		id: "8658163",
		name: "Wrightsville Beach",
		lat: 34.2133,
		lng: -77.7867
	},
	{
		id: "8659084",
		name: "Southport",
		lat: 33.915,
		lng: -78.0183
	},
	{
		id: "8659182",
		name: "Oak Island",
		lat: 33.9017,
		lng: -78.0817
	},
	{
		id: "8659897",
		name: "Sunset Beach Pier",
		lat: 33.865,
		lng: -78.5067
	},
	{
		id: "8665530",
		name: "Charleston",
		lat: 32.7817,
		lng: -79.925
	},
	{
		id: "8661070",
		name: "Springmaid Pier",
		lat: 33.655,
		lng: -78.9183
	},
	{
		id: "8720218",
		name: "Mayport",
		lat: 30.3967,
		lng: -81.4306
	},
	{
		id: "8721604",
		name: "Trident Pier",
		lat: 28.4158,
		lng: -80.5931
	},
	{
		id: "8722670",
		name: "Lake Worth Pier",
		lat: 26.6128,
		lng: -80.0342
	},
	{
		id: "8723214",
		name: "Virginia Key",
		lat: 25.7317,
		lng: -80.1617
	},
	{
		id: "8723970",
		name: "Vaca Key",
		lat: 24.711,
		lng: -81.1075
	},
	{
		id: "8725110",
		name: "Naples",
		lat: 26.1317,
		lng: -81.8075
	},
	{
		id: "8725520",
		name: "Fort Myers",
		lat: 26.6477,
		lng: -81.8712
	},
	{
		id: "8726520",
		name: "St. Petersburg",
		lat: 27.7606,
		lng: -82.6269
	},
	{
		id: "8729108",
		name: "Panama City",
		lat: 30.1523,
		lng: -85.6669
	},
	{
		id: "8735180",
		name: "Dauphin Island",
		lat: 30.25,
		lng: -88.075
	},
	{
		id: "8761724",
		name: "Grand Isle",
		lat: 29.2633,
		lng: -89.9567
	},
	{
		id: "8770570",
		name: "Sabine Pass North",
		lat: 29.7284,
		lng: -93.8701
	},
	{
		id: "8771450",
		name: "Galveston Pier 21",
		lat: 29.31,
		lng: -94.7933
	},
	{
		id: "8775870",
		name: "Bob Hall Pier",
		lat: 27.5803,
		lng: -97.2167
	},
	{
		id: "8534720",
		name: "Atlantic City",
		lat: 39.355,
		lng: -74.4183
	},
	{
		id: "8531680",
		name: "Sandy Hook",
		lat: 40.4669,
		lng: -74.0094
	},
	{
		id: "8510560",
		name: "Montauk",
		lat: 41.0483,
		lng: -71.96
	},
	{
		id: "8518750",
		name: "The Battery",
		lat: 40.7006,
		lng: -74.0142
	},
	{
		id: "8449130",
		name: "Nantucket Island",
		lat: 41.285,
		lng: -70.0967
	},
	{
		id: "8447930",
		name: "Woods Hole",
		lat: 41.5236,
		lng: -70.6711
	},
	{
		id: "8443970",
		name: "Boston",
		lat: 42.3548,
		lng: -71.0534
	},
	{
		id: "9410170",
		name: "San Diego",
		lat: 32.7142,
		lng: -117.1736
	},
	{
		id: "9410660",
		name: "Los Angeles",
		lat: 33.72,
		lng: -118.2717
	},
	{
		id: "9413450",
		name: "Monterey",
		lat: 36.605,
		lng: -121.888
	},
	{
		id: "9414290",
		name: "San Francisco",
		lat: 37.8063,
		lng: -122.4659
	},
	{
		id: "9440910",
		name: "Toke Point",
		lat: 46.7075,
		lng: -123.9669
	},
	{
		id: "9432780",
		name: "Charleston, OR",
		lat: 43.345,
		lng: -124.3217
	}
];
var useTrip = create()(persist((set) => ({
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
	toggleSaved: (id) => set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] }))
}), {
	name: "fairwater",
	skipHydration: true,
	version: 4,
	migrate: (persisted) => {
		const state = persisted ?? {};
		return {
			groundId: state.groundId || "beaufort-inlet",
			region: state.region || "outer-banks",
			band: state.band ?? "all",
			dayOffset: state.dayOffset ?? 0,
			chartView: state.chartView ?? "chart",
			helmMode: state.helmMode ?? "leave",
			saved: state.saved ?? []
		};
	}
}));
var DMF_PAGE = "https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/fisheries-management-proclamations";
var BRIEF_CACHE_KEY = "fairwater-brief-last";
var CONDITIONS_CACHE_KEY = "fairwater-conditions-last";
var GATE_CACHE_KEY = "fairwater-gate-last";
function num(value, fallback) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}
function routeClosedNote(closed) {
	return closed ? "Marks already loop home, so the burn is not doubled." : "Open path is doubled for the ride home.";
}
function readJson(key) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function nearestWeather(rows, t) {
	let best = null;
	let gap = Infinity;
	for (const row of rows) {
		const delta = Math.abs(new Date(row.time).getTime() - t);
		if (delta < gap) {
			gap = delta;
			best = row;
		}
	}
	return best;
}
function readCachedBrief() {
	return readJson(BRIEF_CACHE_KEY);
}
function Fold({ title, meta, children, defaultOpen = false, className }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("border-t border-line pt-1", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex min-h-12 w-full items-center justify-between gap-3 text-left",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-base font-medium text-fg",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "shrink-0 text-sm text-muted",
				children: [meta ? `${meta} · ` : "", open ? "Hide" : "Show"]
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pb-2",
			children
		}) : null]
	});
}
function CruiseBoard({ mode = "leave" }) {
	const boat = useBoat();
	const setGround = useTrip((s) => s.setGround);
	const setRegion = useTrip((s) => s.setRegion);
	const inlet = inletById(boat.activeInletId);
	const home = marinaById(boat.homeMarinaId);
	const [live, setLive] = (0, import_react.useState)(false);
	const [species, setSpecies] = (0, import_react.useState)("Speckled trout");
	const [cachedBrief, setCachedBrief] = (0, import_react.useState)(null);
	const [cachedConditions, setCachedConditions] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		useBoat.persist.rehydrate();
		setCachedBrief(readCachedBrief());
		setCachedConditions(readJson(CONDITIONS_CACHE_KEY));
		setLive(true);
	}, []);
	const station = TIDE_STATIONS.find((item) => item.id === inlet.stationId);
	const stationMiles = station ? miles(inlet.lat, inlet.lng, station.lat, station.lng) : 1;
	const inletQuery = useQuery({
		queryKey: [
			"fairwater-inlet",
			inlet.id,
			inlet.stationId
		],
		enabled: live,
		staleTime: 3e5,
		refetchInterval: 6e5,
		refetchOnWindowFocus: true,
		queryFn: () => getConditions({ data: {
			lat: inlet.lat,
			lng: inlet.lng,
			stationId: inlet.stationId,
			stationName: inlet.stationName,
			distanceMi: Math.max(stationMiles, .1)
		} })
	});
	const brief = useQuery({
		queryKey: ["fairwater-brief", inlet.nwsZoneHint],
		enabled: live,
		staleTime: 6e5,
		refetchInterval: 9e5,
		refetchOnWindowFocus: true,
		queryFn: () => getBrief({ data: { zone: inlet.nwsZoneHint } })
	});
	(0, import_react.useEffect)(() => {
		if (!brief.data) return;
		const payload = {
			at: (/* @__PURE__ */ new Date()).toISOString(),
			zone: inlet.nwsZoneHint,
			brief: brief.data
		};
		try {
			localStorage.setItem(BRIEF_CACHE_KEY, JSON.stringify(payload));
			setCachedBrief(payload);
		} catch {}
	}, [brief.data, inlet.nwsZoneHint]);
	(0, import_react.useEffect)(() => {
		if (!inletQuery.data) return;
		const payload = {
			at: (/* @__PURE__ */ new Date()).toISOString(),
			inletId: inlet.id,
			conditions: inletQuery.data
		};
		try {
			localStorage.setItem(CONDITIONS_CACHE_KEY, JSON.stringify(payload));
			setCachedConditions(payload);
		} catch {}
	}, [inletQuery.data, inlet.id]);
	const sameZone = cachedBrief?.zone === inlet.nwsZoneHint || !cachedBrief?.zone;
	const displayBrief = brief.data ?? (sameZone ? cachedBrief?.brief ?? null : null);
	const briefStale = !brief.data && !!displayBrief;
	const briefAge = cachedBrief?.at ? ageLabel(cachedBrief.at) : null;
	const briefFresh = freshness(brief.data ? (/* @__PURE__ */ new Date()).toISOString() : cachedBrief?.at);
	const conditions = inletQuery.data ?? (cachedConditions?.inletId === inlet.id ? cachedConditions.conditions : null);
	const conditionsStale = !inletQuery.data && !!conditions;
	const conditionsAge = cachedConditions?.inletId === inlet.id && cachedConditions.at ? ageLabel(cachedConditions.at) : null;
	const now = /* @__PURE__ */ new Date();
	const flow = conditions ? currentAt(conditions.current, now.getTime()) : null;
	const buoy = conditions?.buoy ?? null;
	const weather = conditions?.weatherHourly.length ? nearestWeather(conditions.weatherHourly, now.getTime()) : null;
	const officialWind = nwsWind(displayBrief?.forecast ?? null);
	const windMph = weather?.windMph ?? buoy?.windMph ?? officialWind?.mph ?? null;
	const windText = weather?.windMph != null ? `${Math.round(weather.windMph)} mph · model` : buoy?.windMph != null ? `${Math.round(buoy.windMph)} mph · buoy` : officialWind ? officialWind.label : "—";
	const gate = inletGate({
		seasFt: buoy?.waveFt ?? null,
		periodS: buoy?.wavePeriodS ?? null,
		windMph,
		stage: flow?.stage ?? null,
		currentKt: flow?.speedKt ?? null,
		forecast: displayBrief?.forecast ?? null,
		rules: boat,
		inletName: inlet.barName,
		nwsZone: inlet.nwsZoneHint
	});
	(0, import_react.useEffect)(() => {
		const label = gate.gate === "no-go" ? "No-go" : gate.gate === "caution" ? "Caution" : "Under your limits";
		window.dispatchEvent(new CustomEvent("fairwater-gate", { detail: label }));
		try {
			localStorage.setItem(GATE_CACHE_KEY, JSON.stringify({
				inletId: inlet.id,
				gate: gate.gate,
				reasons: gate.reasons,
				at: (/* @__PURE__ */ new Date()).toISOString()
			}));
		} catch {}
	}, [
		gate.gate,
		gate.reasons,
		inlet.id
	]);
	const sun = sunTimes(now, inlet.lat, inlet.lng);
	const route = routeFuel(boat.waypoints, boat.cruiseKt, boat.burnGph, boat.tankGal, boat.reservePct);
	const offshore = (0, import_react.useMemo)(() => planFuelNm(40, boat.cruiseKt, boat.burnGph, boat.tankGal, boat.reservePct), [
		boat.cruiseKt,
		boat.burnGph,
		boat.tankGal,
		boat.reservePct
	]);
	const rough = (0, import_react.useMemo)(() => planFuelNm(40, boat.cruiseKt, boat.planningBurnGph, boat.tankGal, boat.reservePct), [
		boat.cruiseKt,
		boat.planningBurnGph,
		boat.tankGal,
		boat.reservePct
	]);
	const checksDone = CHECKLIST_ITEMS.filter((item) => boat.checklist[item.id]).length;
	const tideNow = tideAt(conditions?.tide ?? null, now.getTime());
	const shoal = shoalAdvisory({
		draftFt: boat.draftFt,
		marginFt: 1,
		depthFtMllw: boat.shoalDepthFt,
		tideFtMllw: tideNow?.height ?? null
	});
	const runHome = home ? (() => {
		const nm = miles(inlet.lat, inlet.lng, home.lat, home.lng) * .868976;
		return {
			nm,
			minutes: nm / Math.max(boat.cruiseKt, 1) * 60
		};
	})() : null;
	(0, import_react.useEffect)(() => {
		const fuel = offshore.home ? `40 out / ${offshore.nm.toFixed(0)} RT · HOME OK` : "GO HOME";
		window.dispatchEvent(new CustomEvent("fairwater-fuel", { detail: fuel }));
	}, [offshore.home, offshore.nm]);
	(0, import_react.useEffect)(() => {
		if (!boat.recording || !live) return;
		const id = navigator.geolocation.watchPosition((pos) => boat.addTrack({
			lat: pos.coords.latitude,
			lng: pos.coords.longitude
		}), () => boat.setRecording(false), {
			enableHighAccuracy: true,
			maximumAge: 5e3
		});
		return () => navigator.geolocation.clearWatch(id);
	}, [
		boat.recording,
		live,
		boat.addTrack,
		boat.setRecording
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("rounded-xl border p-4", mode !== "leave" && "hidden", gate.gate === "no-go" && "border-poor", gate.gate === "caution" && "border-fair", gate.gate === "go" && "border-good"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-subtle uppercase",
						children: inlet.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl leading-none text-fg",
						children: gate.gate === "no-go" ? "No-go" : gate.gate === "caution" ? "Caution" : "Under your limits"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-subtle",
							children: ["Inlet", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 h-12 w-full rounded-md border border-line bg-bg px-2 text-sm text-fg",
								value: inlet.id,
								"aria-label": "Inlet",
								onChange: (event) => {
									const next = inletById(event.target.value);
									boat.setActiveInlet(next.id);
									setRegion("outer-banks");
									setGround(next.groundId);
								},
								children: INLETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.id,
									children: item.name
								}, item.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-subtle",
							children: ["Home marina", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 h-12 w-full rounded-md border border-line bg-bg px-2 text-sm text-fg",
								value: boat.homeMarinaId ?? "70-west",
								"aria-label": "Home marina",
								onChange: (event) => boat.setHomeMarina(event.target.value),
								children: MARINAS.map((marina) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: marina.id,
									children: marina.name
								}, marina.id))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: inlet.notes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							boat.boatLabel,
							" · draft ",
							boat.draftFt.toFixed(2),
							" ft (~",
							Math.round(boat.draftFt * 12),
							"″) · not a navigation clearance"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-1 text-sm text-fg",
						children: gate.reasons.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: reason }, reason))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-2 gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: "Tide · NOAA"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: conditions?.tide ? conditions.tide.stationName : inletQuery.isError ? "No feed" : "Loading"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: "Current · NOAA"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: flow && conditions?.current ? `${flow.stage} ${flow.speedKt.toFixed(1)} kt · ${conditions.current.stationName.split(",")[0]}` : "No station"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: "Seas · NDBC"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: buoy ? `${buoy.waveFt.toFixed(1)} ft · ${buoy.wavePeriodS ? `${Math.round(buoy.wavePeriodS)} s` : "period n/a"}` : "No fresh buoy"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: "Wind"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: windText
							})] })
						]
					}),
					buoy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-fg",
						children: [
							buoy.id,
							" is ",
							buoy.name,
							". It sits ",
							buoy.distanceMi,
							" miles ",
							compass(bearing(inlet.lat, inlet.lng, buoy.lat, buoy.lng)),
							" of the inlet mouth, about",
							" ",
							Math.round(buoy.distanceMi * .869),
							" nm. Nothing in this app sits on the bar. The bar can be rougher than this buoy."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "The dashed line offshore is an approximate 3 nm state-water line, not the legal boundary. The inlet is inside state water. This buoy is outside it."
					}),
					sun ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Sun ",
							clock$1(sun.rise),
							"–",
							clock$1(sun.set)
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Max seas",
								value: boat.maxSeasFt,
								suffix: "ft",
								onChange: (v) => boat.setRule({ maxSeasFt: num(v, boat.maxSeasFt) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Min period",
								value: boat.minPeriodS,
								suffix: "s",
								onChange: (v) => boat.setRule({ minPeriodS: num(v, boat.minPeriodS) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Max wind",
								value: boat.maxWindMph,
								suffix: "mph",
								onChange: (v) => boat.setRule({ maxWindMph: num(v, boat.maxWindMph) })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Draft",
								value: boat.draftFt,
								suffix: "ft",
								onChange: (v) => boat.setRule({ draftFt: num(v, boat.draftFt) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reserve",
								value: boat.reservePct,
								suffix: "%",
								onChange: (v) => boat.setRule({ reservePct: num(v, boat.reservePct) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-4 h-12 rounded-md bg-surface-2 px-2 text-xs font-medium text-fg",
								onClick: () => boat.applySportsman262(),
								children: "Reset 262 preset"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Still your call at the dock."
					}),
					conditionsStale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-fair",
						role: "status",
						children: [
							"Last conditions for this inlet · ",
							conditionsAge,
							" · ",
							freshness(cachedConditions?.at)
						]
					}) : null,
					inletQuery.isError && !conditions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-3 h-12 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg",
						onClick: () => void inletQuery.refetch(),
						children: "Retry feeds"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("rounded-xl border border-line p-4", mode !== "leave" && "hidden"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-subtle uppercase",
						children: "Sandbar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-1 text-sm font-medium", shoal.level === "risk" && "text-poor", shoal.level === "thin" && "text-fair", shoal.level === "ok" && "text-good"),
						children: shoal.level === "unknown" ? "Unknown" : shoal.level === "ok" ? "Enough water on this sounding" : shoal.level === "thin" ? "Thin" : "Risk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-fg",
						children: shoal.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-2 block text-xs text-subtle",
						children: ["Chart depth at this spot, ft MLLW", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							defaultValue: boat.shoalDepthFt ?? "",
							placeholder: "From the chart, not a guess",
							onBlur: (event) => {
								const parsed = Number(event.target.value);
								boat.setShoalDepth(event.target.value.trim() === "" || !Number.isFinite(parsed) ? null : parsed);
							},
							className: "mt-1 h-12 w-full rounded-md border border-line bg-bg px-3 text-sm text-fg",
							"aria-label": "Chart depth in feet MLLW"
						}, boat.shoalDepthFt ?? "empty")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Depth advisory only — not a clearance guarantee."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("rounded-xl border p-4", mode === "fish" && "hidden", offshore.home ? "border-good" : "border-poor"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-subtle uppercase",
						children: "40 nm out · 80 nm RT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-display text-2xl leading-tight text-fg",
						children: [
							offshore.nm.toFixed(0),
							" nm · ",
							offshore.hours.toFixed(1),
							" hr · ",
							offshore.gallons.toFixed(0),
							" gal"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"40 out / ",
							offshore.nm.toFixed(0),
							" RT · Twin cruise ",
							boat.cruiseKt,
							" kt · ",
							boat.burnGph,
							" gph · tank ",
							boat.tankGal,
							" gal · ",
							boat.reservePct,
							"% reserve (",
							offshore.reserveGal.toFixed(0),
							" gal)"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"Rough-water planning burn ",
							boat.planningBurnGph,
							" gph would be ",
							rough.gallons.toFixed(0),
							" gal on the same 40 nm out · ",
							rough.nm.toFixed(0),
							" nm RT."
						]
					}),
					runHome ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-fg",
						children: [
							"Run home to ",
							home?.name,
							": ",
							runHome.nm.toFixed(1),
							" nm · about ",
							Math.round(runHome.minutes),
							" min at ",
							boat.cruiseKt,
							" kt from this inlet."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Pick a home marina for the run-home time."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-2 text-sm font-medium", offshore.home ? "text-good" : "text-poor"),
						children: offshore.home ? `Fuel covers the round trip with ${Math.max(0, offshore.usable - offshore.gallons).toFixed(0)} gal spare after reserve.` : `Short ${(offshore.gallons - offshore.usable).toFixed(0)} gal after reserve — top off or shorten the run.`
					}),
					!offshore.home ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-lg bg-poor/20 px-3 py-2 text-sm font-medium text-poor",
						role: "status",
						children: "GO HOME — planned burn exceeds usable fuel. Turn around before the bar if the tank is lower than planned."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-lg bg-good/15 px-3 py-2 text-sm text-good",
						role: "status",
						children: "Go-home reserve is built in. Still leave early if weather or burn climbs."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
				title: "Pre-launch checklist",
				meta: `${checksDone}/${CHECKLIST_ITEMS.length}`,
				defaultOpen: true,
				className: mode !== "leave" ? "hidden" : void 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 flex flex-col gap-1",
					children: CHECKLIST_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-12 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-surface-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-5 accent-[var(--color-accent)]",
							checked: !!boat.checklist[item.id],
							onChange: () => boat.toggleCheck(item.id)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-sm", boat.checklist[item.id] ? "text-muted line-through" : "text-fg"),
							children: item.label
						})]
					}) }, item.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 h-12 rounded-md bg-surface-2 px-3 text-sm text-fg",
					onClick: () => boat.resetChecklist(),
					children: "Reset checklist"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
				title: "NWS coastal waters",
				meta: briefStale ? `Stale · ${briefAge ?? "cached"} · ${briefFresh === "missing" ? "No cached brief" : briefFresh}` : displayBrief ? `Official · ${inlet.nwsZoneHint}` : brief.isError ? "No cached brief" : `Official · ${inlet.nwsZoneHint}`,
				defaultOpen: true,
				className: mode !== "leave" ? "hidden" : void 0,
				children: [briefStale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 inline-flex rounded-md bg-fair/20 px-2 py-1 text-xs font-medium text-fair",
					role: "status",
					children: [
						"Last-good brief · ",
						briefAge,
						" · live NWS did not load"
					]
				}) : null, displayBrief?.forecast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-1 max-h-48 overflow-auto rounded-lg bg-surface-2 p-3 text-sm leading-snug whitespace-pre-wrap text-fg",
					children: displayBrief.forecast
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: brief.isError ? "Forecast didn't load and no cached brief is on this phone." : "Reading the coastal waters forecast…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
				title: "Route and fuel",
				meta: boat.waypoints.length >= 2 ? `${route.nm.toFixed(1)} nm` : "No marks",
				className: mode === "fish" ? "hidden" : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Straight lines between marks you drop. There is no depth auto-route. A wrong one would put you on a shoal."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Cruise",
								value: boat.cruiseKt,
								suffix: "kt",
								onChange: (v) => boat.setRule({ cruiseKt: num(v, boat.cruiseKt) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Burn",
								value: boat.burnGph,
								suffix: "gph",
								onChange: (v) => boat.setRule({ burnGph: num(v, boat.burnGph) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Rough",
								value: boat.planningBurnGph,
								suffix: "gph",
								onChange: (v) => boat.setPlanningBurn(num(v, boat.planningBurnGph))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tank",
								value: boat.tankGal,
								suffix: "gal",
								onChange: (v) => boat.setRule({ tankGal: num(v, boat.tankGal) })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-fg",
						children: boat.waypoints.length < 2 ? "Drop at least two marks on the chart." : `${route.nm.toFixed(1)} nm · ${route.hours.toFixed(1)} hr ${route.closed ? "on this loop" : "round trip"} · ${route.gallons.toFixed(1)} gal. ${routeClosedNote(route.closed)}`
					}),
					boat.waypoints.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm font-medium", route.home ? "text-good" : "text-poor"),
						children: route.home ? "Fuel covers the round trip with reserve." : "Round trip is over the usable fuel."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("h-12 rounded-md px-3 text-sm font-medium", boat.markMode ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg"),
								onClick: () => boat.toggleMark(),
								children: boat.markMode ? "Dropping marks" : "Drop marks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-12 rounded-md bg-surface-2 px-3 text-sm text-fg",
								onClick: () => boat.clearWaypoints(),
								children: "Clear marks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("h-12 rounded-md px-3 text-sm font-medium", boat.recording ? "bg-poor text-bg" : "bg-surface-2 text-fg"),
								onClick: () => boat.setRecording(!boat.recording),
								children: boat.recording ? "Stop track" : "Record track"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-12 rounded-md bg-surface-2 px-3 text-sm text-fg",
								onClick: () => boat.clearTrack(),
								children: "Clear track"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-12 rounded-md bg-surface-2 px-3 text-sm text-fg",
								onClick: () => downloadText("fairwater.gpx", toGpx(boat.waypoints, boat.track), "application/gpx+xml"),
								children: "Download GPX"
							})
						]
					}),
					boat.waypoints.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 text-sm text-muted",
						children: boat.waypoints.map((mark) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							mark.name,
							" · ",
							mark.lat.toFixed(3),
							", ",
							mark.lng.toFixed(3)
						] }, mark.id))
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
				title: "NC DMF, live",
				meta: "Proclamations",
				className: mode === "run" ? "hidden" : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Titles from the DMF page. Open the PDF for the limit. This is not a copied size table."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "inline-flex h-12 shrink-0 items-center text-sm text-accent underline",
							href: DMF_PAGE,
							children: "Official page"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 flex flex-col gap-3",
						children: [(displayBrief?.proclamations ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "inline-flex min-h-12 items-center text-sm font-medium text-fg underline",
								href: item.href,
								children: item.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-subtle",
								children: [
									"Issued ",
									item.issued,
									" · ",
									item.effective
								]
							})
						] }, item.id)), (displayBrief?.closures ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "inline-flex min-h-12 items-center text-sm font-medium text-fg underline",
								href: item.href,
								children: [item.id, " · shellfish"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: item.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-subtle",
								children: [
									item.counties,
									" · ",
									item.effective
								]
							})
						] }, item.id))]
					}),
					displayBrief?.errors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fair",
						children: displayBrief.errors.join(" ")
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
				title: "Catch log",
				meta: boat.catches.length ? `${boat.catches.length}` : "Empty",
				className: mode === "run" ? "hidden" : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-1 flex gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							const speciesName = species.trim();
							if (!speciesName) return;
							const mark = boat.track[boat.track.length - 1];
							boat.addCatch({
								species: speciesName,
								at: (/* @__PURE__ */ new Date()).toISOString(),
								lat: mark?.lat ?? inlet.lat,
								lng: mark?.lng ?? inlet.lng,
								tide: flow ? flow.stage : "tide unknown",
								moon: moonInfo(/* @__PURE__ */ new Date()).name
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: species,
							onChange: (event) => setSpecies(event.target.value),
							className: "h-12 min-w-0 flex-1 rounded-md border border-line bg-bg px-3 text-sm text-fg",
							"aria-label": "Species"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "h-12 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg",
							children: "Log"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-col gap-2 text-sm text-muted",
						children: boat.catches.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									defaultValue: entry.species,
									"aria-label": `Edit ${entry.species}`,
									onBlur: (event) => {
										const next = event.target.value.trim();
										if (next && next !== entry.species) boat.updateCatch(entry.id, next);
									},
									className: "h-12 min-w-0 flex-1 rounded-md border border-line bg-bg px-2 text-sm text-fg"
								}, entry.species),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0",
									children: [
										entry.tide,
										" · ",
										clock$1(new Date(entry.at))
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-12 shrink-0 rounded-md bg-surface-2 px-3 text-sm text-fg",
									onClick: () => boat.removeCatch(entry.id),
									children: "Delete"
								})
							]
						}, entry.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 h-12 rounded-md bg-surface-2 px-3 text-sm text-fg",
						onClick: () => downloadText("fairwater-catches.csv", catchesCsv(boat.catches), "text/csv"),
						children: "Download CSV"
					})
				]
			})
		]
	});
}
function Field({ label, value, suffix, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs text-subtle",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mt-1 flex items-center gap-1 rounded-md border border-line bg-bg px-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				inputMode: "decimal",
				defaultValue: value,
				onBlur: (event) => onChange(event.target.value),
				className: "h-12 w-full bg-transparent text-sm text-fg outline-none",
				"aria-label": label
			}, value), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: suffix })]
		})]
	});
}
function Compass({ deg, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 48 48",
			className: "size-12 shrink-0",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r: "17",
					fill: "none",
					className: "stroke-line",
					strokeWidth: "1.5"
				}),
				deg != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M24 9.5 L27.2 24 L24 21.2 L20.8 24 Z",
					className: "fill-accent",
					transform: `rotate(${deg ?? 0} 24 24)`
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r: "1.6",
					className: "fill-fg"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium tracking-wide text-subtle uppercase",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-base font-medium tabular-nums text-fg",
					children: value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-sm text-muted",
					children: hint
				})
			]
		})]
	});
}
function TideChart({ samples, now }) {
	const from = now - 72e5;
	const to = now + 792e5;
	const data = samples.map((s) => ({
		t: new Date(s.time).getTime(),
		height: Number(s.height.toFixed(2))
	})).filter((s) => s.t >= from && s.t <= to);
	if (data.length < 2) return null;
	const ticks = [
		0,
		6,
		12,
		18
	].map((h) => {
		const d = new Date(now);
		d.setHours(h, 0, 0, 0);
		return d.getTime();
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-36 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "t",
						type: "number",
						domain: [from, to],
						ticks,
						tickFormatter: (v) => new Date(v).toLocaleTimeString([], { hour: "numeric" }),
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						hide: true,
						domain: ["dataMin - 0.4", "dataMax + 0.4"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						labelFormatter: (v) => new Date(Number(v)).toLocaleTimeString([], {
							hour: "numeric",
							minute: "2-digit"
						}),
						formatter: (value) => [`${Number(value).toFixed(1)} ft`, "Tide"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						x: now,
						stroke: "var(--color-accent)",
						strokeDasharray: "3 3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "height",
						stroke: "var(--color-nearshore)",
						fill: "var(--color-nearshore)",
						fillOpacity: .22,
						strokeWidth: 2,
						isAnimationActive: false
					})
				]
			})
		})
	});
}
function addDays(offset) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + offset);
	return d;
}
function clock(date) {
	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit"
	});
}
function ConditionsPanel() {
	const groundId = useTrip((s) => s.groundId);
	const dayOffset = useTrip((s) => s.dayOffset);
	const setDayOffset = useTrip((s) => s.setDayOffset);
	const saved = useTrip((s) => s.saved);
	const helmMode = useTrip((s) => s.helmMode);
	const toggleSaved = useTrip((s) => s.toggleSaved);
	const setGround = useTrip((s) => s.setGround);
	const setRegion = useTrip((s) => s.setRegion);
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setLive(true), []);
	const ground = groundById(groundId);
	const stationPick = nearest(ground.lat, ground.lng, TIDE_STATIONS);
	const query = useQuery({
		queryKey: [
			"fairwater",
			ground.id,
			stationPick?.item.id
		],
		enabled: live && !!stationPick,
		staleTime: 3e5,
		refetchInterval: 6e5,
		refetchOnWindowFocus: true,
		queryFn: () => getConditions({ data: {
			lat: ground.lat,
			lng: ground.lng,
			stationId: stationPick.item.id,
			stationName: stationPick.item.name,
			distanceMi: Math.round(stationPick.distanceMi * 10) / 10
		} })
	});
	const view = (0, import_react.useMemo)(() => {
		if (!live || !query.data) return null;
		const day = addDays(dayOffset);
		const previewWindow = bestWindow({
			day,
			exposure: ground.exposure,
			band: ground.band,
			conditions: query.data,
			lat: ground.lat,
			lng: ground.lng
		});
		const when = dayOffset === 0 ? /* @__PURE__ */ new Date() : previewWindow?.start ?? day;
		const score = scoreAt({
			when,
			exposure: ground.exposure,
			band: ground.band,
			conditions: query.data,
			lat: ground.lat,
			lng: ground.lng
		});
		const recommendation = recommendBand({
			when,
			conditions: query.data,
			lat: ground.lat,
			lng: ground.lng
		});
		const marine = snapshotMarine(query.data, when);
		const weather = snapshotWeather(query.data, when);
		const tide = tideAt(query.data.tide, when.getTime());
		const flow = currentAt(query.data.current, when.getTime());
		const windows = solunarWindows(when, ground.lat, ground.lng);
		const active = windowAt(windows, when);
		const upcoming = nextWindow(windows, when);
		const month = when.getMonth() + 1;
		const neighbors = groundsIn(ground.region, "all");
		return {
			when,
			score,
			recommendation,
			marine,
			weather,
			tide,
			flow,
			windows,
			active,
			upcoming,
			month,
			read: fishingRead({
				ground,
				neighbors,
				when,
				score,
				tide,
				seasFt: marine?.waveFt ?? null,
				recommendation,
				window: previewWindow,
				month,
				active
			}),
			previewWindow,
			moon: moonInfo(when)
		};
	}, [
		live,
		query.data,
		dayOffset,
		ground
	]);
	const month = view?.month ?? 0;
	const seasonal = live ? inSeason(ground, month || (/* @__PURE__ */ new Date()).getMonth() + 1) : [];
	const later = ground.species.filter((s) => !seasonal.includes(s));
	const nextExtreme = view && query.data?.tide ? query.data.tide.extremes.find((e) => new Date(e.time).getTime() > view.when.getTime()) : void 0;
	(0, import_react.useEffect)(() => {
		if (!view) return;
		window.dispatchEvent(new CustomEvent("fairwater-bite", { detail: `${view.score.value} · ${view.score.label}` }));
	}, [view]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "safe-bottom flex flex-col gap-5 px-4 py-4 lg:px-5",
		children: [helmMode !== "fish" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CruiseBoard, { mode: helmMode }) : null, helmMode === "fish" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-subtle uppercase",
							children: BAND_LABEL[ground.band]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl leading-tight tracking-tight text-balance text-fg",
							children: ground.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								ground.depth,
								" · ",
								ground.structure
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "quiet",
					size: "sm",
					"aria-pressed": saved.includes(ground.id),
					onClick: () => toggleSaved(ground.id),
					className: "shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", saved.includes(ground.id) && "fill-current") }), saved.includes(ground.id) ? "Saved" : "Save"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				role: "tablist",
				"aria-label": "Day",
				children: [
					0,
					1,
					2
				].map((offset) => {
					const day = addDays(offset);
					const label = offset === 0 ? "Today" : weekday(day);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": dayOffset === offset,
						onClick: () => setDayOffset(offset),
						className: cn("h-12 rounded-md px-3 text-sm font-medium", dayOffset === offset ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
						children: live ? label : offset === 0 ? "Today" : `Day ${offset + 1}`
					}, offset);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-xl bg-surface p-4",
				children: view ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-subtle uppercase",
							children: "Bite"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-5xl leading-none tabular-nums text-fg",
							children: view.score.value
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("text-sm font-medium", view.score.label === "Tough" && "text-poor", view.score.label === "Marginal" && "text-fair", (view.score.label === "Strong" || view.score.label === "Worth going") && "text-good"),
							children: [view.score.label, view.recommendation.band !== ground.band ? ` · better ${BAND_LABEL[view.recommendation.band].toLowerCase()}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base leading-normal text-fg",
						children: view.read
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-1 text-sm text-muted",
						children: view.score.reasons.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: reason }, reason))
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-subtle uppercase",
							children: "Bite"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-muted",
							children: query.isError ? "Conditions didn't load." : "Reading the water…"
						}),
						query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => void query.refetch(),
							children: "Try again"
						}) : null
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
						deg: view?.weather?.windDir ?? null,
						label: "Wind",
						value: view ? mph(view.weather?.windMph) : "—",
						hint: view ? `Forecast · ${compass(view.weather?.windDir)} · gust ${mph(view.weather?.gustMph)}` : "Waiting"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
						deg: view?.flow?.dir ?? null,
						label: "Current",
						value: view?.flow ? view.flow.stage === "slack" ? "Slack" : knots(view.flow.speedKt) : "—",
						hint: query.data?.current ? `${view?.flow?.stage === "flood" ? "Flood" : view?.flow?.stage === "ebb" ? "Ebb" : "Slack"} · ${query.data.current.stationName.split(",")[0]} · ${query.data.current.distanceMi.toFixed(0)} mi` : "No NOAA current station within 40 mi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
						deg: dayOffset === 0 && query.data?.buoy ? query.data.buoy.waveDir : view?.marine?.waveDir ?? null,
						label: "Seas",
						value: dayOffset === 0 && query.data?.buoy ? feet(query.data.buoy.waveFt) : view ? feet(view.marine?.waveFt) : "—",
						hint: dayOffset === 0 && query.data?.buoy ? `NDBC ${query.data.buoy.id} · ${query.data.buoy.distanceMi} mi · ${query.data.buoy.ageMin}m ago` : "Model forecast, not a buoy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
						deg: view?.marine?.swellDir ?? null,
						label: "Swell",
						value: view ? feet(view.marine?.swellFt) : "—",
						hint: view?.marine?.swellPeriodS ? `Model · ${Math.round(view.marine.swellPeriodS)} s from ${compass(view.marine.swellDir)}` : "Model swell"
					})
				]
			}),
			dayOffset === 0 && query.data?.buoy && ground.exposure === "protected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"That wave is NDBC ",
					query.data.buoy.id,
					", ",
					query.data.buoy.distanceMi,
					" miles out in the ocean. It is not the chop inside this sound."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-line p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium text-fg",
							children: "Tide"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-right text-sm text-muted",
							children: query.data?.tide ? `NOAA · MLLW · ${query.data.tide.stationName} · ${query.data.tide.distanceMi.toFixed(0)} mi` : "NOAA prediction"
						})]
					}),
					view?.tide ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-fg",
						children: [
							view.tide.stage === "slack" ? "Slack" : view.tide.stage === "rising" ? "Rising" : "Falling",
							" · ",
							view.tide.height.toFixed(1),
							" ft",
							nextExtreme ? ` · next ${nextExtreme.type === "H" ? "high" : "low"} ${clock(new Date(nextExtreme.time))}` : ""
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Tide curve loads with the station."
					}),
					live && query.data?.tide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TideChart, {
						samples: query.data.tide.samples,
						now: view?.when.getTime() ?? Date.now()
					}) : null,
					query.data?.tide && query.data.tide.distanceMi > 25 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "That station is a ways off. Trust it for the ocean, not a back creek."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface-2 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-subtle uppercase",
							children: "Moon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-base font-medium text-fg",
							children: view ? view.moon.name : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted tabular-nums",
							children: view ? `${Math.round(view.moon.illumination * 100)}% lit` : "Phase"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-surface-2 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-subtle uppercase",
							children: "Water"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-base font-medium tabular-nums text-fg",
							children: view?.marine?.sstF != null ? `${Math.round(view.marine.sstF)}°F` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: view?.weather ? `${sky(view.weather.code)} · ${view.weather.pressureMb ? `${Math.round(view.weather.pressureMb)} mb` : "pressure"}` : "Surface temp"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-medium text-fg",
					children: "Solunar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Major windows are about an hour either side of the moon overhead and underfoot."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 flex flex-col gap-2",
					children: [(view?.windows ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-fg",
							children: [w.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" · ", w.kind]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted",
							children: [
								clock(w.start),
								"–",
								clock(w.end)
							]
						})]
					}, `${w.label}-${w.peak.toISOString()}`)), live && view && view.windows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "No moon window landed on this day."
					}) : null]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-medium text-fg",
					children: "On this ground"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-normal text-muted",
					children: ground.tactic
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "mt-2 inline-flex h-12 items-center rounded-md bg-fair/20 px-3 text-sm font-medium text-fair",
					href: "https://www.deq.nc.gov/about/divisions/marine-fisheries/rules-proclamations-and-size-and-bag-limits/fisheries-management-proclamations",
					children: "Check regs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "A month on this list is not a season. Keep nothing until the proclamation says you can."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 flex flex-col gap-3",
					children: [(live ? seasonal : ground.species).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium text-fg",
						children: [s.name, live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-muted",
							children: "Often this month"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: s.note
					})] }, s.name)), live ? later.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-subtle",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: s.note
					})] }, s.name)) : null]
				})
			] }),
			saved.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-medium text-fg",
				children: "Saved"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-1",
				children: saved.map((id) => {
					const g = groundById(id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "h-11 w-full rounded-md px-2 text-left text-sm text-fg hover:bg-surface-2",
						onClick: () => {
							setRegion(g.region);
							setGround(g.id);
						},
						children: [g.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", BAND_LABEL[g.band]]
						})]
					}) }, id);
				})
			})] }) : null,
			query.data?.errors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fair",
				children: query.data.errors.join(" ")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-normal text-subtle",
				children: "Tides are NOAA predictions at the named station, datum MLLW. Current is the NOAA tidal-current prediction at the named station, which can be miles from the pin. Seas are the nearest NDBC buoy observation. Swell is an ocean model at the pin. Chart is the NOAA ENC. Satellite is a photo with no depths. Hybrid and Fishing draw NOAA depths and markers on a photo or a shaded bottom. None of these is a Garmin chart, and none is a certified navigation product. Check size and bag limits before you keep a fish."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CruiseBoard, { mode: "fish" })
		] }) : null]
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-md border border-line bg-surface-2 px-3 text-sm text-fg", "placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent", className),
		...props
	});
}
var CHART_VIEWS = [
	{
		id: "chart",
		label: "Chart",
		note: "NOAA chart. Depths, contours, and markers."
	},
	{
		id: "satellite",
		label: "Satellite",
		note: "Photo only. No depths and no buoys."
	},
	{
		id: "hybrid",
		label: "Hybrid",
		note: "Photo with NOAA depth numbers and markers on top."
	},
	{
		id: "fishing",
		label: "Fishing",
		note: "Shaded bottom with NOAA depths and markers. Not a Garmin chart."
	}
];
var LAYOUT_KEY = "fairwater-layout";
function readLayout() {
	try {
		const raw = localStorage.getItem(LAYOUT_KEY);
		if (!raw) return {
			panelPx: 448,
			sheet: "peek"
		};
		const parsed = JSON.parse(raw);
		const panelPx = Number(parsed.panelPx);
		return {
			panelPx: Number.isFinite(panelPx) ? Math.min(560, Math.max(320, panelPx)) : 448,
			sheet: parsed.sheet === "peek" ? "peek" : "open"
		};
	} catch {
		return {
			panelPx: 448,
			sheet: "peek"
		};
	}
}
function seasonNames(region, band, month) {
	const names = [];
	for (const ground of groundsIn(region, band)) for (const species of inSeason(ground, month)) {
		if (!names.includes(species.name)) names.push(species.name);
		if (names.length === 3) return names.join(", ");
	}
	return names.join(", ") || "Quiet this month";
}
function Fairwater() {
	const region = useTrip((s) => s.region);
	const band = useTrip((s) => s.band);
	const chartView = useTrip((s) => s.chartView);
	const groundId = useTrip((s) => s.groundId);
	const setGround = useTrip((s) => s.setGround);
	const setRegion = useTrip((s) => s.setRegion);
	const setBand = useTrip((s) => s.setBand);
	const setChartView = useTrip((s) => s.setChartView);
	const helmMode = useTrip((s) => s.helmMode);
	const setHelmMode = useTrip((s) => s.setHelmMode);
	const [query, setQuery] = (0, import_react.useState)("");
	const [geoNote, setGeoNote] = (0, import_react.useState)(null);
	const [live, setLive] = (0, import_react.useState)(false);
	const [panelPx, setPanelPx] = (0, import_react.useState)(448);
	const [sheet, setSheet] = (0, import_react.useState)("peek");
	const [layoutReady, setLayoutReady] = (0, import_react.useState)(false);
	const [gateLabel, setGateLabel] = (0, import_react.useState)(null);
	const [fuelLabel, setFuelLabel] = (0, import_react.useState)(null);
	const [biteLabel, setBiteLabel] = (0, import_react.useState)(null);
	const nightHelm = useBoat((s) => s.nightHelm);
	const setNightHelm = useBoat((s) => s.setNightHelm);
	(0, import_react.useEffect)(() => {
		useBoat.persist.rehydrate();
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("night-helm", nightHelm);
		return () => document.documentElement.classList.remove("night-helm");
	}, [nightHelm]);
	(0, import_react.useEffect)(() => {
		useTrip.persist.rehydrate();
		const saved = readLayout();
		setPanelPx(saved.panelPx);
		setSheet(saved.sheet);
		setLayoutReady(true);
		setLive(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!layoutReady) return;
		localStorage.setItem(LAYOUT_KEY, JSON.stringify({
			panelPx,
			sheet
		}));
	}, [
		layoutReady,
		panelPx,
		sheet
	]);
	(0, import_react.useEffect)(() => {
		if (!layoutReady) return;
		const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
		return () => window.clearTimeout(id);
	}, [layoutReady, sheet]);
	(0, import_react.useLayoutEffect)(() => {
		const onGate = (event) => setGateLabel(String(event.detail));
		const onFuel = (event) => setFuelLabel(String(event.detail));
		const onBite = (event) => setBiteLabel(String(event.detail));
		window.addEventListener("fairwater-gate", onGate);
		window.addEventListener("fairwater-fuel", onFuel);
		window.addEventListener("fairwater-bite", onBite);
		return () => {
			window.removeEventListener("fairwater-gate", onGate);
			window.removeEventListener("fairwater-fuel", onFuel);
			window.removeEventListener("fairwater-bite", onBite);
		};
	}, []);
	const month = live ? (/* @__PURE__ */ new Date()).getMonth() + 1 : 0;
	const hits = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 2) return [];
		return GROUNDS.filter((g) => {
			return `${g.name} ${g.region} ${g.band} ${g.species.map((s) => s.name).join(" ")}`.toLowerCase().includes(q);
		}).slice(0, 7);
	}, [query]);
	function dragPanel(event) {
		event.preventDefault();
		const startX = event.clientX;
		const startW = panelPx;
		function move(ev) {
			setPanelPx(Math.min(560, Math.max(320, startW - (ev.clientX - startX))));
		}
		function up() {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.dispatchEvent(new Event("resize"));
		}
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
	}
	function choose(id, regionId) {
		setRegion(regionId);
		setGround(id);
		setQuery("");
		setGeoNote(null);
	}
	function nearMe() {
		if (!navigator.geolocation) {
			setGeoNote("This browser won't share a location.");
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => {
			const hit = nearest(pos.coords.latitude, pos.coords.longitude, GROUNDS);
			if (!hit) return;
			choose(hit.item.id, hit.item.region);
			setGeoNote(hit.distanceMi > 40 ? `${Math.round(hit.distanceMi)} miles to ${hit.item.name}. You're inland of the fishery.` : null);
		}, () => setGeoNote("Location stayed off. Pick a coast instead."), {
			enableHighAccuracy: false,
			timeout: 8e3
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between px-3 pt-3 sm:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-none tracking-tight",
						children: "Fairwater"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Fishing chart"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-3 py-2 lg:gap-3 lg:px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden shrink-0 sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl leading-none tracking-tight",
								children: "Fairwater"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Fishing chart"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search grounds or fish",
									"aria-label": "Search grounds or fish",
									className: "pr-12 pl-9"
								}),
								query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "absolute top-1/2 right-1 flex size-12 -translate-y-1/2 items-center justify-center text-muted",
									onClick: () => setQuery(""),
									"aria-label": "Clear search",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								}) : null,
								hits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-none",
									children: hits.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "flex min-h-12 w-full items-center justify-between gap-3 px-3 text-left text-sm hover:bg-surface-2",
										onClick: () => choose(g.id, g.region),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-fg",
											children: g.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-muted",
											children: BAND_LABEL[g.band]
										})]
									}) }, g.id))
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "quiet",
							onClick: () => setNightHelm(!nightHelm),
							"aria-label": nightHelm ? "Day UI" : "Night helm UI",
							"aria-pressed": nightHelm,
							children: [nightHelm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: nightHelm ? "Day" : "Night"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "quiet",
							onClick: nearMe,
							"aria-label": "Use my location",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: "Near me"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto border-b border-line px-3 py-2",
				role: "tablist",
				"aria-label": "Coast",
				children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": region === r.id,
					onClick: () => {
						setRegion(r.id);
						const current = GROUNDS.find((g) => g.id === groundId);
						if (!current || current.region !== r.id) {
							const next = groundsIn(r.id, "all")[0];
							if (next) setGround(next.id);
						}
					},
					className: cn("h-12 shrink-0 rounded-md px-3 text-sm font-medium", region === r.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2"),
					children: r.label
				}, r.id))
			}),
			geoNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-line px-4 py-2 text-sm text-muted",
				children: geoNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2 border-b border-line px-3 py-2",
				role: "tablist",
				"aria-label": "Helm mode",
				children: [
					["leave", "Leave"],
					["run", "Run"],
					["fish", "Fish"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": helmMode === id,
					onClick: () => {
						setHelmMode(id);
						setSheet(id === "run" ? "peek" : "open");
					},
					className: cn("h-12 rounded-md text-sm font-medium", helmMode === id ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 flex-1 flex-col lg:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 flex-1 flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2 border-b border-line px-3 py-2",
								children: [
									"inshore",
									"nearshore",
									"offshore"
								].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										const next = band === b ? "all" : b;
										setBand(next);
										if (next === "all") return;
										const current = GROUNDS.find((g) => g.id === groundId);
										if (!current || current.band !== next) {
											const pick = groundsIn(region, next)[0];
											if (pick) setGround(pick.id);
										}
									},
									className: cn("min-h-12 rounded-lg border px-2 py-1.5 text-left", band === b ? "border-accent bg-surface-2" : "border-line bg-bg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs font-medium tracking-wide text-subtle uppercase",
										children: BAND_LABEL[b]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm text-fg",
										children: live && month ? seasonNames(region, b, month) : BAND_BLURB[b]
									})]
								}, b))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2 overflow-x-auto border-b border-line px-3 py-2",
								role: "tablist",
								"aria-label": "Map view",
								children: CHART_VIEWS.map((view) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": chartView === view.id,
									onClick: () => setChartView(view.id),
									className: cn("h-12 shrink-0 rounded-md px-3 text-sm font-medium", chartView === view.id ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2"),
									children: view.label
								}, view.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "border-b border-line px-3 py-1.5 text-xs text-muted",
								children: CHART_VIEWS.find((view) => view.id === chartView)?.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative min-h-0 flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FishingMap, {
									region,
									band,
									selectedId: groundId,
									chartView,
									helmMode,
									onSelect: (id) => {
										const g = GROUNDS.find((item) => item.id === id);
										if (g) choose(g.id, g.region);
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "border-t border-line px-3 py-1.5 text-xs text-muted",
								children: "Advisory only — not a chartplotter. Confirm with NOAA charts / Coast Pilot / your eyes."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "separator",
						"aria-orientation": "vertical",
						"aria-valuemin": 320,
						"aria-valuemax": 560,
						"aria-valuenow": panelPx,
						tabIndex: 0,
						onPointerDown: dragPanel,
						onKeyDown: (event) => {
							if (event.key === "ArrowLeft") setPanelPx((width) => Math.min(560, width + 24));
							if (event.key === "ArrowRight") setPanelPx((width) => Math.max(320, width - 24));
						},
						className: "hidden w-3 shrink-0 cursor-col-resize items-center justify-center border-line lg:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-12 w-1 rounded-full bg-line" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						style: { "--panel": `${panelPx}px` },
						className: cn("flex min-h-0 flex-col border-line bg-bg", sheet === "open" ? "max-lg:min-h-0 max-lg:flex-1 max-lg:border-t" : "max-lg:shrink-0 max-lg:border-t", "lg:h-auto lg:w-[var(--panel)] lg:flex-none lg:border-l"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-h-16 w-full flex-col items-center justify-center px-4 py-2 lg:hidden",
							"aria-expanded": sheet === "open",
							onClick: () => setSheet((value) => value === "open" ? "peek" : "open"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mb-1 h-1 w-10 rounded-full bg-line" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex w-full items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium text-fg",
										children: gateLabel ?? groundById(groundId).name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-sm text-muted",
										children: sheet === "open" ? "Show chart" : "Open"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 w-full truncate text-left text-xs text-muted",
									children: [
										fuelLabel ?? "Fuel",
										" · ",
										biteLabel ?? "Bite"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("min-h-0 flex-1 overflow-y-auto", sheet === "peek" && "max-lg:hidden"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionsPanel, {})
						})]
					})
				]
			})
		]
	});
}
function FairwaterApp() {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		retry: 1,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fairwater, {})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FairwaterApp, {});
}
//#endregion
export { Home as component };
