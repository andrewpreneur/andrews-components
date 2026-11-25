---
name: watermelon-ui
description: Find, read and install Watermelon UI components, animated components and page blocks (heroes, CTAs, FAQs, pricing, bento, dashboards) in this repo. Use when a page section or a polished UI block is needed, before building one from scratch.
---

# Watermelon UI

- Search: `npm run find -- <need> --source watermelon` (849 entries in `catalog/watermelon.json`). Or the `watermelon` MCP server (`search`, `get_inspiration`, `get_component`, `compose_page`; no key).
- Read the source first: each result's `source:` path is in `vendor/watermelon-platform/` (read-only copy; never import from `vendor/`).
- Install: `npx shadcn@latest add @watermelon/<slug>`, then move the files into `src/components/watermelon/` and fix the `logo-icon` import. Don't let it overwrite `src/components/ui/button.tsx`.
- Blocks come with placeholder brand, copy and stock images: swap in the client's.
- Videos: real-time motion, so composition `clock: true`.
- Full notes: `docs/watermelon.md`. Refresh vendored source + catalog: `npm run vendor:sync`.
