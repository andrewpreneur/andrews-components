#!/usr/bin/env node
// Refresh catalog/kokonut.json from https://kokonutui.com/llms.txt (every Kokonut component, one line each).
import { writeFileSync } from 'node:fs'
const txt = await (await fetch('https://kokonutui.com/llms.txt')).text()
let cat = 'General'; const items = []
for (const line of txt.split('\n')) {
  const h = line.match(/^##\s+(.+)/); if (h) { cat = h[1].trim(); continue }
  const m = line.match(/^- \[(.+?)\]\((https:\/\/kokonutui\.com\/docs\/([^)]+?)\.md)\):\s*(.*)$/); if (!m) continue
  const slug = m[3].split('/').pop(); const pro = /Kokonut UI Pro/.test(m[4])
  if (['docs', 'agents', 'changelog', 'templates', 'pro'].includes(slug) || m[3].split('/').length < 2) continue
  items.push({ id: `kokonut/${slug}`, source: 'kokonut', name: m[1], category: cat, description: m[4], pro, docs: m[2], install: pro ? null : `npx shadcn@latest add @kokonutui/${slug}`, clock: true })
}
writeFileSync('catalog/kokonut.json', JSON.stringify(items, null, 1) + '\n'); console.log(`catalog/kokonut.json: ${items.length} components`)
