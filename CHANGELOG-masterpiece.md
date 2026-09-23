# Fairwater masterpiece changelog

Extended the existing app. Did not scaffold a new one.

- `src/lib/marine/inlets.ts` — Beaufort, Bogue, Masonboro, Cape Fear, Lockwoods Folly, Little River, plus 70 West, Coral Bay, and Sloop Point.
- `src/lib/marine/shoal.ts` — draft plus 1 ft margin against a chart sounding and the NOAA tide. Unknown when either number is missing.
- `src/lib/marine/gpx.ts` — GPX 1.1 and catch CSV downloads.
- `src/lib/marine/freshness.ts` — under 1 hour, 1–6 hours, older than 6 hours, or missing.
- `src/lib/marine/brief.ts` — NWS zone follows the inlet (MHX or ILM). Last-good brief kept.
- `src/lib/marine/gate.ts` — ebb line names the inlet you picked. AMZ158 gale wording unchanged.
- `src/lib/marine/grounds.ts` — Radio Island, Cape Fear approaches, Lockwoods Folly, Little River, Myrtle reefs.
- `src/lib/marine/stations.ts` — harmonic stations for the southern inlets.
- `src/store/boat.ts` — Sportsman 262 kept. Added planning burn, home marina, active inlet, shoal depth, range-ring toggle. Closed mark loops are not doubled. Version 3 migrate.
- `src/store/trip.ts` — Leave / Run / Fish. Stopped forcing Beaufort on every reload. Removed the unused chart toggle.
- `src/components/fairwater/cruise.tsx` — inlet and home controls, 40 out / 80 RT, run-home time, sandbar card, offline conditions badge, GPX, catch edit/delete/CSV.
- `src/components/fairwater/map.tsx` — home and inlet pins, usable / 40 nm / reserve rings in Run.
- `src/components/fairwater/app.tsx` — mode switch, chart disclaimer, peek line for gate, fuel, and bite.
- `src/components/fairwater/panel.tsx` — Fish mode bite and a Check regs link. A month on the list is not a season.
- `src/styles.css` — night helm dims the chart tiles.

Screenshots: `screenshots/masterpiece-desktop-leave.png`, `masterpiece-desktop-run.png`, `masterpiece-desktop-fish.png`, `masterpiece-desktop-night.png`, and the matching `masterpiece-mobile-*` files.

Fuel check: 80 nm at 28 kt is 2.86 hr, times 15 gph is 43 gal. Usable fuel is 127.5 gal. Home is OK.
