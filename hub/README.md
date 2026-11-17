# NT Hub

`neuralthermal.com/hub/` 是独立的 Cloudflare Worker `nt-hub`，只接管 `/hub*` 路由，部署它不会动主站 Worker `neuralthermal`。页面直接用主站的 `/assets/site.css` 和 `/assets/img/`。

- 条目：`public/hub/items.js`，新条目加在最前面，`added` 写收录日期
- 页面：`public/hub/index.html`（头部 Top 5 轮播 + 栏目列表）、`public/hub/a/index.html`（单条解读页 `/hub/a/?id=…`，底部放原文链接）、`hub.css`、`hub.js`
- 每条需有 `id`、`report` / `report_en`（约 200 字解读）；`img` 是从原文取来的头图，放在 `public/hub/img/<id>.jpg`，没有就用机构标志
- 发布：在本目录运行 `pnpm exec wrangler deploy`
- 回退：Cloudflare 后台 → Workers → nt-hub → Deployments → Rollback；整个撤掉用 `pnpm exec wrangler delete`

对内的接单、工具信息不放这里，在本地「NeuralThermal 官网/NT Hub/对内_不上线」。
