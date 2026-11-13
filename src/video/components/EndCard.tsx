// Dark end card: wordmark rises, CTA pill stamps in, cursor parks on the pill's EDGE (never over the text) and fades.
import type { ReactNode } from 'react'
import { useTime } from '../time'
import * as M from '../motion'
import { Cursor } from './primitives'

export function EndCard({ t0, wordmark, sub, cta, w, h, bg = '#0B0B10', accent = '#7B5CFF', ctaColor = '#fff' }: { t0: number; wordmark: ReactNode; sub?: ReactNode; cta: string; w: number; h: number; bg?: string; accent?: string; ctaColor?: string }) {
  const t = useTime(); if (t < t0) return null
  const a = M.rise(t, t0, 50), b = M.rise(t, t0 + 0.25, 30), s = M.stamp(t, t0 + 0.7)
  const cy = h / 2, pillW = Math.min(w * 0.8, cta.length * 24 + 120), pillH = 104
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${accent}29, transparent 70%), ${bg}`, opacity: M.cl((t - t0) / 0.25) }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: cy - 200, textAlign: 'center', opacity: a.op, filter: a.blur > .3 ? `blur(${a.blur}px)` : undefined, transform: `translateY(${a.y}px)` }}>{wordmark}</div>
      {sub && <div style={{ position: 'absolute', left: 0, right: 0, top: cy - 50, textAlign: 'center', opacity: b.op, transform: `translateY(${b.y}px)`, color: '#9A9AA6', fontSize: 40, fontWeight: 600 }}>{sub}</div>}
      <div style={{ position: 'absolute', left: (w - pillW) / 2, top: cy + 40, width: pillW, height: pillH, borderRadius: 999, background: accent, color: ctaColor, display: 'grid', placeItems: 'center', fontSize: 42, fontWeight: 800, opacity: t < t0 + 0.7 ? 0 : s.op, transform: `scale(${t < t0 + 0.7 ? 0 : s.s * M.press(t, t0 + 1.7)})` }}>{cta}</div>
      <Cursor keys={[{ t: t0 + 1.0, x: w / 2 + pillW / 2 + 240, y: cy + 40 + pillH + 300 }, { t: t0 + 1.7, x: w / 2 + pillW / 2 - 36, y: cy + 40 + pillH - 26, click: true }]} hideAfter={t0 + 2.3} />
    </div>
  )
}
