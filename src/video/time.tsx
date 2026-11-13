// Frame-time model. Every video component reads the current time (seconds) from <TimeProvider> and draws
// that frame. No CSS transitions, no timers, no Date: the page renders the same pixels for the same t,
// so it can be shot frame by frame (tools/shoot.mjs) at any fps.
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'

export const TimeCtx = createContext(0)
export const useTime = () => useContext(TimeCtx)
export function TimeProvider({ t, children }: { t: number; children: ReactNode }) {
  return <TimeCtx.Provider value={t}>{children}</TimeCtx.Provider>
}

export type Format = '16:9' | '9:16' | '4:5' | '3:4' | '1:1'
export const FORMATS: Record<Format, { w: number; h: number }> = {
  '16:9': { w: 1920, h: 1080 }, '9:16': { w: 1080, h: 1920 }, '4:5': { w: 1080, h: 1350 }, '3:4': { w: 1080, h: 1440 }, '1:1': { w: 1080, h: 1080 },
}
/** Key text must sit inside this box (Meta crops 9:16 to 4:5 in feed). */
export function safeArea(f: Format) {
  const { w, h } = FORMATS[f]
  if (f === '9:16') return { x: 0, y: (h - 1350) / 2, w, h: 1350 }
  return { x: Math.round(w * 0.04), y: Math.round(h * 0.04), w: Math.round(w * 0.92), h: Math.round(h * 0.92) }
}

/** Fixed-pixel video frame. Children position themselves in frame pixels. */
export function Stage({ format, bg = '#F6F5F2', guides = false, style, children }: { format: Format; bg?: string; guides?: boolean; style?: CSSProperties; children: ReactNode }) {
  const { w, h } = FORMATS[format]; const s = safeArea(format)
  return (
    <div data-stage style={{ position: 'relative', width: w, height: h, overflow: 'hidden', background: bg, ...style }}>
      {children}
      {guides && <div style={{ position: 'absolute', left: s.x, top: s.y, width: s.w, height: s.h, outline: '2px dashed rgba(255,0,80,.6)', pointerEvents: 'none' }} />}
    </div>
  )
}

/** Shows children only while from <= t < to, fading/blurring out over `out` seconds before `to`. */
export function Sequence({ from, to, out = 0.25, style, children }: { from: number; to: number; out?: number; style?: CSSProperties; children: ReactNode }) {
  const t = useTime()
  if (t < from || t >= to) return null
  const k = out > 0 ? Math.min(1, Math.max(0, (t - (to - out)) / out)) : 0
  return <div style={{ position: 'absolute', inset: 0, opacity: 1 - k, filter: k > 0 ? `blur(${k * 8}px)` : undefined, ...style }}>{children}</div>
}

/** Absolute box helper: <Abs x={..} y={..}>. */
export function Abs({ x = 0, y = 0, w, h, center, style, children }: { x?: number; y?: number; w?: number; h?: number; center?: boolean; style?: CSSProperties; children?: ReactNode }) {
  return <div style={{ position: 'absolute', left: center ? 0 : x, right: center ? 0 : undefined, top: y, width: w, height: h, textAlign: center ? 'center' : undefined, ...style }}>{children}</div>
}
