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

Cloudflare Workers 静态资源部署：构建命令 `npm run build`，静态资源目录 `./dist`；若控制台要求部署命令，使用它提供的静态资源部署配置。站点没有服务端 Worker 逻辑。

生产环境变量 `SITE_URL` 填实际域名的 HTTPS origin，例如 `https://your-site.pages.dev`，不要包含路径。重新构建后生成该域名的 canonical、og:url、sitemap.xml 和 robots.txt sitemap 地址。未设置时不编造域名。

## 广告和 Ahrefs

当前没有真实广告或统计请求，也没有复制 Layerwise 的专属广告位。

三个工具页都预留：

- `AHREFS_ANALYTICS_START/END`：head 中粘贴 Ahrefs 统计代码。
- `AD_HEAD_START/END`：仅当广告后台要求放在 head 时粘贴。
- `AD_BANNER_START/END`：顶部普通文档流的 100% 宽横幅，随页面滚动。代码放入 `#banner-creative`，移除 `#ad-banner` 上的 `hidden`；右侧 × 可关闭本次页面上的横幅。
- `AD_BODY_START/END`：仅当广告后台要求放到 body 末尾时粘贴。

不要在多个位置重复添加同一个脚本。实际素材大小和展示由平台提供；新站通常需要单独的站点与广告位。接入后同步更新隐私说明及实际需要的同意设置。

## 计算边界

密度按同一种针法、洗涤干燥后的矩形织物测量。针数 = 目标宽 × 样片针数 ÷ 样片宽；行数同理。图样有效针数 = 重复数 × 整数 + 额外针数，至少保留一整个重复；行数取最近整数且不少于 1。预计尺寸使用取整后针行数反算。

增针以 1 旧针变 2 新针，减针以 2 旧针变 1 新针。单行外的变化会报错。剩余平针分布在增减针之前、之间和之后，间隔最多相差 1 针。没有为边针、对称塑形、圈织或花样单独预留位置。

Crochet 使用美式术语（US sc 对应 UK dc），不自动添加起针链或起立针；knitting 使用 kfb，不能把序列中的 kfb 直接替换为 M1。毯子预设是示例，非安全或通用规格标准。本站不计算用线量或完整服装放码。
