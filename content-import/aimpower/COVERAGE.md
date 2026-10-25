# AImpower — editorial and design coverage audit

Source: https://www.figma.com/design/o41gKUr8VhjGa4pDe7xg7A/26SP_Portfolio?node-id=378-8810

## Editorial direction

The user requested selective storytelling inspired by https://jasonspielman.com/ and its Huxe case study: concise ownership, decisions, supporting visuals, and what follows. The website now uses a centered 960px visual column with text capped at 600px. Competitor analysis and long persona biographies are deliberately omitted. Research evidence remains available in an expandable section.

Research synthesis is attributed to the team. First-person claims are limited to the design lead responsibilities documented in Figma. The 86/71/57% findings are labeled as directional findings from seven dual-role experts. No SUS score, production launch, or unmeasured impact is invented.

## Final design coverage

| Figma frame | Site coverage |
| --- | --- |
| 378:9353 | Zoom layout and grid reference |
| 378:10581 | Default dashboard and in-meeting logging inputs |
| 378:10550 | Wave hand, affirmations, self-disclosure and feedback states |
| 378:10700 | PWS dashboard, contact and recent-meeting card |
| 378:10781 | Reflection mental model and title entry |
| 378:10814 | General/meeting-linked entry, survey inputs; four missing meeting-selection/review component states added |
| 378:10879 | Journal, review and sharing |
| 378:10904 | Insights and reflection history |
| 378:10741 | SLP dashboard |
| 378:10770 | Client list and individual profile |
| 378:10631 | Goal name, metric and preview |
| 378:10664 | Client support signals, progress and insights |
| 378:9385, 378:9408 | Design tokens and expandable component library |
| 378:9432, 378:11668 | Testing, feedback and next-stage roadmap |

Research/co-design evidence: 378:9012, 378:9049. Native interactive decision bars and the before/during/after support-loop diagram summarize documented findings; they are portfolio explanations, not a working therapy product. Swimlane source: 378:9296. Iteration source: 378:9313.

Decorative duplicate cover slides are not repeated. This is a curated case study, not a slide-for-slide reproduction. All three final product experiences and their feature flows are represented.

## Asset and interaction verification

- 69 displayed image callsites decoded successfully at desktop 1440px and mobile 390px.
- 18 panels across six tab groups checked for image geometry, opacity, overflow and keyboard selection.
- Nine chapter destinations checked; navigation retains the article and route, without a page refresh.
- Image enlargement opens and closes with Escape; normal site Menu restores on Home.
- Case-study images use native scrolling, explicit intrinsic dimensions and lazy loading. Glass remains available for the home/gallery imagery.
- Chromium/Edge automated scroll sample: median 16.7ms, p95 about 17.1ms in both test viewports. This is a local synthetic check, not a guarantee for all devices.

`process-assets.json` records source node, local source file, lossless display file and dimensions. PNG masters are retained. The four `reflectionState` files are isolated UI component exports used to illustrate the existing design, not full-slide screenshot backgrounds. Runtime code contains no temporary Figma asset URLs.
