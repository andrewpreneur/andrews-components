// Demo: Kokonut UI components used AS IS inside a video frame. They animate on real time (motion/react, rAF),
// so this composition is flagged `clock: true` and tools/shoot.mjs drives the browser clock frame by frame.
import BackgroundPaths from '@/components/kokonutui/background-paths'
import AITextLoading from '@/components/kokonutui/ai-text-loading'
import { FORMATS, type Format } from '@/video/time'

export default function KokonutDemo({ format }: { format: Format }) {
  const { w, h } = FORMATS[format]
  return (
    <div style={{ position: 'absolute', inset: 0, width: w, height: h, fontFamily: 'Inter, sans-serif' }}>
      <BackgroundPaths interactive={false} className="absolute inset-0 h-full w-full text-violet-500">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
          <div style={{ fontSize: Math.min(w, h) * 0.09, fontWeight: 800, letterSpacing: '-0.04em', color: '#141418' }}>Thinking for you.</div>
          <div style={{ transform: 'scale(2.2)' }}><AITextLoading texts={['Reading your request', 'Doing the clicks', 'Checking the result', 'Done']} interval={1100} /></div>
        </div>
      </BackgroundPaths>
    </div>
  )
}
