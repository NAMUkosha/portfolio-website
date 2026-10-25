# Agent 交接说明

更新：2026-10-25。请先读本文件，再修改项目；用户在新对话中的明确要求优先。

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

- 真实项目共 9 个：Melodeck、Company、G-PIXEL、Quipu、The Lexicon of Wish、Steampunk、Ultra Vision、Gofie、Ariel。
- 占位项目已删除。年份从 `notes` 数据自动生成，目前 All / 2024 / 2023 / 2022。无项目的年份不显示；无效筛选回退 All。
- 新增项目时更新 `notes`、本地素材和对应内容渲染；年份无需手改 HTML。可用 `description` 字段增加左侧描述。
- 图片画框从视口顶部延伸到底部；左侧描述按网格内缩，手机端在底部显示。
- 阅读层是独立滚动容器 `#note-reading`。Close 固定于视口顶部，Index 和回顶操作此容器，不是 window。
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

## 最新首页分类（2026-10-25）

- Design 仅三项：Stutter-Affirming Progress 项目、Unity 的 Precision Management System for Shipbuilding、PomeloX。Research 仅 The Lexicon of Wish、Quipu。Gallery 九项保持不变。
- Unity Figma：node-id=382-19451；PomeloX：node-id=382-19452（同一 26SP_Portfolio 文件）。
- Unity 仅展示标题、简介和抽象 Gaussian 模糊预览；点击标题或预览进入现有密码弹窗。没有导出私密设计图片。解锁后为简介和邮件联系页。
- 密码已按用户要求更新（不在交接文档重复记录），仍为原有客户端演示机制，不是服务端加密保护；正式保护需另行实现后端鉴权。UI 不再公开提示密码。
- Private access 提供 mailto:wenjiashi616@gmail.com 申请入口。
- new-designs.js 提供 Unity 简介及 PomeloX 精选页面；PomeloX 使用本地 assets/pomelox/ 四张真实界面素材，仅精选发现/参与/发布内容，未逐页实现全部设计。
- Lexicon 原图最右侧 x=1665..1718 是黑色截屏边缘；CSS clip-path 裁掉右侧3.2%，不修改原文件。此封面不用 WebGL 替换，防止白底轮廓；键盘 focus-visible 保留。
- revision=11 检查桌面1440与手机390：首页3+2分类、错误密码/解锁跳转、邮件入口、PomeloX图片及4章索引、无横向溢出和JS错误。
