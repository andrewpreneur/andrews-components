#!/usr/bin/env node
// Search every component we can use: ours, GSAP recipes, Kokonut UI, and saved 21st.dev components.
//   npm run find -- caption            npm run find -- "button" --source kokonut      npm run find -- --list
//   npm run find -- text --json        npm run find -- --source ours --category Texts
import { readFileSync, readdirSync } from 'node:fs'
const args = process.argv.slice(2); const opt = k => { const i = args.indexOf(k); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v }
const has = k => { const i = args.indexOf(k); if (i < 0) return false; args.splice(i, 1); return true }
const source = opt('--source'), category = opt('--category'), json = has('--json'), list = has('--list'), freeOnly = has('--free')
const q = args.join(' ').toLowerCase().split(/\s+/).filter(Boolean)
const all = readdirSync(new URL('../catalog/', import.meta.url)).filter(f => f.endsWith('.json')).flatMap(f => JSON.parse(readFileSync(new URL(`../catalog/${f}`, import.meta.url))))
let r = all.filter(x => (!source || x.source === source) && (!category || (x.category || '').toLowerCase() === category.toLowerCase()) && (!freeOnly || !x.pro))
if (q.length) r = r.map(x => { const hay = `${x.name} ${x.description} ${(x.tags || []).join(' ')} ${x.category}`.toLowerCase(); const s = q.reduce((a, w) => a + (hay.includes(w) ? 1 : 0) + (x.name.toLowerCase().includes(w) ? 2 : 0), 0); return [s, x] }).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).map(([, x]) => x)
if (list && !q.length) { const by = {}; for (const x of r) (by[`${x.source} / ${x.category}`] ??= []).push(x.name); for (const [k, v] of Object.entries(by)) console.log(`${k} (${v.length}): ${v.join(', ')}`); process.exit(0) }
if (json) { console.log(JSON.stringify(r, null, 1)); process.exit(0) }
for (const x of r.slice(0, 25)) console.log(`${x.id}${x.pro ? ' [PRO]' : ''}${x.clock ? ' [clock]' : ''}\n   ${x.description}\n   ${x.path ? 'use: ' + x.path + (x.export ? ' → ' + x.export : '') : x.install ? 'add: ' + x.install : x.recipe ? 'gsap: ' + x.recipe : ''}${x.docs ? '\n   docs: ' + x.docs : ''}`)
console.log(`\n${r.length} match(es) of ${all.length}. Filters: --source ours|gsap|kokonut|21st  --category <name>  --free  --json  --list`)
