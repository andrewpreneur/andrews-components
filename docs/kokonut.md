# Kokonut UI

Free, open-source React components (Tailwind + Motion + shadcn/ui): AI chat UI, buttons, cards, inputs, text effects,
animated backgrounds. Registry `@kokonutui` is set in `components.json`. Full list (126): `catalog/kokonut.json`
(refresh: `npm run catalog:kokonut`), or https://kokonutui.com/llms.txt. Items marked `pro` need Kokonut UI Pro (we don't have it).

## Use one
```bash
npm run find -- loading --source kokonut          # pick
npx shadcn@latest add @kokonutui/<name>           # install → src/components/kokonutui/<name>.tsx (+ deps)
```
- Install with the shadcn CLI, never by pasting code. Installed files are project code: edit them in place.
- Read any component's docs + full source as Markdown: add `.md` to its docs URL (in the catalog `docs` field).
- In a video they run on real time → put them in a composition flagged `clock: true` (see `src/compositions/KokonutDemo.tsx`).
  Turn off cursor interaction (`interactive={false}`) and anything that waits for hover/click, or drive it with props on a timer.
- Installed now: `ai-text-loading`, `background-paths`.
