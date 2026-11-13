#!/usr/bin/env node
// Screenshot stills of a composition for QA:  npm run still -- <compId> <fmt> 1.5 3 6.2   -> out/stills/<id>-<fmt>-<t>.png
// Uses the dev build via `vite preview` like shoot.mjs.
import { spawn, execSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
const [id, fmt = '16:9', ...ts] = process.argv.slice(2)
const SIZE = { '16:9': [1920, 1080], '9:16': [1080, 1920], '4:5': [1080, 1350], '3:4': [1080, 1440], '1:1': [1080, 1080] }[fmt]
execSync('npx vite build --logLevel error', { stdio: 'inherit' })
const srv = spawn('npx', ['vite', 'preview', '--port', '4178', '--strictPort'], { stdio: 'ignore' }); await new Promise(r => setTimeout(r, 2500))
try {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: SIZE[0], height: SIZE[1] } }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(`http://localhost:4178/?comp=${id}&fmt=${encodeURIComponent(fmt)}`); await p.waitForFunction(() => window.READY)
  mkdirSync('out/stills', { recursive: true })
  for (const t of ts) { await p.evaluate(x => window.render(+x), t); const f = `out/stills/${id}-${fmt.replace(':', 'x')}-${t}.png`; await p.screenshot({ path: f }); console.log(f) }
  if (errs.length) console.error('page errors:', errs); await b.close()
} finally { srv.kill() }
