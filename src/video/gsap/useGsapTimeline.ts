// GSAP, frame-accurate. Build a PAUSED timeline once, then seek it to the frame time on every render.
// Never let GSAP's ticker drive a video: the same t must always give the same pixels.
//   const scope = useRef<HTMLDivElement>(null)
//   useGsapTimeline(scope, t, tl => { tl.from('.title', { y: 80, opacity: 0, duration: .6, ease: 'power3.out' }, 0.2) })
import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(useGSAP, SplitText, DrawSVGPlugin, MorphSVGPlugin, TextPlugin, ScrambleTextPlugin, MotionPathPlugin, Flip, CustomEase)
gsap.ticker.lagSmoothing(0)
export { gsap, SplitText, CustomEase, Flip }

export function useGsapTimeline(scope: RefObject<HTMLElement | null>, t: number, build: (tl: gsap.core.Timeline) => void, deps: unknown[] = []) {
  const tl = useRef<gsap.core.Timeline | null>(null)
  useGSAP(() => { const x = gsap.timeline({ paused: true }); build(x); tl.current = x; x.time(t) }, { scope, dependencies: deps })
  useLayoutEffect(() => { tl.current?.time(t) }, [t])
  return tl
}
