// Motion primitives for video. Every curve was MEASURED by rebuilding reference videos frame by frame
// (content-management/motion/recreate/*/notes.md, SSIM 0.91–0.99). Use them as given; don't invent new easing.
// Port of content-management/.claude/skills/saassuite-motion/lib.js. All are pure functions of time (seconds).

export const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p

const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  x = cl(x); let t = x
  for (let i = 0; i < 8; i++) {
    const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x
    const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t
    if (Math.abs(d) < 1e-6) break
    t = cl(t - cx / d)
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3
}
export const ease = {
  outCubic: (x: number) => 1 - Math.pow(1 - cl(x), 3),
  outQuart: (x: number) => 1 - Math.pow(1 - cl(x), 4),
  outExpo: (x: number) => ((x = cl(x)) >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inOutCubic: (x: number) => ((x = cl(x)) < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  inOutSine: (x: number) => -(Math.cos(Math.PI * cl(x)) - 1) / 2,
  bezier,
}

/** Damped spring progress 0→1 (stiffness w², damping 2zw). tau = seconds since start. */
export function spring(tau: number, w = 16, z = 0.7) {
  if (tau <= 0) return 0
  if (z < 1) { const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + ((z * w) / wd) * Math.sin(wd * tau)) }
  return 1 - Math.exp(-w * tau) * (1 + w * tau)
}
/** Spring displacement from x0 with initial velocity v0. */
export function springOffset(tau: number, x0: number, v0: number, w: number, z: number) {
  if (tau <= 0) return x0
  const wd = w * Math.sqrt(1 - z * z)
  return Math.exp(-z * w * tau) * (x0 * Math.cos(wd * tau) + ((v0 + z * w * x0) / wd) * Math.sin(wd * tau))
}
/** Headline letters spring up (ClimbX): stagger 0.0453s, 73.5px below, v0 −628px/s, ω15.9 ζ0.47. */
export function letterRise(t: number, t0: number, i: number, o: { stagger?: number; x0?: number; v0?: number; w?: number; z?: number } = {}) {
  const { stagger = 0.0453, x0 = 73.5, v0 = -628, w = 15.9, z = 0.47 } = o
  const tau = t - t0 - i * stagger
  const y = springOffset(tau, x0, v0, w, z), dt = 1 / 120, v = (springOffset(tau + dt, x0, v0, w, z) - y) / dt
  return { y, rot: 0.18 * y, blur: tau <= 0 ? 3.5 : Math.min(3.5, Math.abs(v) / 260), op: cl(tau / 0.07) }
}
/** Soft word rise (Tessel): 40px + 10px blur, 0.55s outQuart, 0.11s stagger. */
export function wordRise(t: number, t0: number, i: number, o: { stagger?: number; dur?: number; dy?: number; blur?: number } = {}) {
  const { stagger = 0.11, dur = 0.55, dy = 40, blur = 10 } = o
  const p = ease.outQuart((t - t0 - i * stagger) / dur)
  return { y: (1 - p) * dy, blur: (1 - p) * blur, op: p }
}
/** Card slide-in (ClimbX): from 358px, ω23.8 ζ0.78, x-motion-blur 0.45·|v|/30. */
export function cardSlide(t: number, t0: number, dx = 358, w = 23.8, z = 0.78) {
  const tau = t - t0, p = spring(tau, w, z), p2 = spring(tau + 1 / 120, w, z), v = (p2 - p) * 120 * dx
  return { x: (1 - p) * dx, blurX: (0.45 * Math.abs(v)) / 30, op: cl(tau / 0.1) }
}
/** Pill/logo stamp (ClimbX): 2.25→0.67 in 6.5f, spring overshoot ~1.24, −24°→+6°. */
export function stamp(t: number, t0: number, fps = 30) {
  const f = (t - t0) * fps
  if (f < 0) return { s: 2.25, rot: -24, op: 0 }
  if (f < 6.5) { const p = ease.inOutSine(f / 6.5); return { s: lerp(2.25, 0.67, p), rot: lerp(-24, 6, p), op: cl(f / 1.6) } }
  return { s: 1 - 0.33 * springOffset((f - 6.5) / fps, 1, 0, 11.5, 0.3), rot: 6 * Math.exp(-(f - 6.5) / 8), op: 1 }
}
/** Word slam (ClimbX). */
export function wordSlam(t: number, t0: number) { const s = 1 + springOffset(t - t0, 1.25, 0, 15.4, 0.48); return { s, blur: Math.min(14, 12 * Math.abs(s - 1)), op: cl(((t - t0) * 30) / 1.6) } }
type Box = { w: number; h: number; cx: number; cy: number; r?: number }
/** Morph one shape (MakerMap): separate w/h springs, pill radius h/2. */
export function morph(t: number, t0: number, from: Box, to: Box, o: { ww?: number; wz?: number; hw?: number; hz?: number; delayH?: number } = {}) {
  const { ww = 16.4, wz = 0.59, hw = 16.0, hz = 0.78, delayH = 0 } = o
  const pw = spring(t - t0, ww, wz), ph = spring(t - t0 - delayH, hw, hz)
  const w = lerp(from.w, to.w, pw), h = lerp(from.h, to.h, ph), cx = lerp(from.cx, to.cx, pw), cy = lerp(from.cy, to.cy, ph)
  return { w, h, x: cx - w / 2, y: cy - h / 2, r: to.r == null ? h / 2 : lerp(from.r ?? from.h / 2, to.r, spring(t - t0, 24, 1)) }
}
export function relaxTo(t: number, t0: number, from: number, final: number, kick = 186, decay = 0.161, w = 16.7, z = 0.625) { const tau = t - t0; return lerp(from, final + kick * Math.exp(-Math.max(0, tau) / decay), spring(tau, w, z)) }
export function dissolveOut(t: number, t0: number, dur = 0.08) { const p = cl((t - t0) / dur); return { op: 1 - p, blur: 11 * p } }
/** Button press 0.954 then spring ω22 ζ0.85. */
export function press(t: number, t0: number) { const tau = t - t0; if (tau < 0) return 1; if (tau < 0.1) return lerp(1, 0.954, tau / 0.1); return lerp(0.954, 1, spring(tau - 0.1, 22, 0.85)) }
/** Cursor click squish 0.85. */
export function cursorSquish(t: number, t0: number) { const tau = t - t0; if (tau < 0) return 1; if (tau < 0.06) return lerp(1, 0.85, tau / 0.06); return lerp(0.85, 1, cl((tau - 0.06) / 0.1)) }
/** Typing ~30 chars/s. */
export function typing(t: number, t0: number, text: string, cps = 30) { const n = Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps))); return { shown: text.slice(0, n), n, ageOf: (i: number) => (t - t0) * cps - (i + 1) } }
/** Text sweep sharpen (CodePilot): 10px blur → 0 over 0.6s, sweep 1230px/s. */
export function sweepChar(t: number, t0: number, xPx: number, o: { speed?: number; dur?: number } = {}) { const { speed = 1230, dur = 0.6 } = o; const p = ease.outCubic((t - t0 - xPx / speed) / dur); return { op: p, blur: 10 * (1 - p) } }
/** Scene beat pulse 1+0.0095·e^(−dt/0.085) every beat. */
export function beatPulse(t: number, bpm = 90, amp = 0.0095) { const b = 60 / bpm; const dt = ((t % b) + b) % b; return 1 + amp * Math.exp(-dt / 0.085) }
/** Bars/counters width·(1−e^(−16.9t)), rows 0.133s apart. */
export function barFill(t: number, t0: number, row = 0) { return 1 - Math.exp(-16.9 * Math.max(0, t - t0 - row * 0.133)) }
export function clickWipe(t: number, t0: number, fps = 30) { const f = (t - t0) * fps; return f < 0 ? 0 : 146 + 17 * Math.pow(1.75, f) }
/** Big headline settle (Tessel). */
export function bigSettle(t: number, t0: number) { const u = cl((t - t0) / 0.1); return { op: cl((t - t0) / 0.07), blur: 18 * (1 - u) ** 2, s: lerp(1.07, 1, ease.outCubic((t - t0) / 0.2)) } }
/** Keynote 3D camera (CodePilot). */
export function keynoteCam(t: number, t0: number) { const p = ease.bezier(0.626, 0.279, 0.251, 0.907)((t - t0) / 0.696); const drift = 4.7 * cl((t - t0 - 0.696) / 3.3); return { s: lerp(1, 0.81, p), ry: lerp(0, -10.76, p) + drift, rx: lerp(0, 3.7, p), persp: 4732 } }
/** Generic rise-in used across ads: opacity + blur + translateY over 0.45s outQuart. */
export function rise(t: number, t0: number, dy = 40) { const k = ease.outQuart((t - t0) / 0.45); return { op: k, blur: (1 - k) * 8, y: (1 - k) * dy } }
/** Fade/blur out over d seconds starting at t1. Multiply into opacity. */
export function outAt(t: number, t1: number, d = 0.25) { const k = cl((t - t1) / d); return { op: 1 - k, blur: k * 10 } }
