---
name: kokonut-ui
description: Find, install and use Kokonut UI components (AI chat UI, buttons, cards, inputs, text effects, animated backgrounds) in this repo, including inside videos. Use before building any animated or interactive UI component from scratch.
---

# Kokonut UI

- Search: `npm run find -- <need> --source kokonut --free` (catalog of 126 in `catalog/kokonut.json`; refresh `npm run catalog:kokonut`). Or read https://kokonutui.com/llms.txt.
- Read a component's docs + source: its `docs` URL (already `.md`).
- Install: `npx shadcn@latest add @kokonutui/<name>` → `src/components/kokonutui/<name>.tsx`. Never paste code. Edit installed files in place.
- shadcn MCP (`.mcp.json` → `shadcn`) can also browse/install from the `@kokonutui` registry.
- Videos: Kokonut animates on real time → composition `clock: true` (see `src/compositions/KokonutDemo.tsx`); disable hover/cursor interaction.
- `[PRO]` items need Kokonut UI Pro (not owned): skip them.
