# Render pipeline

```
composition (React, reads useTime) ──vite build──▶ dist/ ──vite preview──▶ Playwright (N workers)
   ?comp=<id>&fmt=<fmt>   window.render(t) or browser clock step   ──▶ JPEG frames ──▶ ffmpeg H.264 (+ audio) ──▶ out/<id>-<fmt>.mp4
```
- `npm run shoot -- <id> <fmt> [out.mp4] [--fps 30] [--workers 4] [--audio mix.wav]`
- `npm run still -- <id> <fmt> 1.2 4.4 8.0` → `out/stills/` for QA.
- Gallery with scrubber and safe-area guides: `npm run dev` → http://localhost:5173.
- Audio: mix outside (ElevenLabs music/TTS, SFX from content-management `vendor/motion-graphics/skills/sound-effects/sfx/`), loudnorm −14 LUFS, pass with `--audio`.
- Cloud sessions: Chromium + Playwright are preinstalled (`require('playwright')`). Disk is tight; `out/` is git-ignored, upload finished MP4s to Drive (content-management `tools/drive_upload.py`).
