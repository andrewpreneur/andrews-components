// Demo: a GSAP timeline (SplitText + DrawSVG + stagger) seeked frame by frame. 6 s.
import { useRef } from 'react'
import { useTime, FORMATS, type Format } from '@/video/time'
import { useGsapTimeline, SplitText } from '@/video/gsap/useGsapTimeline'

export default function GsapDemo({ format }: { format: Format }) {
  const t = useTime(); const ref = useRef<HTMLDivElement>(null); const { w, h } = FORMATS[format]
  useGsapTimeline(ref, t, tl => {
    const split = SplitText.create('.g-title', { type: 'chars' })
    tl.from(split.chars, { yPercent: 120, rotate: 8, opacity: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.035 }, 0.2)
      .fromTo('.g-line', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut' }, 0.9)
      .from('.g-chip', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.12 }, 1.6)
      .to('.g-chip', { y: -14, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 3, stagger: 0.1 }, 2.4)
      .to('.g-wrap', { opacity: 0, filter: 'blur(10px)', duration: 0.3 }, 5.6)
  })
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div className="g-wrap" style={{ textAlign: 'center', width: w * 0.8 }}>
        <div className="g-title" style={{ fontSize: Math.min(w, h) * 0.1, whiteSpace: 'nowrap', fontWeight: 800, letterSpacing: '-0.04em', color: '#141418', overflow: 'hidden' }}>Built with GSAP.</div>
        <svg width="100%" height="40" viewBox="0 0 800 40" preserveAspectRatio="none"><path className="g-line" d="M10 26 C 200 6, 400 36, 600 14 S 760 28, 790 16" stroke="#7B5CFF" strokeWidth="8" fill="none" strokeLinecap="round" /></svg>
        <div style={{ marginTop: 40, display: 'flex', gap: 20, justifyContent: 'center' }}>{['SplitText', 'DrawSVG', 'Stagger'].map(c => <div key={c} className="g-chip" style={{ padding: '16px 30px', borderRadius: 999, background: '#fff', border: '1px solid #E6E4EF', fontSize: 34, fontWeight: 700 }}>{c}</div>)}</div>
      </div>
    </div>
  )
}
