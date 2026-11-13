#!/usr/bin/env node
// Save a 21st.dev component into this repo + catalog/21st.json, so we reuse it without searching again.
//   npm run save:21st -- <demoId> [--desc "what it is"] [--tags a,b,c] [--category Data]
// Get <demoId> from the 21st MCP `search` results ("get_component({ id: 1844 })").
// Fetches the code through the 21st MCP `get_component` tool. Auth: in cloud sessions the proxy injects the saved
// 21st.dev key into the x-api-key header; locally, set API_KEY_21ST. The key is never written to disk.
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
const a = process.argv.slice(2); const opt = (k, d = null) => { const i = a.indexOf(k); if (i < 0) return d; const v = a[i + 1]; a.splice(i, 2); return v }
const desc = opt('--desc', ''), tags = (opt('--tags', '') || '').split(',').filter(Boolean), category = opt('--category', 'Saved')
const id = Number(a[0]); if (!id) { console.error('usage: npm run save:21st -- <demoId> [--desc ..] [--tags a,b] [--category ..]'); process.exit(1) }
// curl, not fetch: curl honours HTTPS_PROXY, so the cloud proxy can inject the saved key.
const payload = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'get_component', arguments: { id } } })
const out = execSync(`curl -s -X POST https://21st.dev/api/mcp -H "x-api-key: $API_KEY_21ST" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' --data-binary @-`,
  { input: payload, env: { ...process.env, API_KEY_21ST: process.env.API_KEY_21ST || 'proxy-injected' }, maxBuffer: 64 << 20 }).toString()
const body = JSON.parse(out); const c = body?.result?.structuredContent?.component
if (!c?.componentCode) { console.error('21st did not return code:', JSON.stringify(body).slice(0, 400)); process.exit(1) }
const ref = (c.installCommand.match(/21st\.dev\/r\/([^?"]+)/) || [])[1] || `id-${id}`, slug = ref.split('/').pop(), dir = `src/components/21st/${slug}`
mkdirSync(dir, { recursive: true })
const header = (kind) => `// ${kind} from 21st.dev: ${c.name} (${c.demoName}) by ${ref.split('/')[0]}. https://21st.dev/${ref}  saved ${new Date().toISOString().slice(0, 10)}\n`
writeFileSync(`${dir}/${slug}.tsx`, header('Component') + c.componentCode.replace(/\r\n/g, '\n'))
if (c.demoCode) writeFileSync(`${dir}/${slug}.demo.tsx`, header('Demo') + c.demoCode.replace(/\r\n/g, '\n').replace(new RegExp(`@/components/ui/${slug}`, 'g'), `./${slug}`))
const deps = Object.keys(c.registryDependencies?.npmDependencies || {}); if (deps.length) execSync(`npm install --silent ${deps.join(' ')}`, { stdio: 'inherit' })
const reg = c.registryDependencies?.filesWithRegistry || {}; if (Object.keys(reg).length) console.warn('Also needs registry files:', Object.keys(reg).join(', '), '(install with npx shadcn@latest add <name>)')
const cat = JSON.parse(readFileSync('catalog/21st.json', 'utf8')).filter(x => x.id !== `21st/${ref}`)
cat.push({ id: `21st/${ref}`, source: '21st', demoId: id, name: c.name, category, description: desc || c.description, tags, path: `${dir}/${slug}.tsx`, demo: c.demoCode ? `${dir}/${slug}.demo.tsx` : null, page: `https://21st.dev/${ref}`, preview: c.previewUrl, clock: true, saved: new Date().toISOString().slice(0, 10) })
writeFileSync('catalog/21st.json', JSON.stringify(cat, null, 1) + '\n')
console.log(`saved ${c.name} → ${dir} and catalog/21st.json`)
