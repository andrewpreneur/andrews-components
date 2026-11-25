# Watermelon UI

Free, open-source (MIT) React + Tailwind + Motion library: 516 component variants, 131 animated components, 189 page
blocks (heroes, CTAs, FAQs, pricing, bento...), dashboards and a template. Site: https://ui.watermelon.sh

## Where it lives here
- `catalog/watermelon.json`: all 849 entries, searchable with `npm run find -- <need> --source watermelon`.
- `vendor/watermelon-platform/`: a copy of the source from https://github.com/WatermelonCorp/watermelon-platform
  (commit in `vendor/SOURCES.json`). Each catalog entry's `source` line points at its file there. Read-only reference.
- `src/components/watermelon/`: the ones we have installed (now: `hero-18`, `hero-22`).
- MCP server `watermelon` in `.mcp.json` (no key): `search`, `get_inspiration`, `get_component`, `compose_page`.

## Use one
```bash
npm run find -- hero serif --source watermelon     # pick (prints install command + vendored source path)
npx shadcn@latest add @watermelon/<slug>           # install (same as the registry.watermelon.sh/r/<slug>.json URL)
```
- The CLI drops files in `src/components/ui/` and `src/assets/`; move them to `src/components/watermelon/` and fix the
  `logo-icon` import. Say **no** if it asks to overwrite `button.tsx` (ours is the Base UI one).
- Blocks ship with placeholder brand, copy and Unsplash images: replace all three.
- In a video they run on real time: composition `clock: true`.

## Refresh
`npm run vendor:sync` re-clones Watermelon and Kokonut, replaces `vendor/` and rewrites `catalog/watermelon.json`.
