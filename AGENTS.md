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

## Google 视觉与叙事打磨（revision=18，2026-10-26）

- 根据 Figma Slides 原稿重新读取三钻、趋势象限、访谈和三方案。开篇讲清楚 GCBP 销售/市场协作问题与三项设计回应。团队贡献保持团队表述。
- 三钻恢复发散/收敛结构、方法和阶段产出；气泡恢复原稿位置/颜色，侧栏展示趋势信号、研究依据、设计含义，可悬停/点击/键盘切换；可突出研究聚焦的四项趋势。
- 新文件 google-case.js / google-case.css：独立原生交互及局部 WebGL 玻璃渲染。参考原稿 50% 填色、refraction .76、depth45、lightAngle -45 等属性，网页用折射采样、边缘高光、叠色和接触处轻微形变近似；不是直接使用 Figma 渲染引擎。标签保持 DOM 清晰可访问。
- 图表只在交互变化时短暂更新，离屏暂停，关闭释放 GPU/观察器，尊重减少动效；WebGL 不可用时保留透明 CSS 气泡与完整交互。
- AI 回退重写为具体场景和三阶段：警告来源过期→暂停并按顺序核对→携带上下文交给人工。只有演示状态，不调用真实 AI 或发送信息。
- 加密 manifest 新增 google.header，google.body 继续保存私密正文。不得把正文导出到公开 JS。正文内跳转在阅读容器中定位，不改全局路由。
- 完成一次集中检查：1440/390、解锁、三钻、WebGL玻璃和悬停侧栏、聚焦筛选、回退步骤、34页原稿、关闭重开、无横向溢出/脚本错误；JS语法及差异检查通过。
- 本地服务此前已停止，本轮已重启。预览：http://127.0.0.1:4173/?revision=18#project/google 。未提交或部署。
- revision17 首页左侧异常形变已修正：内容栏不再当作折射侧栏，上下边缘效果保留；当时浏览器验证被审批额度中断，未单独复验。
- revision=19：所有项目章节 Index 当前项改为中性灰；共用演示稿箭头改为正圆（桌面44px、手机40px）。Google 各章增加细分隔线及间距，趋势总结使用 Google 黄底，5→50+→3 收敛使用 Google 蓝底，人物场景用红色细线、最终总结用浅蓝突出。1440/390 及 Google/AImpower 共用索引检查通过。两个 HTML 入口的 CSS 版本已同步。

## Google 排版调整（revision=20，2026-10-27）

- 按用户的新方向统一 Google 案例网格：内容区最大1040px；标题、正文、三钻、趋势图、原型、原图和演示稿共用左边线。正文行宽660px、章节标题740px，右侧留白；不再单独居中窄标题。
- 撤掉 revision19 的大面积黄/蓝底块，章节使用2px Google四色通栏细线（贯穿内容区），总结用留白、字号和灰色细线区分。
- 内容及加密 manifest 未改；共用灰色 Index 和正圆翻页箭头保留。两个入口 google-case.css 版本同步为20。
- 本轮集中检查桌面与390px手机：标题/图表左侧基线一致，无横向溢出；git diff --check通过。未提交或部署。

## 统一案例布局与索引（revision=21，2026-10-27）

- 新增 case-layout.css，在两个入口最后加载。13个项目共享1040px外层网格，正文660px、标题740px；标题与主图片区域共用左边线。PomeloX/Unity窄正文不再单独居中；Lexicon/Quipu/Gofie章节改为标题在上，旧Gallery双栏改为简介在上、图文在下。内部图表及设备组合保留，正文内容未改。
- Close 清除全部状态的圆角、背景、描边、阴影及轮廓；键盘焦点以下划线标识，固定定位保留。
- Unity/Google演示稿翻页箭头改为SVG chevron，图标与正圆按钮中心重合。
- 共享Index支持鼠标悬停展开；玻璃菜单带短暂回弹、关闭缓动和160ms离开宽限，按钮跟随指针最多3px。触屏/键盘仍可点击切换；鼠标先悬停后点击不会马上关闭。遵守减少动效设置，当前章节保持灰色。
- 13个项目已集中核对桌面/390px手机的容器与标题基线和横向溢出，Close样式及演示稿SVG中心检查通过；两份修改JS的node --check、git diff --check通过。共享space.js/private-cases.js版本同步21；未提交或部署。

## 首页与 Archive 批注调整（revision=22，2026-10-27）

- 新增 interface22.css，两个入口在 case-layout.css 后加载；home.js/space.js/private-cases.js版本同步22。移除 Archive 的 Personal archive 标题。
- 首页个人介绍移到上方并放大字号；首个项目卡缩小，标记 Selected work。Design/Research 当前分类使用全宽黑底白字与轻微翻折展开过渡；增加分类及条目间距，当前项目标题加深。仍由全局滚动驱动展开。
- 访问按钮为黑色玻璃锁定态、白色玻璃解锁态，带锁图标；移除 Reset 点击操作。按用户保持解锁要求，非导出CryptoKey可通过IndexedDB结构化克隆、以sessionStorage随机token恢复当前标签页的解锁状态；刷新无需重输。密码与明文正文不写入存储；关闭标签页后新会话仍需密码。此前仅内存/刷新锁定的说明由此条更新。
- Menu/Index圆按钮完全固定，不再跟随指针；只让左侧面板做轻微形变回弹，展开780ms、悬停延迟80ms、离开宽限160ms。首页 Menu 改纵向排列。
- 桌面 Archive 的年份固定在索引顶部，项目标题列表约7项可见、上下渐隐，无滚动条；滚轮及上下键同步切换图片与项目，选中项自动保持可见。手机保留适合窄屏的横向项目索引。
- 已集中检查首页层次、黑白访问按钮、解锁后刷新恢复、Research分类黑色全宽条、纵向菜单、Archive末项与年份固定、2026筛选2项/All恢复、390px手机首页与横向溢出。3份修改JS语法及git diff --check通过，未提交或部署。

## Archive 双视图及细节精简（revision=23，2026-10-27）

- 首页项目名后的箭头、底部 Get in touch 文案移除，Email/LinkedIn 保留。分类黑色通栏撤回，改为深浅文字与短细线缓动标记，仍跟随全局滚动展开。
- 锁定按钮使用均匀半透明黑色，无渐变；解锁白色状态及标签页内恢复逻辑不变。
- PomeloX 样机本身新增半透明玻璃窄边、高光与轻投影，使设备与浅色背景分开，不是整块卡片加粗框。
- 桌面 Archive 标题索引改为约5项、缩短行距，年份与列表间距38px，上下渐隐保持。手机仍用横向紧凑索引。
- 新增 Carousel / Tiles 双视图，共用 notes、年份、当前项目与左侧介绍。Tiles 三列小图（手机两列），鼠标悬停或键盘聚焦更新介绍，点击打开统一阅读层。列表可滚动浏览全部13项；保密预览与解锁图片沿用原数据。Tiles 不参与边缘玻璃采样。
- 已集中检查桌面/390px：13项平铺、2026两项筛选、点击打开/关闭返回、手机无横向溢出、PomeloX窄边与首页箭头移除；JS语法及git diff --check通过。未提交或部署。

## Archive 简化（revision=24，2026-10-27）

- 按最新反馈完整移除 Tiles 平铺视图、Carousel/Tiles切换入口及对应JS/CSS，Archive仅保留原轮播。
- 桌面右侧5项项目列表以视口50%垂直居中，与左侧介绍的中心线一致；年份仍独立固定在顶部。手机紧凑索引保持。
- 已检查左右中心坐标一致、项目切换、2026筛选及390px手机无横向溢出；JS语法与git diff --check通过。未提交或部署。

## 首页批注与封面（revision=25，2026-10-28）
- Private access 居中，手机另起居中行；标识改为 Wenjia SHI，介绍改为 Hi, I'm Wenjia Shi。
- 首页第二精选项目改为 Google；Google 使用用户提供的 assets/google-cover.png 公开封面，解锁不再替换此封面，正文加密保持。
- Quipu 首页、Archive 与详情首图统一 assets/quipu/cover.png。
- html scrollbar-gutter:stable 避免页面切换因滚动条消失而横移。
- 分类保留全局滚动展开，标题随滚动到顶并由下一分类顶替。
- 桌面与390px手机已浏览；首页/Archive标识x坐标相同，Quipu新图加载成功，手机无横向溢出。JS语法及差异检查通过。未提交或部署。预览端口4174。

## 首页与私密封面（revision=29，2026-10-28）
- Design / Research 改为独立的全局滚动场景：分类标题吸顶，由下一分类顶替；当前分类三个项目标题始终可见，滚动切换展开项，点击标题可展开或收起。桌面和390px手机检查通过。
- Google 换用用户提供的新比例封面；Unity 换用新首页封面、白色Unity标识及外高桥造船厂标识。首页 AImpower/Google 的 Cornell 标识移除。Google 封面参与轻微边缘玻璃形变。
- Google/Unity新封面及Unity Gallery的电脑、船舶图以既有密码和salt加密为 AES-256-GCM 密文；公开目录只保留低分辨率模糊预览。明文不在网站目录，密码不在代码或文档。
- PomeloX Gallery 改为三张手机界面组合，设备各有轻薄玻璃边框；Unity Gallery 改为电脑与船舶模型组合。手机隐藏非当前轮播图片，避免上方遮挡。
- 验证了新图解锁后加载、无脚本错误、手机无横向溢出、JS语法与git diff --check。未提交、推送或部署。预览 http://127.0.0.1:4174/?revision=29#home 。

## 首页简化与 Archive 索引（revision=31，2026-10-28）
- 首页整个 #home-editorial 关闭边缘玻璃，所有首页图片原生显示；Gallery 和案例原有处理不变。
- 解锁成功后隐藏顶栏访问按钮，刷新后恢复解锁状态时同样隐藏。
- 首页首屏已有 AImpower/Google，分类中不重复；Design 留 Unity/PomeloX，Research 留 Lexicon/Quipu。分类继续吸顶并由下一分类顶替，项目展开高度和透明度按全局滚动连续插值且有缓动；标题同时可见。
- Archive 桌面右侧列表上下加入中心留白，滚动定位改按按钮实际视口位置计算；首项、中间项、末项均能居中，当前标题保持高亮。手机布局不改。
- 已检查桌面/390px手机、解锁按钮隐藏、滚动分类、Archive首尾与中间项目居中、无横向溢出和JS错误；node --check及git diff --check通过。未提交或部署。预览 http://127.0.0.1:4174/?revision=31#home 。

## Flexi / Abi Gallery（2026-11-04，revision=36）
- Gallery新增Flexi、Abi（2023），compact-products.js/css负责统一阅读窗口中的两篇案例，两入口同步。各六章，补充研究、机制、结构、App、使用场景；36张本地图片，来源与原稿在content-import/compact-products。研究依据可展开，部分流程用HTML重做。Abi保持概念表述，不声称已验证医疗效果。
- JS语法、git diff --check、图片解码通过；浏览器工具kernel assets路径错误，桌面/手机布局尚未复验。未提交或部署。

## Flexi / Abi 排版（revision=37）
- Flexi按双图/三图组并列，收纳图采用左侧主图、右侧上下场景图。Abi手机界面改五屏等宽横向序列，窄屏可横滑。
- Abi系统架构与反馈循环改为原生HTML/CSS图表，保留可展开原图；完整App流程放入展开区。两入口资源版本37。
- JS语法、差异及生成HTML素材路径检查通过；浏览器与computer-use均因kernel assets路径错误无法启动，视觉复验仍受阻。未提交或部署。

## Abi 系统图复原（revision=38，2026-11-04）
- abiSystemDiagram改为原图空间结构的HTML模块+SVG连线：顶部四节点循环、五个分区（数据采集/信息反馈/用户/智能推荐/测量）、历史分析/进度及底部回传链路。蓝灰底、橙色标题、虚线分区和图标；不再使用四列卡片简化版。
- 桌面完整显示，手机在图内横向滚动，保留原图可展开对照。两入口compact-products资源版本38。
- 用本机Edge独立无窗口会话完成1440/390实际渲染及截图检查：无页面/阅读层横向溢出、模块文字溢出或JS异常；网络仅有既有favicon.ico缺失。检查记录与截图在content-import/compact-products。通用浏览器工具仍不可用，此次使用独立Edge验证。JS语法和git diff --check通过，未提交或部署。

## Abi 图片比例与系统图尺寸（revision=39，2026-11-04）
- 场景照统一4:3 cover裁切，保留手势/穿戴部位；手机等比例横滑。两张产品形态图改820px以内并排，detail-16通过CSS裁掉透明留白；爆炸图与光学传感图共用300px展示高度，手机180px，不裁结构细节。原文件保留。
- 系统架构图默认720px宽（手机适宽全图概览），Enlarge diagram切换至详细视图；手机详细视图可横滑，Reduce恢复概览与滚动起点。两入口版本39。
- 本机独立Edge检查1440/390截图、等高图片、资源加载、放大/缩小及横向溢出，通过。JS语法、git diff --check通过；无脚本/新增资源错误。未提交或部署。

## Ariel 内容重写（revision=40）
- ariel.js/css独立渲染原Gallery项目，8章覆盖旅程问题、双参与路线、利益相关者、实体触点、服务蓝图、LEGO情景、App和包装；保留原研究图展开，团队署名及概念边界。两入口同步，未提交部署。
- 1440/390浏览器检查：8章正常、图片无缺失、无横向溢出/JS错误；语法和git diff --check通过。

## 首页 / Archive 独立动效实验（2026-11-06）
- motion-study.html/css/js 与 assets/motion-study 五张 SVG 占位图组成独立实验，不改正式首页路由。沿用白色和原 edge-glass 连续采样形变。
- 桌面首页显示三张横向卡牌，滚轮依次切换卡牌与大字号介绍；最后一项出现 More work 箭头，点击后进入 Archive。导航也可切换，只有点击 Home 才返回首页。
- Archive 保持轮盘比例，首尾有边界，不循环回绕；移除分类小标题、计数和操作提示。手机支持滑动，介绍区域加白色遮罩保持清晰。
- 独立 Edge 实测1440/390、滚轮、触摸、末尾箭头、首尾边界和减少动效；无脚本/资源错误。JS语法及 git diff --check 通过。未提交或部署。
- 预览：http://127.0.0.1:4175/motion-study.html?v=2

## 动效实验焦点布局（2026-11-06，v3）
- 首页当前项目改为大字号叙事与缩略图并置的焦点区；相邻缩略图缩小、变淡并靠视口两边，不再等距排列。
- 首页5个精选、Archive9个占位项目，首页不展示额外Archive条目；转场共享已有卡牌。返回首页恢复上次精选位置，Archive仍有首尾边界。
- 桌面与手机实测滚轮/触摸、末尾入口、Archive第9项、返回位置、减少动效及资源加载；未出现脚本错误。独立实验预览 motion-study.html?v=3，未修改正式首页，未提交部署。

## 动效实验阅读节奏（2026-11-06，v4）
- 初始首页增加个人问候、简介与 Scroll to explore selected work 提示；向下滚动进入五个精选，向上可回问候。
- 卡牌切换延长至约1.9秒、视图转场约2.4秒，采用阻尼式长尾缓动与错峰；文字延后分层出现，约1.4秒淡入。滚轮节流延长，避免连续跳项。
- 使用五个现有项目的公开简介作为排版草稿，增加补充说明；缩略图仍是占位素材，不展示私密正文。
- 独立 Edge 检查桌面/手机滚轮与触摸、问候、Archive首尾、返回位置和减少动效；JS语法和差异检查通过。预览 motion-study.html?v=4，未提交部署。

## 动效实验稳定性（2026-11-06，v5）
- 普通卡牌切换与视图转场统一锁定输入，动画及文字停稳后额外180ms再接受新操作；期间的滚轮、卡牌点击、键盘与导航不排队、不打断当前动画。
- 新增实验专用 motion-glass.js，修正透明画布的预乘Alpha与混合方式，防止图片从原生显示切入玻璃层时额外变淡；扩大左右边缘作用范围，位移仍按图片尺寸限制。正式网站 edge-glass.js 保持不变。
- 预览 motion-study.html?v=5；检查连续输入、桌面/手机边界与减少动效，未提交部署。

## 正式首页 / Archive 动效改版（2026-11-06，revision=41）
- 用户确认首页暂时保留全部6项：AImpower、Google、Unity、PomeloX、Lexicon、Quipu；Archive仍15项。新增portfolio-motion.js/css，两HTML入口同步；原首页/Archive布局隐藏，新场景共享卡牌连续转场。
- 沿用motion-study的白色、玻璃、焦点图文区域与侧边淡色缩略图比例。个人问候、现有介绍、项目标题/描述/贡献/年份/合作方标识均沿用原内容；案例正文、加密数据、About未改。
- 滚轮触发阈值65降到24，普通切换约1.35秒，转场约2.1秒；保持动效结束后才接收下一次输入，文本同步缩短。实验页也同步此滚动手感。
- 通过原openProject/projectMarkup打开同一阅读窗口，返回保持场景位置；私密封面继续hydrateCovers与原密码流程。新增scene inert与直接项目链接关闭恢复。
- Archive保留年份筛选，首尾不循环；Home恢复上次精选位置。原space.js路由/阅读逻辑保留，由新适配层连接。
- 使用motion-glass.js预乘Alpha修正渲染器，识别新pm-orbit/motion-card，原edge-glass.js未改。Lexicon封面依旧静态contain、右裁3.2%、禁用玻璃。
- 独立Edge实测1440/390：轻滚切换、阅读打开关闭、Archive15项、2023筛选、私密入口、About、space.html第二入口、直接Ariel链接关闭返回；无新增脚本/资源错误及横向溢出。未重新测试密码解密，解密实现与密文未变。JS语法、git diff --check通过。未提交部署。
- 预览：http://127.0.0.1:4175/?revision=41#home

## Archive 连续轮盘与标签（2026-11-06，revision=42）
- 跨项目选择改为共享连续轮盘位置，每帧重新计算所有图片在圆弧上的位置、缩放、旋转与透明度；不再插值各图片起终点。按跨越数量延长动画，首尾仍不循环。
- 首页与Archive缩略图caption节点全部移除；项目按钮aria-label与图片alt保留。类型使用轻玻璃标签，年份用细分隔线与数字字距区分；标签内容不改。
- 修正直接打开#archive时新场景初始视图同步；手机介绍禁用内部滚动锚定，避免切换尺寸后标题被卷起。
- Edge实测944px/390px：首项到末项15个缩略图均依序经过中心，反向也完整通过；无小标题、横向溢出、脚本/资源错误。JS语法与git diff --check通过。两入口版本42，未提交部署。

## 首页标签、Archive预览及叠图（2026-11-06，revision=43）
- 首页旧文案/标签短暂淡出，新标题、介绍、完整标签与logo组分层淡入；不再仅动画p元素而让标签直接替换。
- 修正motion-glass画布仍挂在隐藏旧archive-space导致边缘图片消失的问题，新场景画布留在body，阅读时仍进入阅读层。左右/上下使用同一图片采样；draw直接请求同步绘制，避免每帧额外派发scroll刷新。
- Archive相邻项目移回可见范围并保持52%透明度。右侧名称列表约5行、上下渐隐，固定行高与中心留白；列表位置跟随轮盘同一连续进度，不再独立原生smooth scroll。列表滚轮和方向键可切换项目。
- 恢复有back素材项目的双图叠放、PomeloX三屏；悬停/键盘焦点展开。Unity额外船舶图仅解锁后显示；私密图片仍由原加密hydrate加载。首页保持单张主图，无caption。
- 实际浏览器检查944/390、15项正反向跨越、上下半隐图片实际绘制、三图悬停展开、标签动画结束、无横向溢出和脚本/资源错误；JS语法及git diff --check通过。性能结论仅限本机检查。两入口43，未提交部署。

## Archive 比例与灵敏度（2026-11-06，revision=44）
- Archive主图尺寸同时受视口宽度与高度约束，桌面最大380px；邻近项目缩小至84%、透明度40%、倾角减小。叠图静止时的错位与旋转收紧，保留悬停展开。
- Archive单步约595ms，长距离上限1.9秒，滚轮阈值16；Archive介绍淡入同步加快。首页阅读节奏与视图转场不改。
- Edge检查1440×900、944×650、390×844；两次轻滚在700ms后均已到位，无横向溢出、脚本或资源错误。JS语法/git diff --check通过。两入口44，未提交部署。

## 全站移除玻璃形变与旧站链接（2026-11-08，revision=45）
- 最新用户要求覆盖此前形变偏好：全站不再使用图片玻璃形变。删除 edge-glass.js、motion-glass.js、edge-glass.css 及所有入口引用、刷新调用和专用标记；首页、Archive、案例与 motion-study 使用原生图片。半透明 UI、轮播及悬停叠图保持。
- Google 趋势图删除独立 WebGL 折射渲染器，沿用原生 CSS 气泡及既有交互；解密后的旧 canvas 在初始化时移除，密文未改。
- 删除指向 wenjiashi.space 的 Original project 链接和 Gofie 空页脚；删除无调用的 researchArchiveMarkup 旧简版、废弃事件与样式，减少轮播每帧重复筛选。未全面重写路由/旧首页适配架构。
- 本地 1440/390 检查全部13个公开案例打开关闭、旧链接为零、无形变 canvas/替换图片、无横向溢出及脚本/资源错误；Gofie全部图片解码成功，检查顶部/中部/底部。私密案例未重新解锁实测，密文未改。检查脚本与报告：content-import/check-no-glass.cjs、no-glass-check.json。
- 两个正式入口及实验页资源版本45。未提交、推送或部署。预览 http://127.0.0.1:4175/?revision=45#home 。

## 连续滚动与弹簧收敛（2026-11-08，revision=46）
- 首页/Archive普通项目切换改用可连续重定向的弹簧：保留当前位置与速度，动画期间可继续滚动或反向；Archive使用共享轮盘位置同步图像和右侧索引，保留首尾边界。仅首页/Archive跨视图编排转场保持锁定。
- Archive输入间隔160ms、阈值12；首页290ms、阈值18，文本淡入缩短。轻微过冲后稳定收敛，不恢复图片玻璃形变。清理连续切换时旧文案残影，resize及减少动效时重置运动状态。
- 1440/390实测连续输入、中途反向、跨项目跳转中改目标、停稳及减少动效模式；无脚本/资源错误、横向溢出。node --check/git diff --check通过，报告content-import/motion46-check.json。未提交/推送/部署。

## 年份菜单与阅读工具恢复（2026-11-08，revision=47）
- Archive年份使用白色半透明圆角菜单，灰色选中状态；支持键盘方向键/Home/End、Escape、外部点击关闭，筛选仍使用原项目年份。
- 修复revision45删除edge-glass.css时误删共用层级造成的阅读工具遮挡：page-tools的z-index=12移入space.css，与玻璃渲染解耦。
- buildReadingIndex保留已有章节ID，为已定义data-project-index但缺少ID的章节补锚点，修复Ultra Vision目录无法跳转。
- 1440/390检查年份筛选、关闭菜单、13个公开项目工具可点击、目录跳转及回顶均通过，截图和报告content-import/controls47-*。私密案例未重新解锁；共用工具样式与逻辑修复适用于其阅读层。JS语法及差异检查通过，未提交/推送/部署。

## Archive邻近预览缩小（2026-11-08，revision=48）
- 保持焦点图尺寸，邻近上下预览从主图的84%缩至70%，随轮盘距离连续插值。位置、透明度、首页比例不变。
- 1440/390实测PomeloX及相邻预览，焦点比例保持、上下预览缩小，无横向溢出；JS语法/git diff --check通过。未提交/推送/部署。

## Archive边缘预览（2026-11-08，revision=49）
- 邻近预览从主图70%再缩至60%，焦点图尺寸不变；根据图片固有比例及倾角估算可见图像边界，使上下邻图约40%越出视口边缘，沿轮盘连续插值。
- 桌面1440、矮屏944及手机390截图检查通过；滚动、无横向溢出、无脚本/资源错误，JS语法及差异检查通过。未提交/推送/部署。

## 阅读层与导航稳定性（2026-11-14，revision=50）
- 场景独立层叠上下文，阅读层及工具位于其上，首页/Archive共用固定Close阅读窗口。
- 跨视图移除旧标题副本，隐藏非当前视图文案并设为inert；路由中断转场可重新同步，关闭阅读先恢复场景焦点可用性。
- Work改Selected；Private access默认锁图标，悬停/键盘焦点显示说明，点击打开密码弹窗。首屏右侧像素箭头逐行闪烁，附Scroll down，可点击进入精选；支持减少动效。
- 1440/390检查13个公开项目两种来源打开关闭、Close命中、快速路由切换、密码弹窗、无横向溢出/脚本及资源错误；私密密码解锁未重新实测。记录content-import/stability50-check.json。两HTML资源版本50，未提交部署。

## 首屏像素箭头与锁按钮（2026-11-14，revision=51）
- 首屏右侧箭头改为43个独立大像素格，按从上到下的顺序逐格亮起；桌面97×119，与介绍垂直居中，手机65×80放在介绍下方右侧。
- 锁按钮悬停/键盘聚焦从40px直接展开至166px，内部显示锁图标与Unlock full view，不再使用浮动说明框。
- 桌面1440/手机390截图与尺寸检查通过，无脚本错误及横向溢出；JS语法与差异检查通过。两入口版本51，未提交部署。

## 字符点云滚动提示（2026-11-14，revision=53）
- 参考Dragonfly实际加载后的字符体积与流动视觉，撤掉43格矩阵流水灯。新增scroll-field.js，以Canvas投影前后表面字符形成向下箭头，加入轻微扭转、向下流动的明暗与指针局部排斥/弹簧回拢。
- 首屏右侧居中，保持Scroll down及点击进入精选；离开首屏、阅读层打开或页面隐藏时暂停，减少动效模式静止。未恢复图片玻璃形变。
- 锁按钮保留revision52的142px展开宽度。两个入口同步加载新脚本。
- 桌面1440/手机390截图、无横向溢出、动画运行/暂停/减少动效/点击均通过，无脚本错误；JS语法与git diff --check通过。未提交部署。

## 固定箭头形态（2026-11-14，revision=54）
- 按用户要求取消点云整体旋转、起伏及自动形变，固定投影和基础坐标；内部明暗/字符流动保留。仅指针靠近产生局部扰动，移开后弹簧恢复。
- 1440/390实际逐帧坐标检查：空闲位移0，悬停产生扰动，移开后恢复；无横向溢出及脚本错误。两入口脚本版本54，语法及差异检查通过，未提交部署。

## 平面方格矩阵（2026-11-14，revision=55）
- 最新参考图覆盖此前Dragonfly方向：移除scroll-field.js字符点云，改为scroll-matrix.js平面实心蓝色方格矩阵，白色等距间隙，局部方格→圆点→空格变化。沿用向下箭头用途，格子中心与整体形态固定，无立体投影、字符或扭转。
- 光标附近只改变格子的填充与圆角，不移动网格；离开后恢复。保留离屏暂停、减少动效和点击进入精选。
- 两入口版本55。1440/390截图、无溢出、动画/暂停/减少动效/点击检查通过，无脚本错误；JS语法及git diff --check通过。未提交部署。

## 白色玻璃箭头（2026-11-14，revision=56）
- 用户撤回矩阵方向。删除scroll-matrix.js，新增scroll-glass.js：白色半透明立体箭头，头部缩小、杆身细长，带倒角、高光及浅阴影。仅此独立提示使用玻璃材质；不恢复项目图片玻璃形变。
- 默认静止，指针悬停驱动空间倾转及高光，离开弹簧回正；键盘聚焦轻微倾转，减少动效保持静止。停稳后停止动画帧，点击仍进入精选。
- 两入口版本56；1440/390截图与布局检查通过，无溢出及脚本错误。未提交部署。

## 厚玻璃材质（2026-11-14，revision=57）
- 按用户新参考图重做圆润厚玻璃质感：内置imagegen生成透明PNG，位于assets/interface/glass-arrow-v57.png。强高光、深色反射边缘及折射细节，保持细长杆和小头部。
- 用透明素材替换原Canvas多边形绘制，scroll-glass.js驱动CSS透视倾转与轻微高光叠层；这是图像材质加倾转交互，不是实时光线追踪。默认静止、移开回正及减少动效逻辑保留。
- 生成方式与完整提示词保存content-import/glass-arrow-v57-prompt.txt。两入口版本57，1440/390布局及素材显示通过，无横向溢出和脚本错误；语法与差异检查通过。未提交部署。

## 轻量滚动提示（2026-11-14，revision=58）
- 根据用户反馈降低箭头的视觉权重：桌面中心由81%移到73%，素材高度280→170px；手机中心76%→68%、高度160→118px。降低深色反射对比，文字减至10px。
- 新增glass-relief.js，将既有玻璃素材投射到依据轮廓生成的圆润深度网格。小幅转向产生表面视差与法线高光变化；不是完整体积玻璃或实时折射。默认静止，取消整体平移和Z轴摇摆，弹簧缓冲更柔和。
- WebGL不可用/丢失时保留透明图片及温和CSS倾转。减少动效静止，阅读/离屏暂停，停稳停止请求帧。
- 两入口版本58。1440/390截图、WebGL启用、布局无溢出及无脚本错误检查通过。未提交部署。

## 统一玻璃cell与滚动邀请（2026-11-14，revision=59）
- 首页About me/LinkedIn/Email改为独立玻璃cell，顶部Selected/Archive/About共用大cell。与Index展开面板共享完全相同的背景、边框、模糊与阴影参数，链接功能保留。
- 箭头空闲时每6.5秒轻微向下提示（最大4px），悬停/键盘聚焦暂停提示，微抬升、深度视差和光泽响应，移开柔和回正。降低动效模式全静止。
- 1440/390核对材质计算值一致、链接地址及About导航、悬停暂停/回正、减少动效，无横向溢出与脚本错误。三份JS语法及git diff --check通过。两入口版本59，未提交部署。

## 标识返回、滑动导航与三维实体箭头（2026-11-14，revision=60）
- 点击Wenjia SHI返回Selected问候初始状态，重置首页精选位置；支持从Archive/About及转场中返回。
- 新增navigation.js，当前导航使用中性灰底色，单个底色随Selected/Archive/About切换横向滑动；同步aria-current、窗口尺寸与字体加载，减少动效时直接定位。
- 删除glass-relief.js，新增glass-volume.js：对闭合的圆角箭头实体进行WebGL光线步进，计算表面法线、进入/离开实体的折射及程序化环境反射。无图片采样、无高度贴图；保留细长杆、小头部和悬停空间转向。WebGL不可用时使用SVG备用图形。
- 两入口版本60。1440/390检查标识从首页项目/Archive/About返回初始页、导航底色滑动、三维启用且img数量0、悬停侧面、减少动效；无溢出/脚本错误。语法及git diff --check通过，未提交部署。
