---
name: 21st-dev
description: Search, read and save components, themes and logos from 21st.dev via its MCP server, and browse or build 21st video blocks (captions, scenes, transitions, templates). Use when nothing in our library or Kokonut fits, or to look for inspiration for a scene.
---

# 21st.dev

- MCP server `21st` (`.mcp.json`; header `x-api-key: ${API_KEY_21ST}`). In cloud sessions the proxy injects the saved key (if the env var is empty, curl the MCP with `x-api-key: proxy-injected`). Paid tier: unlimited search and code. 21st AI generation is off: build with Claude.
- Components: `search` / `get_inspiration` → `get_component({ id })` → save with `npm run save:21st -- <demoId> --desc ".." --tags ..` (adds files + `catalog/21st.json`).
- Video blocks: `video_list_blocks` / `video_search_blocks` (free metadata, poster URLs). Optional full 21st pipeline: `video_create_project` → `video_apply_ops` → `video_snapshot` → `video_export`.
- Never commit or print the key. Don't call owner-write tools (edit/delete/profile/feedback) unless Andrew asks.
- Full notes: `docs/21st.md`.
