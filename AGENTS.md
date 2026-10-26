# Agent 交接说明

更新：2026-10-26。请先读本文件，再修改项目；用户在新对话中的明确要求优先。

## 项目与启动

- Wenjia 的个人作品集网站，原生 HTML / CSS / JavaScript，无需 npm 构建。
- 当前实现位于 `visual-exploration/`，不是仓库根目录的页面。
- 在仓库根目录运行：`python -m http.server 4173 --bind 127.0.0.1 --directory visual-exploration`。
- 首页：`http://127.0.0.1:4173/#home`；Gallery / Archive：`#archive`；项目：`#project/aimpower`。
- `index.html` 和 `space.html` 是两个入口；修改资源引用时两边同步。URL 的 `revision` 只是预览标记，不是版本系统。

## 文件分工

- `home.js` / `home.css`：首页 In focus、Design / Research 展开和滚动。
- `space.js` / `space.css`：路由、项目数据、Gallery、阅读层、年份筛选、浮动工具。
- `edge-glass.js` / `edge-glass.css`：图片接近边缘的轻微粘滞形变。
- `aimpower.js` / `aimpower.css` / `aimpower-assets.js`：AImpower 案例和交互。
- `lexicon.js` / `quipu.js`：已有研究项目。
- `assets/`：素材（以上路径均相对 `visual-exploration/`）。
- `content-import/aimpower/COVERAGE.md`、`process-assets.json`：设计覆盖核对、素材来源及节点信息。

## 用户已确认的偏好

- 使用中文沟通，直接完成授权范围内的工作；不要反复确认，也不要擅自发布或提交。
- 页面应简洁、有留白、方便阅读，避免装饰性文案和长段文字。
- 案例叙事重点：我做了什么 → 发现什么 → 为什么这样设计 → 下一步；团队工作不要全部写成个人贡献。
- 参考 Jason Spielman 的内容组织： https://jasonspielman.com/ 。不是照搬其视觉或文案。
- 首页展开跟随全局滚动，连续经过 Design 和 Research；不要改回鼠标悬停自动展开。
- 点击项目标题可展开并滚动到居中位置；展开内容的介绍可以有很小的滚动方向偏移。
- 首页图片不要悬停缩放，不要恢复 “View project” CTA；图片和项目名仍可点击。
- 边缘形变要轻微、按图片尺寸限制。不能出现接缝、错位、图片跟不上滚动，或形变比小图还大。
- 曾尝试“原生图片中心 + 独立边缘图层”，用户明确不满意。当前使用统一图片采样；不要重新引入分片拼接。

## 当前实现状态

### AImpower

- AImpower.org 是合作方，项目显示名称以 Figma 封面为准：A Zoom + Web System for Stutter-Affirming Progress。内部路由仍用 aimpower。
- In Focus 指首页下方 Design / Research 滚动展开区域；首屏标签只显示 UI/UX & accessibility，不加 In focus。
- Figma 最终来源： https://www.figma.com/design/o41gKUr8VhjGa4pDe7xg7A/26SP_Portfolio?node-id=378-8810 。使用 Figma 工具前加载对应技能。
- 已移除竞品分析，研究证据放在可展开区域；有研究决策、支持流程、设计演进、三端方案切换。
- 正文最大约 600px，设计图约 960px，整体居中、内部左对齐。
- 已覆盖 Zoom 插件、PWS 仪表盘/反思/Insights、SLP 仪表盘/客户/目标创建、设计系统及评估。补齐了四个会议选择/回顾状态。
- 这是精选案例，不是逐页复刻全部幻灯片。具体对应见 COVERAGE.md。
- 原始素材保存在本地，展示主要使用无损 WebP，不要使用临时 Figma URL。
- 案例文章使用 `data-edge-glass="off"`，界面图原生同步滚动，不做整图玻璃替换。

### Gallery / Archive

- Gallery 为项目数据库，目前 13 项：原有九项，加上 Stutter-Affirming Progress、Unity、PomeloX、Google Future of Work。所有首页项目必须也存在于 Gallery。
- 占位项目已删除。年份从 `notes` 数据自动生成，目前 All / 2026 / 2025 / 2024 / 2023 / 2022。无项目的年份不显示；无效筛选回退 All。
- 新增项目时更新 `notes`、本地素材和对应内容渲染；年份无需手改 HTML。可用 `description` 字段增加左侧描述。
- 图片画框从视口顶部延伸到底部；左侧描述按网格内缩，手机端在底部显示。
- 所有项目统一使用 `#note-reading` 阅读窗口，运行时移到 body 下，首页和 Gallery 调用相同的 projectMarkup。Close 固定于视口顶部，Index、进度条和回顶操作此容器，不是 window；关闭恢复来源页及滚动位置。
- 不要给 `#note-reading` 加会改变 fixed 定位参照的 filter / backdrop-filter / transform，也不要恢复滚动位置补偿 Close 的做法。
- 章节索引由内容生成。查找标题所属 section 时必须限制在内容根节点以内，不能误选或重命名外层 `#note-reading`。
- Gallery 的玻璃 canvas 放在 `.archive-space` 内，低于描述/年份/导航；阅读时转入阅读层，避免图片遮挡工具。
- 向上箭头为简单 SVG 线条图标。

## 验证与工作状态

- 最近检查：桌面 1440px 和手机 390px，9 个 Gallery 项目的打开/关闭、Close 固定、Index/回顶、年份切换和空年份恢复均通过。
- AImpower 已检查 69 个图片展示位置、18 个切换面板和 9 个章节；图片可放大、Tab 切换支持键盘。
- 修改后至少执行相关 JS 的 `node --check`、`git diff --check`，并用浏览器检查所改页面的桌面和手机布局。
- 不要把本地浏览器的流畅度测试当作所有设备的性能保证。
- 当前存在大量本轮修改及新文件，尚未提交/推送。保留这些内容，不要用 reset/checkout 覆盖。
- 上一环境是 Windows PowerShell；若沙箱出现 MXC 启动错误，可按当前工具权限机制重试。新端不应照搬旧环境的临时路径、会话 ID 或后台服务状态。

- Lexicon 封面：用户指定的植物图保存在 `visual-exploration/assets/lexicon/cover.png`；首页及 Gallery 使用静态图、contain 完整显示，不要改回自动播放的视频封面。项目详情中的原始影片保留。

## 最新状态（2026-10-26，revision=13）

- Design 三项：Stutter-Affirming Progress、Unity 的 Precision Management System for Shipbuilding、PomeloX。
- Research 三项：Google 的 Future of Work、The Lexicon of Wish、Quipu。Google 与 Unity 均保密。
- 首页项目介绍使用 assets/logos/：Unity；PomeloX 的 Chinese Union；AImpower 的 Cornell + AImpower.org；Google 的 Google + Cornell。标识不参与边缘玻璃效果。
- Unity Figma：同一 26SP_Portfolio 文件的 node-id=382-19451；PomeloX：382-19452。
- Google 原稿：https://www.figma.com/slides/I58B611kxIqy9HxKeufRPc 。Google 案例说明团队研究，不能擅自归为个人完成。
- Unity 解锁后有完整 12 页原稿及章节说明；Google 有研究到三个设计方向的精选叙事和完整 34 页正式演示稿（不含未编号的备选草稿）。原稿作为文档图片展示，可滑动翻页和放大；不再显示文字稿入口。
- private-cases.js 管理解密、私密案例阅读和图片按需加载。assets/private/ 下只有 AES-256-GCM 密文、salt 和 PBKDF2 参数（SHA-256，310000 次）。正文、图片均加密；公开 JS 不保存密码。
- 密码沿用用户指定值，不在交接文档记录。解密密钥仅在当前页面内存，刷新或 Reset 重新锁定；旧 sessionStorage 的 yes 标记不能解锁。不等同于服务器账户鉴权。
- 若修改密码，必须用原密码解密后对正文和全部图片重新加密，并同步生成 config.json，不能只改表单校验。不要将未加密的私密原稿放入网站目录或 Git。
- 原始 Figma 导出及构建临时文件在本机临时目录，不能依赖它们永久存在；跨端需要从上述 Figma 源重新导出。网页运行所需的密文已保存在仓库工作区。
- new-designs.js 只负责 PomeloX 精选页面。Unity 原有简介占位页已移除。
- 所有项目由统一 projectMarkup 渲染。Lexicon 在 Gallery 也使用首页原本的完整 lexiconMarkup（含影片和研究过程），Quipu 同样统一，不能再恢复 researchArchiveMarkup 的旧简版。
- #note-reading 带 dialog 语义、背景 inert、焦点返回与 Escape 关闭；图片放大弹窗的 Escape 不应同时关闭项目阅读窗口。
- buildReadingIndex 遇到已定义的 data-project-index 时必须保留原章节 ID，以免破坏 AImpower 内部跳转；其他旧项目自动生成索引。
- Private access 保留 mailto:wenjiashi616@gmail.com 申请入口。
- Lexicon 原图最右侧 x=1665..1718 是黑色截屏边缘；CSS clip-path 裁掉右侧3.2%，不修改原文件。此封面不做 WebGL 替换，键盘 focus-visible 保留。
- revision=13 已验证 1440px 和 390px：首页3+3分类、13项Gallery、年份筛选、合作方logo、Lexicon两入口内容一致、滚动位置恢复、固定Close、进度、索引/回顶、错误密码与解锁/Reset、Unity12页和Google34页翻页、图片放大/Escape、AImpower标签切换、无横向溢出及JS/资源错误。JS语法与git diff --check通过。
- 未提交、未推送、未部署。最新本地预览：http://127.0.0.1:4173/?revision=13#home 。

## Google 与私密封面更新（2026-10-26，revision=14）

- Google 正文改为 8 个原生网页章节：三钻过程、八趋势气泡图、访谈发现、方案收敛、共享账户视图、AI 回退、上下文交接、下一步验证。整页幻灯片只保留在末尾完整演示稿中。
- 三钻、气泡、研究发现和方案组件支持点击及键盘切换；回退方案有勾选进度。交互是对团队提案的网页解释，不应写成已经上线或有验证成效。
- 正文 HTML 位于加密 manifest 的 google.body；private-cases.js 负责通用交互。不要将解密正文直接保存到公开 JS。Google 界面独立素材来自 Slides 的 330:1406（位于 324:283），加密文件 google-key.enc。
- Google / Unity 首页使用真实关键图的预先模糊预览 assets/google-preview.png、unity-preview.png；logo 独立覆盖，始终清晰。解锁后 hydrateCovers 加载内存 Blob 原图，首页和 Gallery 同步。未解锁提示 Enter password to view。
- 公开预览已烘焙模糊，不含可直接还原的清晰源图。清晰素材仍加密。Google cover=google-key.enc；Unity cover=unity-07.enc。
- 两个项目共用演示稿浏览器：图片左右滑动、侧边箭头、下方页码下拉、方向键翻页、点击放大。无 Read page text。相邻页预取，新图解码完成前保留当前页，避免闪白。
- Private access 邮件申请文案明确分两行。Google 手机阅读时索引及回顶位于右下角，避免遮住趋势图；章节索引采用点击切换，避免悬停先打开再被点击关闭。
- 本轮保持统一阅读窗口、固定 Close、顶端进度条、项目加密及两入口一致。未提交或部署。
- revision=14 已验证 1440px / 390px：全部原生图表与标签、勾选进度、解锁前后封面、真实触摸滑动、键盘/箭头翻页、手机索引展开、邮件换行、无横向溢出和 JS/资源错误；47 个加密图片及 manifest 完整性、JS 语法、git diff --check 通过。
- revision=15：首页 Google / Unity 私密封面使用 object-fit:cover 铺满预览区，容器背景透明，避免 contain 留出灰边。Logo 独立保持清晰；两个 HTML 入口 home.css 版本同步。已检查桌面1440及手机390。
- revision=16：保密状态下 Google / Unity 的公司 Logo 直接叠在模糊封面上，移除白色圆角底框；已解锁状态不变。
