# Andrew's components

Pre-made React components, animation tools and rules for making our videos faster and doing more with them.

| Source | What | How we use it |
|---|---|---|
| **Ours** (`src/video`) | Measured motion curves + video components (headlines, cards, stamps, typing, cursor, counters, captions, end card) | Deterministic, frame-accurate |
| **GSAP 3.15** (all plugins) | Animation framework: timelines, SplitText, DrawSVG, MorphSVG, MotionPath, Flip | Paused timeline seeked per frame (`useGsapTimeline`) |
| **Kokonut UI** (`@kokonutui`) | 126 animated React components (AI UI, buttons, cards, text, backgrounds) | `npx shadcn@latest add @kokonutui/<name>`, used as is |
| **21st.dev** (MCP) | Huge component catalog + video blocks | MCP search → `npm run save:21st` |

## Quick start
```bash
npm install
npm run dev                                   # gallery with scrubber + safe-area guides
npm run find -- captions                      # search every component we have
npm run still -- showcase 9:16 1 4 8          # QA stills → out/stills
npm run shoot -- showcase 16:9 out/demo.mp4   # render MP4 (Playwright + ffmpeg)
```
21st.dev MCP: set `API_KEY_21ST` in your shell (never commit it). `.mcp.json` already has the `21st` and `shadcn` servers.

## Read next
`docs/video-rules.md` (rules) · `docs/render-pipeline.md` · `docs/gsap.md` · `docs/kokonut.md` · `docs/21st.md` · `CLAUDE.md` (agents)
