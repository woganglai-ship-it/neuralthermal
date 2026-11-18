# NeuralThermal 官网

线上地址：https://neuralthermal.com

**实际部署：Cloudflare Workers（静态资源 + Worker），Worker 名称 `neuralthermal`。不是 GitHub Pages。**

本仓库同步了截至 2026-11-17 的官网：新版首页、彩带导航、六个实验室、登记入口和开发者中心。此前通过 Wrangler 从本地直接部署，所以 GitHub 一度落后；本次已补齐可编辑源码、已构建资源及部署配置。

## 换电脑后恢复

需要 Node.js 22.18 或更新版本（推荐 24）、Python 3、pnpm、Git 和 GitHub CLI（`gh`）。

```sh
gh auth login
gh repo clone woganglai-ship-it/neuralthermal
cd neuralthermal
pnpm install --frozen-lockfile
gh repo clone woganglai-ship-it/neuralthermal-private-runtime private-runtime
git -C private-runtime checkout b44957c
pnpm check
pnpm exec wrangler login
```

Cloudflare 登录使用原来管理 `neuralthermal.com` 的账号。私有仓库需要你的 GitHub 账号授权；`runtime-lock.json` 记录完整提交和模型校验值。不要把 `private-runtime/` 放进公开仓库或 `public/`。

## 更新与发布

```sh
git pull --ff-only
pnpm build
pnpm check
# 确认改动后记录到 GitHub
git add src scripts public worker.js lab-access.ts wrangler.toml package.json pnpm-lock.yaml pnpm-workspace.yaml runtime-lock.json README.md .gitignore
git commit -m "说明本次修改的目的"
git push origin main
pnpm deploy
```

`pnpm deploy` 会构建并通过 Wrangler 更新同一个 Worker。当前没有配置 GitHub 自动发布：**只推送 GitHub 不会自动改变线上网站**，发布用上述命令。以后修改与上线都应同步保存到 GitHub。

## 在哪里修改

| 内容 | 文件 |
| --- | --- |
| 首页、导航、实验室列表、文案 | `src/site/app.js` |
| 案例内容 | `src/site/content.js` |
| 官网样式与彩带 | `src/site/style.css` |
| 六个实验室共用彩带 | `src/labs/ribbon.css` |
| 登记页文案及样式 | `src/access/` |
| 实验室访问（2026-11-18 起全部公开，不再需要登记；旧的 `/access/?lab=…` 链接自动转到对应实验室） | `lab-access.ts` |
| 开发者中心外壳 | `src/api-studio/site-shell.css` |
| 各实验室的实际交互 | `public/tools/*/index.html`、`public/labs/advanced-packaging/index.html` 及相邻资源 |
| API 服务端入口 | `worker.js` |
| 访客统计（每个 HTML 页面自动插入 `/hub/t.js`，数据和查看页在 NT Hub Worker） | `worker.js`、`hub/worker.js` |
| 部署配置 | `wrangler.toml` |

`public/` 已包含全部公开图片、视频与交互资源。实验室是现有独立 HTML 成品，直接修改相应文件即可；构建只替换各实验室指定的彩带样式块，不重写其计算脚本。

## 登记数据与 API 模型

- 登记数据仍在原 Cloudflare 账号的 `dlcfd` Worker 的 `ManagementStore` Durable Object；`wrangler.toml` 的 `LEADS` 绑定负责连接它。换电脑不会迁移或删除这些数据。
- 公共仓库不保存客户资料、登录会话、Cloudflare 凭据或私有 API 模型。
- API 引擎与模型在私有配套仓库，部署时被编译进服务器 Worker，不作为静态资源下发。
- 本文流程是换电脑继续管理**原 Cloudflare 账号**。若迁移到另一个账号，还需要单独迁移登记服务、数据和域名，不能直接照搬绑定。
- 不要把网站改成无 Worker 的纯静态托管，否则登记保护和服务端 API 不会运行。

## 当前线上基线

2026-11-17 彩带版 Worker version：`c2c3ab05-1b87-4a80-9310-2d05275640d7`。
本次 GitHub 同步不额外修改线上页面，也不改变 DLCFD 内部管理站。
