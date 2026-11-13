---
name: video-components
description: Build a motion-graphics video from Andrew's component library (React + GSAP + Kokonut UI + 21st.dev), following our video rules, and render it to MP4. Use for any new video, ad, explainer, VSL overlay, training video or animated scene, or when someone asks "do we have a component for X".
---

# Video components

1. **Read the rules**: `docs/video-rules.md` (formats, safe areas, faces, captions, sound, claims). Brand colours/type come from the brand's guide.
2. **Find before you build**: `npm run find -- <need>` (e.g. `captions`, `counter`, `typing`, `background`, `button`). Order of preference:
   ours (`src/video`) → GSAP recipe (`catalog/gsap.json`) → Kokonut (`npx shadcn@latest add @kokonutui/<name>`) → 21st (MCP `search`, then `npm run save:21st`).
3. **Compose**: copy `src/compositions/Showcase.tsx` (deterministic) or `KokonutDemo.tsx` (`clock: true` for real-time components). Register it in `src/compositions/index.ts`. Place every beat on a word time.
4. **Check**: `npm run still -- <id> <fmt> <t...>` and look at the PNGs (safe area, faces, readability, cursor not over CTA).
5. **Render**: `npm run shoot -- <id> <fmt> out/<name>.mp4 --audio mix.wav` (mix at −14 LUFS).
6. **Grow the library**: anything reusable you built goes into `src/video/components/` + an entry in `catalog/ours.json`. Saved 21st components go through `npm run save:21st`.

Details: `docs/render-pipeline.md`, `docs/gsap.md`, `docs/kokonut.md`, `docs/21st.md`.
