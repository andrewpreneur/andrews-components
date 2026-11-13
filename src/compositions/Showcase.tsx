// Demo: every core component once, SaaSSuite light style. 12 s.
import { useTime, Sequence, Abs, FORMATS, type Format } from '@/video/time'
import { LetterRise, WordRise, Stamp, CardSlide, Typer, PressButton, CountBar, Strike, Rise } from '@/video/components/primitives'
import { Captions, type Word } from '@/video/components/Captions'
import { EndCard } from '@/video/components/EndCard'
import { beatPulse } from '@/video/motion'

const WORDS: Word[] = [['One', 0.3, 0.6], ['feature.', 0.6, 1.1], ['Sold', 1.4, 1.7], ['for', 1.7, 1.85], ['$99', 1.85, 2.4], ['a', 2.4, 2.5], ['month.', 2.5, 3.0], ['You', 3.3, 3.5], ['type', 3.5, 3.8], ['what', 3.8, 4.0], ['you', 4.0, 4.15], ['want,', 4.15, 4.6], ['it', 4.8, 4.9], ['builds', 4.9, 5.3], ['it.', 5.3, 5.6]]

export default function Showcase({ format }: { format: Format }) {
  const t = useTime(); const { w, h } = FORMATS[format]; const V = h > w
  const cx = (bw: number) => (w - bw) / 2
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${beatPulse(t)})`, fontFamily: 'Inter, sans-serif', color: '#141418' }}>
      <Sequence from={0} to={3.1}>
        <Abs center y={V ? 600 : 300}><LetterRise text="One feature." t0={0.2} accent={['feature.']} size={V ? 120 : 150} /></Abs>
        <Abs x={cx(420)} y={V ? 800 : 520} w={420} style={{ textAlign: 'center' }}><Stamp t0={1.85}><div style={{ padding: '18px 40px', borderRadius: 999, background: '#7B5CFF', color: '#fff', fontWeight: 800, fontSize: 48 }}>$99 a month</div></Stamp></Abs>
      </Sequence>
      <Sequence from={3.1} to={6.2}>
        <Abs x={cx(760)} y={V ? 520 : 200} w={760}>
          <CardSlide t0={3.2} style={{ padding: 34 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.2em', color: '#7B5CFF' }}>YOU TYPE WHAT YOU WANT</div>
            <div style={{ marginTop: 18, padding: '18px 24px', borderRadius: 999, border: '1.5px solid #E6E4EF', fontSize: 34, fontWeight: 600 }}><Typer text="make me a website for my gym" t0={3.5} caretOff={5.2} /></div>
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><WordRise text="it builds it." t0={4.9} style={{ fontSize: 44, fontWeight: 800 }} /><PressButton tPress={5.3}>Publish</PressButton></div>
          </CardSlide>
        </Abs>
      </Sequence>
      <Sequence from={6.2} to={9.0}>
        <Abs x={cx(760)} y={V ? 560 : 220} w={760}>
          <Rise t0={6.3}><div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.6 }}><Strike tStrike={6.9}>a course</Strike><br /><Strike tStrike={7.3}>a bunch of features</Strike></div></Rise>
          <Rise t0={7.6} style={{ marginTop: 40 }}><CountBar to={300} t0={7.7} suffix="+" /></Rise>
        </Abs>
      </Sequence>
      <Captions words={WORDS} y={V ? 1450 : 930} size={V ? 72 : 60} boxed />
      <EndCard t0={9.0} w={w} h={h} wordmark={<span style={{ fontSize: V ? 130 : 160, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>SaaSSuite<span style={{ color: '#9B83FF' }}>.</span></span>} cta="Start free" />
    </div>
  )
}
