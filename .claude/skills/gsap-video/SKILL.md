---
name: gsap-video
description: Animate with GSAP (timelines, SplitText, DrawSVG, MorphSVG, MotionPath, Flip, ScrambleText, CustomEase) inside a video composition, frame-accurately. Use when a scene needs text splitting, SVG drawing or morphing, path travel or complex staggers.
---

# GSAP in videos

- Always through `useGsapTimeline(ref, t, tl => { ... })` (`src/video/gsap/useGsapTimeline.ts`): a **paused** timeline seeked to the frame time. Never `gsap.to()` at top level or a playing timeline.
- Position parameter = absolute seconds in the video (`tl.from('.x', {...}, 2.35)`), set from word timestamps.
- Recipes per plugin: `catalog/gsap.json` (`npm run find -- --source gsap`). Cheat sheet and do/don't: `docs/gsap.md`. Exact option types: `node_modules/gsap/types/`.
- Example: `src/compositions/GsapDemo.tsx`. Verify with `npm run still -- gsap-demo 16:9 0.5 1.5 3`.
- Don't use ScrollTrigger / Observer / Draggable in videos. No unseeded randomness.
