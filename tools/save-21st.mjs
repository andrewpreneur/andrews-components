#!/usr/bin/env node
// Save a 21st.dev component into this repo and the catalog, so we can reuse it without searching again.
//   API_KEY_21ST=... npm run save:21st -- <author/slug> [--desc "what it is"] [--tags a,b,c] [--clock]
// Find candidates first with the 21st MCP (`search`, then `get_component` to read the code), or on https://21st.dev.
// Files land in src/components/21st/<slug>/ via the shadcn CLI; deps are installed; catalog/21st.json gets an entry.
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
const a = process.argv.slice(2); const opt = (k, d = null) => { const i = a.indexOf(k); if (i < 0) return d; const v = a[i + 1]; a.splice(i, 2); return v }
const flag = k => { const i = a.indexOf(k); if (i < 0) return false; a.splice(i, 1); return true }
const desc = opt('--desc', ''), tags = (opt('--tags', '') || '').split(',').filter(Boolean), clock = flag('--clock') || true
const ref = a[0]; if (!ref || !ref.includes('/')) { console.error('usage: npm run save:21st -- <author/slug> [--desc ..] [--tags ..]'); process.exit(1) }
if (!process.env.API_KEY_21ST) { console.error('Set API_KEY_21ST (your 21st.dev key; never commit it).'); process.exit(1) }
const slug = ref.split('/').pop(), dir = `src/components/21st/${slug}`; mkdirSync(dir, { recursive: true })
const before = new Set(readdirSync(dir))
execSync(`npx shadcn@latest add --yes --overwrite --path ${dir} "https://21st.dev/r/${ref}?api_key=${process.env.API_KEY_21ST}"`, { stdio: ['ignore', 'inherit', 'inherit'] })
const files = readdirSync(dir).filter(f => !before.has(f) || true)
const cat = JSON.parse(readFileSync('catalog/21st.json', 'utf8')).filter(x => x.id !== `21st/${ref}`)
cat.push({ id: `21st/${ref}`, source: '21st', name: slug.replace(/-/g, ' '), category: opt('--category', 'Saved'), description: desc || `21st.dev component ${ref}`, tags, path: `${dir}/${files[0] || ''}`, files: files.map(f => `${dir}/${f}`), page: `https://21st.dev/${ref}`, install: `npx shadcn@latest add "https://21st.dev/r/${ref}?api_key=$API_KEY_21ST"`, clock, saved: new Date().toISOString().slice(0, 10) })
writeFileSync('catalog/21st.json', JSON.stringify(cat, null, 1) + '\n')
console.log(`saved ${ref} → ${dir} (${files.join(', ')}) and catalog/21st.json`)
