# Stitchloom · 钩针与编织计算站

面向英文市场的第 2 个工具站。原生 HTML/CSS/JavaScript；无付费 API、外部字体、运行依赖或账户系统。双击 `index.html` 即可使用，源码放在独立的 `stitchloom` 目录。

## 首版功能

- `index.html`：密度与针数计算。输入实测样片与目标宽高，计算针数、行数和预计尺寸；支持图样的“倍数 + 额外针数”和取整方向。
- `blanket-size-calculator.html`：毯子尺寸与针数。Baby/Lap/Throw/Twin/Queen 可编辑参考尺寸，支持英寸、厘米；不包括独立边框。
- `stitch-increase-decrease-calculator.html`：单行均匀增减针。输出从头到尾的操作顺序，校验旧针数消耗与新针数产出；支持 US crochet 和 knitting kfb/k2tog。
- 每页可下载 TXT 项目笔记、复制结果、打印或另存 PDF。数据只保留在当前页面，不上传、不存储。
- 三个不同任务的静态工具 URL、英文说明、公式、实例、FAQ、内部链接、隐私和条款、结构化数据。

没有真实关键词搜索量与竞争度验证；这些页面提供搜索入口，不承诺收录、排名、AI 引用或广告收益。

## 本地运行

直接双击 `index.html`，或安装 Node.js 后运行：

```sh
npm run dev
```

打开 `http://127.0.0.1:4174`。无需 `npm install`。

```sh
npm test
npm run build
```

`npm test` 校验密度公式、尺寸换算、图样倍数、输入边界及数千种增减针的针数守恒和间隔平衡。`npm run build` 复制上线资源到 `dist`，不包含源码测试和文档。

## GitHub 与 Cloudflare

推荐为本站建立单独的 `stitchloom` GitHub 仓库，上传本目录内容，让仓库根目录直接包含 `index.html` 和 `package.json`。

Cloudflare Pages：框架 None，构建命令 `npm run build`，输出目录 `dist`，生产分支选实际主分支。若同一仓库存多个站点，则将本站构建根目录设为 `stitchloom`。

Cloudflare Workers 静态资源部署：构建命令 `npm run build`，部署命令 `npx wrangler deploy`。仓库根目录的 `wrangler.jsonc` 明确指定静态资源目录为 `./dist`。站点没有服务端 Worker 逻辑。

当前正式域名为 `https://stitchloom.luqihang594241.workers.dev/`，记录在 `package.json` 的 `homepage` 中。未设置构建环境变量时，`npm run build` 默认使用此域名生成 canonical、og:url、sitemap.xml 和 robots.txt sitemap 地址，不会因遗漏变量而缺少 sitemap。

切换正式域名时，在构建环境中设置 `SITE_URL` 为新的 HTTPS origin（不含子路径），重新构建并发布 `dist`。环境变量优先于 `homepage`。

源码根目录也提供 `sitemap.xml` 和带 Sitemap 声明的 `robots.txt`，支持直接发布当前域名的静态文件；改用其他域名直接发布源码时，需要同步更新这两个文件及 `homepage`。推荐通过构建发布，以自动生成所有 URL。

更新 GitHub 并等待 Cloudflare 部署成功后，打开 `https://stitchloom.luqihang594241.workers.dev/sitemap.xml`，确认能看到包含 5 个网址的 XML，再在 Search Console 的 Sitemaps 中提交 `sitemap.xml`。提交成功提示只代表接受请求，需继续确认列表状态为 Success；站点地图被读取不保证页面被收录或获得流量。

## 广告和 Ahrefs

三个工具页已接入用户提供的本站 HilltopAds 横幅与点击弹窗广告，代码集中在 `ads.js`。Ahrefs 保持空白。

三个工具页都预留：

- `AHREFS_ANALYTICS_START/END`：head 中粘贴 Ahrefs 统计代码。
- `AD_HEAD_START/END`：仅当广告后台要求放在 head 时粘贴。
- `AD_BANNER_START/END`：顶部普通文档流的 100% 宽横幅，随页面滚动。`ads.js` 的 `HILLTOPADS_BANNER_START/END` 加载用户提供的真实横幅脚本；素材等比居中、小屏缩小，未填充时不占高度。右侧仅有 ×，关闭后本次页面不再展示，刷新恢复。不重复请求广告。
- `ads.js` 的 `HILLTOPADS_POPUP_START/END`：点击 Save project note、Copy results 或 Print this plan 时尝试打开用户提供的 `bold-consequence.com` 广告链接，原功能继续执行。每次页面访问最多尝试一次；输入、重置、切换单位和关闭横幅不会触发。脚本合成点击及禁用按钮不触发；浏览器可能以标签页或窗口打开，也可能拦截。直接链接不作为脚本加载。
- `AD_BODY_START/END`：仅当广告后台要求放到 body 末尾时粘贴。

不要在多个位置重复添加同一个脚本。没有接入视频广告。实际素材大小和展示由平台提供；`loaded` 只表示脚本已加载，不保证广告填充。可在开发者工具检查 `#hilltopads-banner-loader` 的 `data-ad-status`（loading/loaded/error）以及 `#hilltopads-integration` 的 `data-popup-status`（ready/attempted/error）。隐私页已同步说明；后续启用 Ahrefs 时再更新对应说明。

浏览器检查使用拦截后的测试素材与模拟弹窗，不访问真实广告库存，不把布局或代码检查当作真实广告展示验证。

## 计算边界

密度按同一种针法、洗涤干燥后的矩形织物测量。针数 = 目标宽 × 样片针数 ÷ 样片宽；行数同理。图样有效针数 = 重复数 × 整数 + 额外针数，至少保留一整个重复；行数取最近整数且不少于 1。预计尺寸使用取整后针行数反算。

增针以 1 旧针变 2 新针，减针以 2 旧针变 1 新针。单行外的变化会报错。剩余平针分布在增减针之前、之间和之后，间隔最多相差 1 针。没有为边针、对称塑形、圈织或花样单独预留位置。

Crochet 使用美式术语（US sc 对应 UK dc），不自动添加起针链或起立针；knitting 使用 kfb，不能把序列中的 kfb 直接替换为 M1。毯子预设是示例，非安全或通用规格标准。本站不计算用线量或完整服装放码。

## 搜索引擎站点地图检查

更新 GitHub 并等待 Cloudflare 部署成功后，打开 https://stitchloom.luqihang594241.workers.dev/sitemap.xml ，应显示 XML 网址列表，不能是首页或 404。然后在对应 Google Search Console 网站属性的 Sitemaps 中提交 `sitemap.xml`，检查状态是否为 Success；也可向 Bing Webmaster Tools 提交同一地址。提交成功提示仅代表接受请求，成功读取也不保证收录、排名或流量。

## Cloudflare Workers 发布目录

本项目的 `wrangler.jsonc` 已指定 `assets.directory` 为 `./dist`，Worker 名称与本站目录名一致。上传 GitHub 时，把此配置文件与 `package.json` 放在同一级，并保留 `scripts/build.mjs` 的子目录结构。

- 构建命令：`npm run build`
- 部署命令：`npx wrangler deploy`
- 构建根目录：独立仓库为 `/`；共用仓库时为本站子目录。

提交后确认 Cloudflare 构建使用最新 GitHub 提交。旧日志若显示 `Set SITE_URL`，表示尚未使用本次修复后的构建脚本；最新构建会显示已生成 sitemap 和 canonical。发布目录应为 `dist`，不要再让自动检测选择仓库根目录 `.`。完成部署后检查正式网站 `/sitemap.xml`，再到 Search Console 重新提交。
