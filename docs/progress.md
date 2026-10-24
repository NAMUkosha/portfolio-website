# Handoff

Current phase: visual exploration, before production implementation.

Repository: NAMUkosha/portfolio-website. Existing live site: https://www.wenjiashi.space/ (Readymag). Full existing content has not been imported.

Read `docs/design.md` for confirmed decisions and `docs/orocoa-reference.md` for the latest reference analysis. Open `visual-exploration/index.html` to view revision 4: compact asymmetrical selected work, a personal introduction, a sticky horizontal exhibition, and an arc/canvas archive with stationary text. Its source is `space.html`, `space.css`, and `space.js`. Revision 3 is preserved as `index-v3.html`.

Next: get user feedback on revision 4, then refine the selected direction with representative actual project images. Do not infer that illustrative artwork or text is the user's real work. Secure access and detailed case studies are deferred. The archive is an independent DOM arc prototype, not the reference's full WebGL ring or liquid effects.

No commit, push, hosting registration, or deployment was requested for this iteration.

Revision 4: Browser preview inspection remains blocked by the browser tool process security environment failure (HRESULT 0x80070020). Do not claim the new layout has been visually verified. No automated tests run in this continuation.


Latest refinement: removed decorative homepage/footer copy and footer navigation. Featured selection is now fixed across categories. The lower exhibition uses expandable Design / Research headings with the shared horizontal track. Scrolling reveals a right-side circular Menu with page links, private access, and back to top. Archive now exposes only the arc view; no Canvas switch. No automated tests were run for this refinement.

Work refinement: removed exhibition arrow controls; retained keyboard arrow access and native mobile scrolling. Desktop horizontal motion now follows scroll with a time-based 100ms smoothing constant and settles at boundaries. Design and Research are always visible above the shared exhibition, with Viewing / Explore labels and subtle rectangular backgrounds. Hover changes image saturation and the small link arrow only. No tests or browser visual verification performed.

About direction proposed (not implemented or approved): a short curtain-like page reveal, followed by a stable biography composition with a short introduction, work experience and education, then an interest image strip. Resume and email links deferred. Avoid mandatory splash screens or hiding recruiting information behind interactions.

Latest refinement supersedes the floating Menu and paired category controls: direct narrow vertical text navigation (Top, Work, Archive, About, Access); two homepage featured items; removed More about me and the link immediately below Selected work. Design / Research return to stacked headings with Open / Close labels and actual collapse / expand animation. About now has a curtain reveal and introduction, experience, education, interest-image layout. Biography details and images are explicitly placeholders, with no invented credentials. No tests run.

Archive content: Melodeck, Company, and G-PIXEL now replace the first three placeholders. Company has one poster plus original body copy; G-PIXEL has 16 downloaded project images in grouped sections. Added 2022 filter. Source records are in content-import/. No tests or browser visual validation run for this content migration.

User-provided About information: LinkedIn https://www.linkedin.com/in/wenjia-shi/ ; interests musical theatre, gaming, knitting (Chinese: 音乐剧、打游戏、编织). Added link and text interests; removed unrelated placeholder interest imagery. Employment and education remain placeholders.

About update: restored three original SVG interest image placeholders with user-provided interest names and explicitly placeholder description prompts. LinkedIn public index for exact profile https://cn.linkedin.com/in/wenjia-shi/en lists Digital Creative Asia (Shanghai) in Experience and Cornell University 2025–2026 in Education. Filled only those facts; titles, work dates, degree, and other history are unavailable. Bio sentence is a short paraphrase of the visible truncated About opening, not a full biography import. Direct LinkedIn fetch returned HTTP 999. User needs to supply full About/Experience/Education text or screenshots to complete the import. Do not use liked posts as evidence of personal employment or accomplishments.

About experience updated from six user-supplied LinkedIn screenshots (2026-10-24). Visible: Digital Creative Asia UI/UX Designer May 2026-Present Shanghai; Google UX Researcher contract Jan-May 2026 remote; VITA Global UI/UX Designer internship Oct 2025-May 2026 hybrid; AImpower.org Product Designer contract Sep 2025-Jan 2026 Mountain View/remote. Earlier experience disclosure: Unity Product Designer internship Jan-May 2025 Shanghai/on-site; ShanghaiTech Hybrid Ecologies Creative Lab Design Researcher Feb 2024-Jun 2025 (location not supplied, omitted); Covestro CMF Designer internship Jun 2023-Jul 2024 Shanghai/hybrid; two ShanghaiTech TA roles grouped Mar-Aug 2024 with distinct course dates retained. Omitted mechanical design internship and high school for relevance; clipped unreadable job not used.
Education: Cornell MPS Information Science UI/UX Track Aug 2025-May 2026; ShanghaiTech BE Industrial Design Sep 2021-Jun 2025; Drexel Westphal Product Design Sep-Dec 2024. No assumed degree/exchange designation for Drexel. Intro headline updated to UI/UX designer with industrial design background. No tests run.

The Lexicon of Wish imported into homepage Research only. Independent #project/lexicon case study uses real content and 15 images, chapter-based scroll reveals, desktop sticky headings and reading progress. Source video poster only; video not imported. Research now contains this real project instead of mock items; homepage featured two unchanged. Source provenance content-import/thelexiconofwish/. No tests run.

Lexicon HY Lab update: original project link now https://www.hy-lab.design/blank-1. Downloaded public Wix 480p preview/1080p project video, original poster, model imagery and three plant images to assets/lexicon/hy-lab/. Research card uses muted looping video; hero uses controls and viewport-managed muted playback. Reduced motion prevents autoplay. Videos pause offscreen, when navigating and when document hidden. Team and guidance credits retained from lab page. Media provenance: content-import/thelexiconofwish/hy-lab-assets.json. No tests run.

Homepage exhibition now uses separate Design and Research tracks in a single stable desktop scroll sequence: Design horizontal distance, brief end hold, reversible smoothstep collapse/expand, Research horizontal distance, final hold. Scroll position is eased with an 85ms time constant; no DOM replacement or scroll reset during handoff. Title buttons seek to each group. Mobile/reduced-motion show both groups in normal flow with native horizontal scrolling. Research video and project links retained. No tests or browser validation run for this change.

Visual direction update: neutral white base (#fff), near-grey UI hex colours neutralised. Archive retains rotating arc with layered glass faces, thin offset backing, diffuse artwork-coloured glow, perspective and edge-proximity-driven radial SVG displacement. Centre cards remain nearly flat; viewport-edge cards bow/stretch slightly. Navigation, locked labels and overlays use translucent frosted surfaces. Reduced-motion disables edge deformation. Images/content unchanged. No tests or browser visual verification run.

Archive refinement: removed white rims, padding and rounded thumbnail corners. Added three image-derived depth planes and a matching artwork-coloured shadow. Inner image slab responds to mouse position with a mild inward tilt/translation; pointer exit restores it; drag/select cancels pressure. Locked images keep all duplicated layers blurred. Reduced-motion disables pressure. Existing wheel and edge displacement retained. No tests run.

Archive now uses flat paired photos, no glass material, thickness or edge distortion. Keeps pointer tilt and wheel. Melodeck pairs 01/04; G-PIXEL pairs 16/12; Company has only one imported poster, so its rear view uses a CSS crop of the same poster (not a second original). Removed bottom-right hint/arrows/counter; keyboard navigation and right project list retained. About uses user-provided LinkedIn bio verbatim and mailto:wenjiashi616@gmail.com below LinkedIn. Homepage uses smaller factual UI/UX/industrial-design introduction. No tests run.

Paired archive images now separate side-by-side on hover/keyboard focus and restack on exit. Company renders exactly one image, without a duplicate crop. Touch displays the active pair separated. No tests run.

Company Archive thumbnail now uses its source aspect ratio 2048:1301 with contain fitting, preserving the complete poster at desktop and mobile sizes.
