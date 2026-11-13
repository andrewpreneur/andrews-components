// Core video components. Each takes t0 (start second) and reads the frame time from useTime().
import type { CSSProperties, ReactNode } from 'react'
import { useTime } from '../time'
import * as M from '../motion'

const blur = (b: number) => (b > 0.3 ? `blur(${b}px)` : undefined)

/** Generic rise-in (opacity + blur + 40px). Optional fade at `outAt`. */
export function Rise({ t0, dy = 40, outAt, style, children }: { t0: number; dy?: number; outAt?: number; style?: CSSProperties; children: ReactNode }) {
  const t = useTime(); const r = M.rise(t, t0, dy); const o = outAt != null ? M.outAt(t, outAt) : { op: 1, blur: 0 }
  return <div style={{ opacity: r.op * o.op, filter: blur(r.blur + o.blur), transform: `translateY(${r.y}px)`, ...style }}>{children}</div>
}

/** Headline letters spring up (measured ClimbX). accent = words drawn in the accent colour. */
export function LetterRise({ text, t0, size = 110, color = '#141418', accent = [], accentColor = '#7B5CFF', font = 800, style }: { text: string; t0: number; size?: number; color?: string; accent?: string[]; accentColor?: string; font?: number; style?: CSSProperties }) {
  const t = useTime(); let i = 0
  return (
    <div style={{ fontSize: size, fontWeight: font, letterSpacing: '-0.037em', lineHeight: 1.06, color, whiteSpace: 'pre-wrap', ...style }}>
      {text.split('\n').map((line, li) => (
        <div key={li}>{line.split(' ').map((w, wi) => (
          <span key={wi} style={{ display: 'inline-block', marginRight: '0.25em', color: accent.includes(w) ? accentColor : undefined }}>
            {[...w].map((ch, ci) => { const r = M.letterRise(t, t0, i++); return <span key={ci} style={{ display: 'inline-block', transform: `translateY(${r.y}px) rotate(${r.rot}deg)`, filter: blur(r.blur), opacity: r.op }}>{ch}</span> })}
          </span>
        ))}</div>
      ))}
    </div>
  )
}

/** Soft word-by-word rise (Tessel). */
export function WordRise({ text, t0, stagger, style }: { text: string; t0: number; stagger?: number; style?: CSSProperties }) {
  const t = useTime()
  return <div style={style}>{text.split(' ').map((w, i) => { const r = M.wordRise(t, t0, i, { stagger }); return <span key={i} style={{ display: 'inline-block', marginRight: '0.28em', transform: `translateY(${r.y}px)`, filter: blur(r.blur), opacity: r.op }}>{w}</span> })}</div>
}

/** Pill / badge / logo stamp with overshoot (ClimbX). Hidden before t0. */
export function Stamp({ t0, style, children }: { t0: number; style?: CSSProperties; children: ReactNode }) {
  const t = useTime(); const s = M.stamp(t, t0)
  return <div style={{ display: 'inline-block', opacity: t < t0 ? 0 : s.op, transform: `scale(${t < t0 ? 0 : s.s}) rotate(${s.rot}deg)`, ...style }}>{children}</div>
}

/** Floating card slides in from the right with motion blur (ClimbX). */
export function CardSlide({ t0, dx = 358, style, children }: { t0: number; dx?: number; style?: CSSProperties; children: ReactNode }) {
  const t = useTime(); const s = M.cardSlide(t, t0, dx)
  return <div style={{ opacity: s.op, transform: `translateX(${s.x}px)`, filter: s.blurX > 0.3 ? `blur(${Math.min(8, s.blurX)}px)` : undefined, background: '#fff', border: '1px solid #E6E4EF', borderRadius: 28, boxShadow: '0 30px 80px rgba(20,20,40,.12)', ...style }}>{children}</div>
}

/** Typing at ~30 chars/s; newest char born in accent; solid caret. */
export function Typer({ text, t0, cps = 30, accent = '#7B5CFF', caret = true, caretOff, style }: { text: string; t0: number; cps?: number; accent?: string; caret?: boolean; caretOff?: number; style?: CSSProperties }) {
  const t = useTime(); const ty = M.typing(t, t0, text, cps)
  return <div style={{ whiteSpace: 'pre-wrap', ...style }}>{[...ty.shown].map((c, i) => { const a = M.cl(ty.ageOf(i) / 5); return <span key={i} style={{ color: a < 1 ? accent : undefined, opacity: 0.6 + 0.4 * a }}>{c}</span> })}{caret && (caretOff == null || t < caretOff) && <span style={{ display: 'inline-block', width: '0.08em', height: '1em', background: accent, verticalAlign: '-0.12em', marginLeft: 2 }} />}</div>
}

/** Button that presses at tPress. */
export function PressButton({ tPress, style, children }: { tPress: number; style?: CSSProperties; children: ReactNode }) {
  const t = useTime()
  return <div style={{ display: 'inline-block', transform: `scale(${M.press(t, tPress)})`, padding: '22px 40px', borderRadius: 999, background: '#7B5CFF', color: '#fff', fontWeight: 800, fontSize: 36, ...style }}>{children}</div>
}

export type CursorKey = { t: number; x: number; y: number; click?: boolean }
/** Mouse cursor moving through keyframes (easeOutCubic between keys), squishing on clicks. */
export function Cursor({ keys, hideAfter, color = '#fff' }: { keys: CursorKey[]; hideAfter?: number; color?: string }) {
  const t = useTime(); if (!keys.length || t < keys[0].t || (hideAfter != null && t > hideAfter + 0.3)) return null
  let a = keys[0], b = keys[0]
  for (let i = 0; i < keys.length; i++) { if (keys[i].t <= t) { a = keys[i]; b = keys[i + 1] ?? keys[i] } }
  const p = b === a ? 1 : M.ease.outCubic((t - a.t) / Math.max(0.01, b.t - a.t) * 1.4)
  const x = M.lerp(a.x, b.x, p), y = M.lerp(a.y, b.y, p)
  const lastClick = [...keys].reverse().find(k => k.click && k.t <= t)
  const sq = lastClick ? M.cursorSquish(t, lastClick.t) : 1
  const op = hideAfter != null ? 1 - M.cl((t - hideAfter) / 0.3) : 1
  return <svg width="46" height="46" viewBox="0 0 24 24" style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${x - 8}px,${y - 4}px) scale(${sq})`, opacity: op, zIndex: 50 }}><path d="M4 2l16 9-7 2-3 7z" fill={color} stroke="#111" strokeWidth="1.5" strokeLinejoin="round" /></svg>
}

/** Number that counts up with a bar (ClimbX bar fill). */
export function CountBar({ to, t0, width = 640, color = '#7B5CFF', track = '#EFEEF3', suffix = '', style }: { to: number; t0: number; width?: number; color?: string; track?: string; suffix?: string; style?: CSSProperties }) {
  const t = useTime(); const f = M.barFill(t, t0)
  return <div style={style}><div style={{ fontSize: 150, fontWeight: 800, letterSpacing: '-0.04em', opacity: M.cl((t - t0 + 0.1) / 0.1) }}>{Math.round(to * f)}{suffix}</div><div style={{ width, height: 14, borderRadius: 7, background: track, overflow: 'hidden' }}><div style={{ width: `${f * 100}%`, height: '100%', background: color, borderRadius: 7 }} /></div></div>
}

/** Red strike-through that draws across its row at tStrike. */
export function Strike({ tStrike, color = '#E11D48', children, style }: { tStrike: number; color?: string; children: ReactNode; style?: CSSProperties }) {
  const t = useTime(); const k = M.ease.outCubic((t - tStrike) / 0.3)
  return <div style={{ position: 'relative', display: 'inline-block', ...style }}>{children}<div style={{ position: 'absolute', left: 0, right: 0, top: '52%', height: 6, borderRadius: 3, background: color, transformOrigin: '0 50%', transform: `scaleX(${k})` }} /></div>
}
