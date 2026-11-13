# GSAP for video

GSAP 3.15 is installed with every plugin (all GSAP plugins are free, including SplitText, MorphSVG, DrawSVG,
ScrambleText, Flip, MotionPath, CustomEase). Docs: https://gsap.com/docs/v3/ (the site blocks bots; read
`node_modules/gsap/types/*.d.ts` for exact options offline).

## The one rule: seek, don't play
GSAP normally runs on its own ticker in real time. For video we **build a paused timeline once and set its time to the
frame time on every render**: `src/video/gsap/useGsapTimeline.ts`.

```tsx
const ref = useRef<HTMLDivElement>(null); const t = useTime()
useGsapTimeline(ref, t, tl => {
  const s = SplitText.create('.title', { type: 'chars', mask: 'chars' })
  tl.from(s.chars, { yPercent: 110, duration: .6, ease: 'power4.out', stagger: .03 }, 0.2)   // position param = seconds
    .fromTo('.underline', { drawSVG: '0%' }, { drawSVG: '100%', duration: .8 }, 0.9)
})
return <div ref={ref}>…</div>
```
- The third argument of `.to/.from` (position) is the **absolute second** in the video. Put beats on word times.
- Selectors are scoped to `ref` (via `useGSAP`), so classes can repeat across compositions.
- `repeat: -1` is fine (it is still a function of time). Avoid `ScrollTrigger`, `Observer`, `Draggable` in videos (they need input).
- Random stagger: use `stagger: { each: .05, from: 'random' }` only with a fixed seed (`gsap.utils.random` isn't seeded; precompute values instead).

## Core API cheat sheet
- Tweens: `gsap.to(target, vars)`, `from`, `fromTo`, `set`. Common vars: `x y xPercent yPercent rotate scale opacity filter duration ease delay stagger repeat yoyo`.
- Timeline: `gsap.timeline({ paused: true })` → `.to(...)`, `.add(child, pos)`, `.addLabel('proof', 6.2)`, `.call(fn, [], pos)`; seek with `tl.time(t)` / `tl.progress(p)`.
- Position strings: `'<'` start of previous, `'>'` end of previous, `'+=0.2'`, `'label+=0.3'`.
- Eases: `power1–4.in/out/inOut`, `back.out(1.7)`, `elastic.out(1, .3)`, `expo.out`, `sine.inOut`, `steps(n)`, `CustomEase.create('name', 'x1,y1,x2,y2')`.
- Utils: `gsap.utils.interpolate`, `mapRange`, `clamp`, `wrap`, `toArray`, `snap`.

## Plugins and what we use them for (see `catalog/gsap.json` for copy-paste recipes)
| Plugin | Use in video |
|---|---|
| SplitText | kinetic titles by chars/words/lines, masked reveals |
| DrawSVG | underlines, arrows, circling a number, connector lines |
| MorphSVG | icon → icon, blob → logo |
| MotionPath | a dot/cursor/plane travelling between stations |
| Flip | layout rearranges (grid → list, card → full screen) |
| ScrambleText / Text | terminal decode, typed replies |
| CustomEase | our measured curves inside GSAP (e.g. keynote bezier `.626,.279,.251,.907`) |

## When to use GSAP vs `motion.ts`
- Measured SaaSSuite moves (letter rise, card slide, stamp, press) → `src/video/components` / `motion.ts`.
- Text splitting, SVG drawing/morphing, path travel, complex staggers, many-element choreography → GSAP.
- Both can live in one composition: both read the same `t`.
