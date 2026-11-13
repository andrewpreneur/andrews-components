# Video rules (animations, motion, layout, sound)

These are the rules for every video we make. They come from Andrew's feedback and the SaaSSuite style system in
`andrewpreneur/content-management` (`.claude/skills/saassuite-motion/SKILL.md`, `docs/ai-video-rules.md`, `docs/brand.md`).
When a rule here and a brand's own style guide disagree, the brand guide wins for colours and type; everything else here holds.

## 1. How a video is built
- **Deterministic frames.** A composition draws frame `t` from the time alone (`useTime()`). No CSS transitions, `setTimeout`, `Date` or free-running GSAP. Same `t` → same pixels. Render with `npm run shoot`.
- **Real-time components (Kokonut, 21st, canvas)** are allowed as is. Flag the composition `clock: true`; the shooter steps the browser clock one frame at a time. Do not hand-edit them to be deterministic unless they misbehave.
- **Use what exists first.** `npm run find -- <what you need>` searches ours → GSAP recipes → Kokonut → saved 21st. Only build new when nothing fits; then add it to `src/video/components/` and `catalog/ours.json`.
- **Measured motion only.** Use the curves in `src/video/motion.ts` (measured from reference videos, SSIM 0.91–0.99) or GSAP eases. Don't invent new spring numbers.
- **Words drive timing.** Get word timestamps (ElevenLabs Scribe for real voice, TTS `with-timestamps` for narration) and place every beat on a word.

## 2. Formats and safe areas
- 16:9 1920×1080, 9:16 1080×1920, 4:5 1080×1350, 3:4 1080×1440, 1:1. Build at native pixels (`<Stage format>`).
- **9:16:** key text inside the middle 4:5 band (y 285–1635), because Meta crops to 4:5 in feed. Use `<Stage guides>`.
- **16:9:** fill the frame. Panels/UI scaled 1.2–1.8× or laid out in two columns; a 1080-wide design centred in 1920 reads as dead space and tiny text at feed size.
- **MSM (med spa) videos: horizontal only.** No 9:16 unless asked.
- Captions never cut off at the edges; nothing important off-frame; cursor never sits over CTA text (park on the button's edge, fade before the final hold).

## 3. Look
- One accent colour per video, one accent word per headline. Headline Inter Display 800, letter-spacing −0.037em; body Inter 400/600.
- UI is **rebuilt** as clean floating cards (no device frames unless the story needs a phone). Show the product big and readable.
- Busyness: one headline + one card most of the time; one busy moment per video. Vary scene designs (don't repeat headline+card for every beat).
- Transitions: morph inside a scene, clean cut on the beat between chapters. Dark end card with wordmark + CTA pill.
- **Full captions on every video with voice** (2–4 word phrases, active word in the accent).

## 4. Faces and photos of Andrew
- Never put text or graphics over the face. Measure the head box (content-management `tools/face_zone.py`) and keep everything outside head + 40 px.
- Only **posed** photos of Andrew, never a mid-sentence frame.
- No 100% AI talking head of Andrew. Allowed AI: extra angles, filler/extensions, background/outfit swaps, and the half-screen format (AI Andrew ≤50% of frame). Full rules: content-management `docs/ai-video-rules.md`.

## 5. Sound
- Never filter, denoise or compress Andrew's voice. Cut retakes from an ElevenLabs Scribe transcript, cutting video and audio on the same spans.
- Music well under the voice (bed ~9 dB lower, sidechain duck). One soft SFX per cue (whoosh on cuts, click/pop on UI, ding on checks). No hard slams.
- Master −14 LUFS, true peak ≤ −1.5 dB.

## 6. Claims and brands
- On-screen words come from the speaker or the brief. No invented numbers; flag unverified claims.
- Never use another company's logo or make our work look like their official product/support (e.g. no HighLevel logo on YourGHLSupport ads).
- Nothing is posted without Andrew's approval.

## 7. QA before handing over
- Stills at every scene (`npm run still -- <id> <fmt> t1 t2 ...`) or a contact sheet of the MP4.
- Check: text readable at phone size, safe area, no face overlap, captions in sync, one accent per frame, loudness.
