# andrews-components: operating rules

Andrew George's library of React components, animation tools and rules for making videos faster and better.
It pairs with `andrewpreneur/content-management` (the content engine), which makes and posts the videos.

## Start here
- Video rules (non-negotiable): `docs/video-rules.md`.
- Find anything: `npm run find -- <what you need>` (searches `catalog/*.json`: ours, GSAP, Kokonut, saved 21st).
- Skills: `video-components` (entry point), `gsap-video`, `kokonut-ui`, `21st-dev` in `.claude/skills/`.
- Render: `npm run shoot -- <compId> <fmt>`; stills: `npm run still -- <compId> <fmt> t...`; gallery: `npm run dev`.

## Repo map
- `src/video/` our deterministic video kit: `motion.ts` (measured curves), `time.tsx` (Stage, useTime, Sequence), `components/` (LetterRise, WordRise, Stamp, CardSlide, Typer, PressButton, Cursor, CountBar, Strike, Rise, Captions, EndCard), `gsap/useGsapTimeline.ts`.
- `src/compositions/` renderable videos (registry `index.ts`). `src/components/kokonutui/`, `src/components/21st/`, `src/components/ui/` installed third-party components.
- `catalog/` searchable index. `docs/` rules and how-tos. `tools/` shoot, still, find, kokonut-sync, save-21st.

## Rules for agents
- Use live libraries as they are (GSAP, Kokonut, 21st). Don't rebuild a component that exists; install it.
- Every new reusable piece goes in `src/video/components/` with a `catalog/ours.json` entry. Keep the catalog true.
- Videos must render deterministically (`useTime`) or be flagged `clock: true`.
- Secrets: the 21st key lives only in the env var `API_KEY_21ST`. Never write it into files, commits, or logs.
- Before pushing: `npm run typecheck` and `npx vite build` pass, and a still of anything you changed looks right.

# Kokonut UI

This project installs components from Kokonut UI, a shadcn/ui registry.
The registry is set in components.json as "@kokonutui".

- Before building an animated or interactive component from scratch, check
  Kokonut UI: https://kokonutui.com/llms.txt lists every component with a
  one-line description.
- Install with the shadcn CLI, never by pasting code:
  npx shadcn@latest add @kokonutui/<name>
  It writes components/kokonutui/<name>.tsx and installs its dependencies.
- Installed components are project code. Edit them in place rather than
  wrapping them.
- Any docs page is available as Markdown, with the full source, by adding
  .md to its URL, e.g. https://kokonutui.com/docs/buttons/particle-button.md
