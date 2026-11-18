# NT Hub 每日更新与筛选规则

本文件是 NT Hub（neuralthermal.com/hub/）日常更新的完整规则，换电脑或本机数据丢失时，照此即可恢复。规则有变化时同步修改本文件。

最后更新：2026-11-18（加入分享栏；硕博留学加微信联系卡片；新增实习与工作栏目）

## 1. 定位

- 名称：物理 AI 与先进计算前沿速递 / Physical AI & Advanced Computing Briefing。
- 公开、免注册的中英双语情报页，目的是给小红书导流、提高官网粘性。
- 不做纯导航：每条点进去是我们自己的解读页（约 200 字 NT 解读），原文链接放在解读页最底部。
- 每篇解读页正文后面有一排分享按钮（2026-11-18 起；用户只要文末这一处，不放标题下方）。手机上有「分享…」按钮，调用系统分享面板，可以分享到微信、小红书等已安装的 App；另有微信 / 朋友圈（弹出二维码，微信扫码打开后点右上角分享）、小红书（复制标题和链接）、微博、LinkedIn、复制链接。不放 X（推特），用户认为在国内较敏感。二维码库自带在 `public/hub/vendor/qrcode.js`（qrcode-generator 1.4.4，MIT 许可）。注册、评论功能暂不开放。
- 硕博留学的解读页，在 NT 解读和分享栏之间有一张微信联系卡片（2026-11-18 起）：「想申这个方向？」加上微信二维码（`public/hub/contact/wechat.jpg`），只提供课题方向是否对口的建议；硕博留学栏目列表顶部有一行小字提示。其他栏目不放。不收表单、不要求注册；暂不提科研实践或实习，用户以后单独开口子。卡片保持简洁，不做成广告样式。
- 首页的栏目按钮（Top 5 / 物理 AI / …）向下滚动时固定在网站菜单下方（2026-11-18 起，用户要求），手机上排成一行、可左右滑动；滚动后切换栏目会回到该栏目列表的开头。
- 实习与工作分两类（2026-11-18 起），列表和解读页都有小标签：
  - **行业岗位**（默认，不写 `kind`）：英伟达这类大公司的公开岗位，用来撑档次、看行业方向，**每期只放 1–2 条**。解读页末尾放「想冲这类岗位？」求职竞争力诊断卡片（微信二维码，从技术角度看简历和项目、给简历精修和面试准备建议，向学生低价收费），并注明请在原文页面自行投递；不收简历。
  - **NT 推荐**（`kind: "ref"`）：我们能直接对接的岗位（自己的企业关系，或谈好分成的合作猎头的单子）。必须有 `code`（NT-J-001 起，按顺序编号）；解读页末尾是简历投递卡片，邮件发到 tech@neuralthermal.com，标题自动带编号和岗位名。企业名默认匿名（「某头部家电企业 · 热仿真工程师 · 佛山」），企业同意才写真名；可以不写 `url`，此时不显示原文按钮。推荐对求职者免费，佣金只向企业或猎头收。
  - 编号对应哪家企业、哪位猎头，只记在本机「NT Hub/对内_不上线/推荐岗位与猎头登记.md」，**绝不写进本仓库**（仓库公开）。NT 推荐岗位由用户提供后才上线，定时任务不要自己编造。
- 不帮读者代填申请。
- 对内信息（接单线索、分包、内部工具、小红书选题）一律不上线，只留在本地「NeuralThermal 官网/NT Hub/对内_不上线/」。

## 2. 更新频率

- **每天一期**（2026-11-18 起，原为每两天一期）。本机用定时任务每天上午 9 点左右自动运行。
- **每期必须重选 Top 5**。Top 5 同时决定页面头部的轮播大图和「Top 5」栏，不能出现条目更新了、轮播还是上一期的情况。
  - 5 条里至少 3 条是当天新收录的，新条目足够好就 5 条全换。
  - 优先挑有原文头图（`img`）的条目，轮播以图为主。
  - 尽量覆盖不同栏目。
  - 不能原样沿用上一期的 Top 5。
- 当天确实没有可核实的新条目时，仍检查 Top 5 里有没有过期条目；有变化才发布。

## 3. 栏目与收录范围

栏目顺序：Top 5 / 物理 AI / 先进计算 / 开源工具 / 论文与模型 / 会议与论坛 / 硕博留学 / 实习与工作（2026-11-18 起，硕博留学移到会议与论坛后面，实习与工作放最后）。

| `cat` | 中文 | English | 收什么 |
|---|---|---|---|
| `ai` | 物理 AI | Physical AI | 仿真；PINN、FNO / 神经算子等新算法；代理模型；AI 虚拟传感；具身与人形机器人的新算法 |
| `compute` | 先进计算 | Advanced computing | 先进封装、芯片、芯片与数据中心热管理、液冷、HPC 硬件 |
| `oss` | 开源工具 | Open-source tools | GitHub 上值得关注的开源项目；Hacker News（HN，Y Combinator 的技术社区）上讨论热烈的帖子（≥50 分）；Product Hunt（PH，新产品发布榜）上的新品（页面或作者官网能核实才收） |
| `hf` | 论文与模型 | Papers & models | Hugging Face 上赞数最高的相关论文，以及趋势榜或高赞的开源模型、数据集 |
| `study` | 硕博留学 | Graduate study abroad | 海外有资助的硕士、博士、博后岗位（物理 ML、热、流体、封装方向），截止日期未过 |
| `jobs` | 实习与工作 | Internships & jobs | 企业的实习和全职岗位，方向是物理 AI、仿真、CFD、热管理、芯片与封装、机器人（2026-11-18 新增）。分「行业岗位」和「NT 推荐」两类，见第 1 节。行业岗位每期 1–2 条，挑大厂和物理 AI 公司（英伟达、Figure、PhysicsX 等），有国内工作地点的优先，只收岗位页还开放的 |
| `contest` | 会议与论坛 | Conferences & forums | 国内外会议、论坛、竞赛（2026-11-18 由「会议与竞赛」改名）。国内例子：中国仿真学会 / 中国仿真大会、世界仿真大会、中国制冷学会、中国工程热物理学会、ICEPT、中国研究生创新实践系列大赛、具身智能竞赛 |

每期新增约 6–12 条，分布到各栏目：开源工具、论文与模型各 1–3 条，实习与工作的行业岗位 1–2 条；能核实时至少放 1 条国内会议或论坛。

## 4. 来源与核实（筛选规则）

- **只用一手来源**：官网、公司新闻室和公司自己发的新闻稿（PR Newswire、Business Wire 上的公司原稿也可以）、高校新闻与招聘页、jobs.ac.uk、EURAXESS、arXiv 摘要页、学会官网或学会官方公众号文章、会议官网、GitHub 仓库、HN 帖子页、Hugging Face 页面。
- **每条都要亲自打开原页面**，核对日期、数字和关键事实。打不开、只有聚合站或转载、各来源说法矛盾的，一律不收。
- 用子代理（subagent）分头查时，主流程仍要自己用 curl 复核每个链接的状态码和标题。
- 抓取时不在任何请求里带用户邮箱。网页拦截脚本（403）时可以换浏览器 User-Agent 再试，但不绕过验证码。
- 实用接口：
  - GitHub：`gh api repos/<owner>/<repo>`（星数、许可证、最近推送），`gh api repos/<owner>/<repo>/releases/latest`
  - HN：`https://hn.algolia.com/api/v1/search?query=…&tags=story&numericFilters=created_at_i%3E<unix秒>,points%3E50`
  - Hugging Face：`https://huggingface.co/api/daily_papers?date=YYYY-MM-DD`、`https://huggingface.co/api/papers/<arxiv编号>`、`https://huggingface.co/api/models?search=…&sort=trendingScore`
  - 企业招聘（实习与工作）：
    - 英伟达（Workday）：`POST https://nvidia.wd5.myworkdayjobs.com/wday/cxs/nvidia/NVIDIAExternalCareerSite/jobs`，请求体 `{"appliedFacets":{},"limit":20,"offset":0,"searchText":"intern simulation"}`；单个岗位详情是 GET 同一前缀加上岗位的 `externalPath`。
    - Greenhouse：`https://boards-api.greenhouse.io/v1/boards/<公司>/jobs`（例如 figureai、physicsx），详情加 `/<岗位编号>`。
    - Ashby：`https://api.ashbyhq.com/posting-api/job-board/<公司>`（例如 1x、physicalintelligence）。
- 已收录的不要重复收（先通读 `items.js`）。

## 5. 条目格式（`public/hub/items.js`）

新条目插在对应栏目的分隔注释下面，不要插进文件开头的说明注释（那里也出现了栏目名）。分隔注释依次是：
`物理 AI 与先进计算（ai / compute）`、`开源工具（oss）`、`论文与模型（hf）`、`硕博留学`、`会议与竞赛`（这条注释沿用旧名，页面显示为「会议与论坛」）、`实习与工作（jobs）`（在文件最后）。

字段：

| 字段 | 说明 |
|---|---|
| `id` | 英文标题生成的短横线小写别名，最多约 5 个词，全站唯一。它就是解读页网址 `/hub/a/?id=…`，**已有的 id 永远不改** |
| `cat` | 见第 3 节 |
| `added` | 收录日期 YYYY-MM-DD |
| `date` | 原文发布日期（可空）；开源项目写最近一次发版日期，HN 写帖子日期 |
| `deadline` | 截止日期（可空），过期自动显示「已截止」并移入往期 |
| `when` / `when_en` | 时间地点补充（可空） |
| `source` / `source_en` | 来源；英文不同时才写 `source_en` |
| `title` / `title_en` | 标题，**必须在电脑端列表里一行放下**：中文约 32 字以内，英文约 70 个字符以内。赞数、全称、排名等细节放摘要，不放标题 |
| `summary` / `summary_en` | 一两句摘要，带具体数字 |
| `url` | 原文链接（解读页底部按钮） |
| `logo` | 发布机构标志，放 `public/hub/logos/` |
| `report` / `report_en` | NT 解读，见第 6 节 |
| `kind` | 只用于实习与工作：`"ref"` 表示 NT 推荐，不写就是行业岗位 |
| `code` | NT 推荐岗位的编号，如 `NT-J-001` |
| `img` | 原文头图文件名，放 `public/hub/img/<id>.jpg`；没有就不写，页面会用机构标志 |
| `top` | 1–5，Top 5 名次 |

## 6. NT 解读（`report` / `report_en`）

- 中文约 180–240 字，分 2–3 段，段与段之间用 `\n\n`。
- 写法：先说是什么，再写原页面上的关键事实和数字，最后一段是克制的解读（为什么重要、适合谁）。
  - 招生岗位写清资格、津贴、截止日期、适合什么背景。
  - 会议写清日期、截止、相关分会场、适合谁投稿。
  - 企业岗位写清公司是做什么的、地点、岗位职责、学历和经验要求、薪资（岗位页写了才写），以及适合什么背景。岗位信息多，可以写到 300–360 字。
- 所有事实都要来自原页面，不编造数字、人名、日期；不夸张，不用列表，不用 emoji。
- `report_en` 是忠实的英文版，约 110–160 词，分段与中文一致。

## 7. 图片与标志

- **头图（`img`）**：取原页面的主图（og:image / twitter:image，没有就取正文里第一张真正的配图）。不用标志、网站图标、通用宣传横幅，也不用露出邮箱的截图。
  - 开源项目用仓库的 GitHub 社交预览图。
  - Hugging Face 论文用论文页的缩略图。
  - 下载后转成 JPEG：`sips -s format jpeg -s formatOptions 78 -Z 1400 <原图> --out public/hub/img/<id>.jpg`。
  - 图片从原文转载，存在版权风险，用户已知悉，暂时这样处理；解读页会注明图片来源。
- **标志（`logo`）**：取发布机构官网的标志；没有就用该网站的图标；还没有就不写。不用纯白色的标志（白底上看不见）。
- 所有 SVG 都要检查，有 `<script`、`on…=` 事件属性或 `javascript:` 的不用。
- NT Hub 不再使用单独的 logo（2026-11-18 用户删掉了，避免分散 NeuralThermal 品牌），不要再加回来。

## 8. 过期规则（页面自动处理）

- 有截止日期的：截止日一过，就移入「往期」（按收录月份分组）。
- 没有截止日期的：物理 AI、先进计算在收录 30 天后移入往期，实习与工作 45 天后移入，其他栏目 90 天后移入。每期更新时顺手检查实习与工作里的岗位页是否还开放，关了就把 `deadline` 设为当天。
- 刚开完的会议可以照样收录，把 `deadline` 设为会议最后一天，它会直接进往期。
- 每个栏目一次显示 10 条，下面有「查看更多」。

## 9. 发布流程

在仓库根目录：

1. `git pull`，确认工作区干净；记下当前 nt-hub 版本号（`cd hub && pnpm exec wrangler deployments list`），作为回退点。
2. 通读 `hub/public/hub/items.js`。
3. 查新条目（第 3、4 节）。
4. 写入条目、解读、头图、标志（第 5–7 节）。
5. 重选 Top 5（第 2 节）：先删掉所有旧的 `top`，再给新的 5 条设 `top: 1`…`top: 5`。
6. 校验：`items.js` 能加载；`id` 不重复；每条都有英文标题、英文摘要和中英文解读；`cat` 合法；`img` 文件都存在；`top` 正好 1–5 各一条。注意 `url` 可能是某条的最后一个字段，逗号和右括号要保持合法。
7. 把 `hub/public/hub/index.html` 和 `hub/public/hub/a/index.html` 里三个资源链接的 `?v=` 改成新值（格式：日期加一个字母，如 `?v=20261119a`），避免浏览器用旧缓存。
8. 只提交 `hub/` 下的文件（含新增的 `img/`、`logos/`），提交说明写「NT Hub YYYY-MM-DD issue: N new items, new Top 5」，然后 `git push && (cd hub && pnpm exec wrangler deploy)`。push 失败就不部署。
9. 线上核对 `https://neuralthermal.com/hub/?lang=zh` 和 `?lang=en`，确认以下几项：
   - 轮播的 5 个标题是本期新的 Top 5；
   - 各栏目都有内容，新条目出现在列表里；
   - 随机打开几篇新的解读页，正文、头图、原文按钮都正常；
   - 图片和标志都能加载；
   - 电脑宽度（1280 px）下每个列表标题都只占一行。
10. 汇报：本期新增条目（按栏目）、新的 Top 5（以及换了哪几条）、提交链接、回退用的上一版本号。出错要如实说明，不留下发布到一半的状态。

**回退**：Cloudflare 后台 → Workers → nt-hub → Deployments → Rollback，或在 `hub/` 下执行 `pnpm exec wrangler rollback <版本号>`。

**访客统计**（2026-11-18 起）：全站每个页面都加载 `/hub/t.js`（主站 Worker 自动插入，NT Hub 页面里直接写了），记录访问的页面、来源、国家 / 地区 / 城市和停留时长，存进 D1 数据库 `nt-visits`（`hub/worker.js` 的 `/hub/api/hit`）。不记录 IP，不用 cookie，保留 180 天。用户在 `/hub/admin/` 查看，需要访问密钥（Worker 密钥 `STATS_KEY`，只记在本机「对内_不上线/访客统计.md」，不进仓库）。改 `index.html` 时不要删掉 `t.js` 那一行。

**不要动**：主站源码（仓库根目录的 `src/`、`public/`）和主站 Worker `neuralthermal`。NT Hub 是独立 Worker `nt-hub`，只接管 `neuralthermal.com/hub*`。

## 10. 在新电脑上恢复自动更新

1. 克隆本仓库，装好 Node、pnpm、wrangler（登录 Cloudflare 账号）和 GitHub CLI（`gh auth login`）。
2. 在 Claude 桌面版里新建一个定时任务，每天上午 9 点运行，提示词写：「按仓库 `hub/UPDATE_RULES.md` 的规则发布今天的 NT Hub，并用中文汇报」。
3. 先手动运行一次，把需要的工具权限批准好，之后就能自动运行。
