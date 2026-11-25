#!/usr/bin/env node
// Refresh the vendored source of the two open-source (MIT) libraries we build from, and the Watermelon catalog.
//   npm run vendor:sync            (re-clones both repos, copies the source folders into vendor/, rewrites catalog/watermelon.json)
// vendor/ is read-only reference source: search it, read it, copy from it. Do not import from vendor/ directly;
// install into src/components with the shadcn CLI (see docs/watermelon.md, docs/kokonut.md).
import { execSync } from 'node:child_process'
import { cpSync, rmSync, mkdirSync, mkdtempSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const REPOS = [
  { name: 'kokonutui', url: 'https://github.com/kokonut-labs/kokonutui.git',
    keep: ['LICENSE', 'README.md', 'registry.json', 'components/kokonutui', 'components/ui', 'hooks', 'lib', 'registry', 'content/docs'] },
  { name: 'watermelon-platform', url: 'https://github.com/WatermelonCorp/watermelon-platform.git',
    keep: ['LICENSE', 'README.md', 'skills', 'public/llms.txt', 'src/data/contents', 'src/components/ui', 'src/lib', 'src/index.css', 'mcp/catalog.generated.ts'] },
]
const tmp = mkdtempSync(join(tmpdir(), 'vendor-')); const sources = {}
for (const r of REPOS) {
  const src = join(tmp, r.name); execSync(`git clone --depth 1 -q ${r.url} ${src}`, { stdio: 'inherit' })
  const commit = execSync('git rev-parse HEAD', { cwd: src }).toString().trim()
  const dest = `vendor/${r.name}`; rmSync(dest, { recursive: true, force: true })
  for (const k of r.keep) if (existsSync(join(src, k))) { mkdirSync(join(dest, k, '..'), { recursive: true }); cpSync(join(src, k), join(dest, k), { recursive: true }) }
  sources[r.name] = { url: r.url, commit, synced: new Date().toISOString().slice(0, 10), license: 'MIT' }
  console.log(`vendor/${r.name} @ ${commit.slice(0, 7)}`)
}
writeFileSync('vendor/SOURCES.json', JSON.stringify(sources, null, 1) + '\n')
// Watermelon catalog, from the repo's own generated MCP catalog (a TS file holding one JSON object).
const ts = readFileSync('vendor/watermelon-platform/mcp/catalog.generated.ts', 'utf8')
const data = JSON.parse(ts.slice(ts.indexOf('{', ts.indexOf('export const catalog')), ts.lastIndexOf('}') + 1))
const label = { components: 'Components', 'animated-components': 'Animated', blocks: 'Blocks', dashboards: 'Dashboards', templates: 'Templates' }
const items = Object.values(data).flat().filter(x => x && x.slug).map(x => ({
  id: `watermelon/${x.slug}`, source: 'watermelon', name: x.title, category: `${label[x.kind] || x.kind}: ${x.category}`, description: x.description || '',
  tags: [x.kind, x.category].filter(Boolean), vendor: x.path ? `vendor/watermelon-platform/${x.path}` : null,
  install: x.installCommand || null, ...(existsSync(`src/components/watermelon/${x.slug}.tsx`) ? { path: `src/components/watermelon/${x.slug}.tsx` } : {}), docs: x.previewUrl || null, clock: true,
}))
writeFileSync('catalog/watermelon.json', JSON.stringify(items, null, 1) + '\n'); console.log(`catalog/watermelon.json: ${items.length} entries`)
rmSync(tmp, { recursive: true, force: true })
