// Registry of renderable compositions. Add yours here; the gallery and tools/shoot.mjs read this list.
import type { ComponentType } from 'react'
import type { Format } from '@/video/time'
import Showcase from './Showcase'
import GsapDemo from './GsapDemo'
import KokonutDemo from './KokonutDemo'

// clock: true = the composition uses real-time components (Kokonut/motion, canvas, CSS-free rAF loops). The shooter then
// steps the browser clock 1/fps per frame instead of calling window.render(t).
export type Comp = { id: string; title: string; dur: number; formats: Format[]; bg?: string; clock?: boolean; Component: ComponentType<{ format: Format }> }
export const COMPOSITIONS: Comp[] = [
  { id: 'showcase', title: 'Showcase: every core component', dur: 12, formats: ['16:9', '9:16', '4:5'], Component: Showcase },
  { id: 'kokonut-demo', title: 'Kokonut UI components in a frame (clock mode)', dur: 6, formats: ['16:9', '9:16'], clock: true, Component: KokonutDemo },
  { id: 'gsap-demo', title: 'GSAP timeline seeked per frame', dur: 6, formats: ['16:9', '9:16', '1:1'], Component: GsapDemo },
]
