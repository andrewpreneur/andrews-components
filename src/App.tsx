// Two modes:
//  /?comp=<id>&fmt=16:9   render mode for tools/shoot.mjs: one Stage at native size, window.render(t) draws frame t.
//  /                      gallery: every composition with a scrubber.
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { COMPOSITIONS } from '@/compositions'
import { Stage, TimeProvider, FORMATS, type Format } from '@/video/time'

declare global { interface Window { render?: (t: number) => void; DUR?: number; READY?: boolean; CLOCK?: boolean } }

function RenderMode({ id, fmt }: { id: string; fmt: Format }) {
  const c = COMPOSITIONS.find(x => x.id === id); const [t, setT] = useState(0)
  useEffect(() => { if (!c) return; window.DUR = c.dur; window.CLOCK = !!c.clock; window.render = (x: number) => flushSync(() => setT(x)); document.fonts.ready.then(() => { window.READY = true }) }, [c])
  if (!c) return <div>Unknown composition {id}</div>
  return <TimeProvider t={t}><Stage format={fmt} bg={c.bg}><c.Component format={fmt} /></Stage></TimeProvider>
}

function Gallery() {
  const [sel, setSel] = useState(COMPOSITIONS[0].id); const [fmt, setFmt] = useState<Format>('16:9'); const [t, setT] = useState(0); const [play, setPlay] = useState(false); const [guides, setGuides] = useState(true)
  const c = COMPOSITIONS.find(x => x.id === sel)!; const { w, h } = FORMATS[fmt]; const scale = Math.min(900 / w, 620 / h)
  useEffect(() => { if (!play) return; let raf = 0; const st = performance.now() - t * 1000; const loop = () => { const x = (performance.now() - st) / 1000; setT(x % c.dur); raf = requestAnimationFrame(loop) }; raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf) }, [play, c.dur]) // eslint-disable-line
  return (
    <div className="min-h-screen bg-neutral-100 p-6 font-sans text-neutral-900">
      <h1 className="text-2xl font-bold">Andrew's components</h1>
      <p className="text-neutral-500">Video compositions. Render one: <code>npm run shoot -- {sel} {fmt}</code></p>
      <div className="mt-4 flex flex-wrap gap-2">{COMPOSITIONS.map(x => <button key={x.id} onClick={() => { setSel(x.id); setT(0) }} className={`rounded-full px-4 py-2 text-sm ${x.id === sel ? 'bg-neutral-900 text-white' : 'bg-white'}`}>{x.title}</button>)}</div>
      <div className="mt-3 flex items-center gap-3 text-sm">{c.formats.map(f => <button key={f} onClick={() => setFmt(f)} className={`rounded px-3 py-1 ${f === fmt ? 'bg-violet-600 text-white' : 'bg-white'}`}>{f}</button>)}<label className="ml-4"><input type="checkbox" checked={guides} onChange={e => setGuides(e.target.checked)} /> safe area</label></div>
      <div className="mt-4" style={{ width: w * scale, height: h * scale }}><div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}><TimeProvider t={t}><Stage format={fmt} bg={c.bg} guides={guides}><c.Component format={fmt} /></Stage></TimeProvider></div></div>
      <div className="mt-3 flex items-center gap-3" style={{ width: 900 }}><button onClick={() => setPlay(p => !p)} className="rounded bg-neutral-900 px-4 py-1 text-white">{play ? 'Pause' : 'Play'}</button><input type="range" min={0} max={c.dur} step={1 / 30} value={t} onChange={e => { setPlay(false); setT(+e.target.value) }} className="flex-1" /><span className="w-16 font-mono text-sm">{t.toFixed(2)}s</span></div>
    </div>
  )
}

export default function App() {
  const q = new URLSearchParams(location.search); const id = q.get('comp')
  return id ? <RenderMode id={id} fmt={(q.get('fmt') || '16:9') as Format} /> : <Gallery />
}
