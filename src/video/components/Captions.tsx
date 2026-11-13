// Karaoke captions from word timings [[word, start, end], ...] (ElevenLabs Scribe / TTS alignment / faster-whisper).
// Phrases of 2–4 words, break on >0.3s pause or punctuation; active word in the accent colour.
import type { CSSProperties } from 'react'
import { useTime } from '../time'
import { ease } from '../motion'

export type Word = [string, number, number]
export function phrases(words: Word[], max = 4, gap = 0.3) {
  const ph: Word[][] = []; let cur: Word[] = []
  for (const w of words) { const last = cur[cur.length - 1]; if (cur.length && (cur.length >= max || w[1] - last[2] > gap || /[,.?!:]$/.test(last[0]))) { ph.push(cur); cur = [] } cur.push(w) }
  if (cur.length) ph.push(cur)
  return ph.map((p, i) => { const nx = ph[i + 1]; const end = nx ? Math.min(p[p.length - 1][2] + 0.35, nx[0][1] - 0.03) : p[p.length - 1][2] + 0.5; return { words: p, start: p[0][1], end } })
}

export function Captions({ words, y, max = 4, size = 64, color = '#fff', accent = '#9B83FF', boxed = false, style }: { words: Word[]; y: number; max?: number; size?: number; color?: string; accent?: string; boxed?: boolean; style?: CSSProperties }) {
  const t = useTime(); const P = phrases(words, max).find(p => p.start - 0.05 <= t && t <= p.end)
  if (!P) return null
  let ai = -1; P.words.forEach((w, i) => { if (w[1] <= t) ai = i })
  const u = ease.outQuart((t - P.start + 0.05) / 0.18)
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: u, transform: `translateY(${(1 - u) * 14}px)`, fontWeight: 800, fontSize: size, letterSpacing: '-0.02em', ...style }}>
      <span style={boxed ? { display: 'inline-block', padding: '10px 24px', borderRadius: 16, background: 'rgba(20,20,24,.88)' } : undefined}>
        {P.words.map((w, i) => <span key={i} style={{ display: 'inline-block', margin: '0 .14em', color: i === ai ? accent : color, textShadow: boxed ? undefined : '4px 4px 0 rgba(0,0,0,.55)' }}>{w[0].replace(/[,.:]$/, '')}</span>)}
      </span>
    </div>
  )
}
