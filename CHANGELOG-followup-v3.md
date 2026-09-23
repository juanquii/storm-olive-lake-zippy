# Fairwater follow-up v3

Patched the existing app. Typecheck exits 0.

- `src/components/fairwater/app.tsx` — saved sheet is applied first. Trip rehydrate no longer uses `.then` on a void, and it does not force the sheet open. Leave still opens the sheet when you tap Leave. Panel scroll resets on mode change. Open sheet keeps a 180px map. Run shows an Advisory fuel strip.
- `src/lib/marine/gpx.ts` — names with `&` and `<` export as `&` and `<`. GPX import reads marks and track.
- `src/components/fairwater/cruise.tsx` — last gate is shown for the same inlet when the feed is down. Checking… while the first pull is in flight. Ready for sea row. Now / +6h / Tomorrow only when that hour exists in the feed. Checklist names the inlet’s NWS zone. Retry feeds. No home marina option. Conflict chip when buoy and model wind disagree.
- `src/lib/marine/brief.ts` — shellfish counties follow the inlet (Carteret/Onslow stay on Beaufort and Bogue; south adds New Hanover, Brunswick, Horry).
- `src/store/boat.ts` — checklist no longer hard-codes AMZ158. Home marina can be cleared.
- `src/components/fairwater/map.tsx` — Mark and Record on the chart in Run. Advisories chip. Long-press distance to home and the inlet. Draft-danger circle on Hybrid and Fishing only.
- `src/components/fairwater/tide-chart.tsx` — chart waits until the box has a size, so mode switches do not mount a 0×0 plot.
- `src/components/fairwater/panel.tsx` — Best window, amber Legal to keep? chip, tappable bite score. Saved rows are 48px tall.

Screenshots: `screenshots/followup-v3-desktop-leave.png`, `followup-v3-desktop-run.png`, `followup-v3-desktop-fish.png`, `followup-v3-desktop-night.png`, and the matching `followup-v3-mobile-*` files.
