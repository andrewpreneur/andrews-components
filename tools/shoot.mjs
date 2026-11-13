#!/usr/bin/env node
// Render a composition to MP4, frame by frame (deterministic).
//   npm run shoot -- <compId> [16:9|9:16|4:5|3:4|1:1] [out.mp4] [--fps 30] [--workers 4] [--audio mix.wav]
// Builds the app, serves dist/ with `vite preview`, opens ?comp=<id>&fmt=<fmt>, calls window.render(i/fps), screenshots, encodes with ffmpeg.
// Needs: playwright (preinstalled in cloud sessions) + ffmpeg.
import { spawn, execSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const args = process.argv.slice(2); const flag = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v }
const fps = +flag('--fps', 30), workers = +flag('--workers', 4), audio = flag('--audio', null), port = +flag('--port', 4179)
const [id, fmt = '16:9', out = `out/${id}-${fmt.replace(':', 'x')}.mp4`] = args
if (!id) { console.error('usage: npm run shoot -- <compId> [fmt] [out.mp4]'); process.exit(1) }
const SIZE = { '16:9': [1920, 1080], '9:16': [1080, 1920], '4:5': [1080, 1350], '3:4': [1080, 1440], '1:1': [1080, 1080] }[fmt]

execSync('npx vite build --logLevel error', { stdio: 'inherit' })
const srv = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))
const url = `http://localhost:${port}/?comp=${encodeURIComponent(id)}&fmt=${encodeURIComponent(fmt)}`
const dir = `out/.frames-${id}-${fmt.replace(':', 'x')}`; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true })
try {
  const b = await chromium.launch()
  const probe = await b.newPage({ viewport: { width: SIZE[0], height: SIZE[1] } }); await probe.goto(url); await probe.waitForFunction(() => window.READY)
  const { dur, clock } = await probe.evaluate(() => ({ dur: window.DUR, clock: window.CLOCK })); await probe.close()
  const N = Math.round(dur * fps), q = Math.ceil(N / workers), dt = 1000 / fps
  await Promise.all([...Array(workers)].map(async (_, k) => {
    const p = await b.newPage({ viewport: { width: SIZE[0], height: SIZE[1] } })
    if (clock) await p.clock.install({ time: 0 }) // own Date/performance.now/rAF/timers: real-time components advance only when we say
    await p.goto(url); if (clock) await p.clock.runFor(50); await p.waitForFunction(() => window.READY)
    if (clock && k * q > 0) await p.clock.runFor(k * q * dt) // fast-forward this worker to its first frame
    for (let i = k * q; i < Math.min(N, (k + 1) * q); i++) { if (clock) { if (i > k * q) await p.clock.runFor(dt) } else await p.evaluate(t => window.render(t), i / fps); await p.screenshot({ path: `${dir}/${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 93, clip: { x: 0, y: 0, width: SIZE[0], height: SIZE[1] } }) }
    await p.close()
  }))
  await b.close()
  mkdirSync(out.split('/').slice(0, -1).join('/') || '.', { recursive: true })
  execSync(`ffmpeg -loglevel error -y -framerate ${fps} -i ${dir}/%05d.jpg ${audio ? `-i ${audio} -c:a aac -b:a 192k -shortest` : ''} -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart ${out}`, { stdio: 'inherit' })
  console.log(`wrote ${out} (${N} frames, ${dur}s @ ${fps}fps)`)
} finally { srv.kill(); rmSync(dir, { recursive: true, force: true }) }
