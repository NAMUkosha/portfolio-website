# orocoa reference study

Reference inspected: https://github.com/orocoa/orocoa_web at tree d03b99c8f90ebeee3d66afd5c14762fd14aeb99b.

Read README.zh-CN.md, package.json, dist/fields/fields.css, dist/home/style.css, dist/assets/journey.js, dist/vi/tokens.css, dist/vi/fonts.css, dist/project/project.css, dist/project/detail.js, and dist/project/vendor/viscose/ring/params.js. User supplied six screenshots of selected work, ring overview, detail and profile.

## What the source actually does
- UI font is Bricolage Grotesque (vi/fonts.css and tokens.css). Vendor default font names are not the authoritative site font.
- Selected work uses an asymmetric composition: prompt on the left, four compact project rows on the right. Each row contains title, description and thumbnail. Motion reveals text through masks on a shared scroll timeline.
- Gallery uses Three.js and a customized Viscose ring with GSAP, angular damping and snap. Project captions and a right-hand index remain separate from artwork. This is more than an ordinary CSS card carousel.
- Project detail uses left media and right explanatory copy/facts. At sufficient viewport height the right information column stays fixed; otherwise it becomes normal two-column flow.
- Homepage uses a point cloud, zoom and device transition. These are specific visual ideas, not requirements for Wenjia.

## Revision 4 interpretation
- Replace earlier oversized hero/card layouts with small-scale asymmetric type and thumbnail composition, referencing the user's screenshots.
- Use Bricolage Grotesque, neutral off-white, square edges, understated navigation and readable selected states. No blue, large button panels, decorative section numbers or serif accent.
- Keep a larger scroll-driven horizontal filmstrip below the introduction, retaining the earlier user request.
- Archive has an independently implemented DOM arc prototype plus a draggable canvas alternative. It does NOT reproduce the source's WebGL liquid effects or its full opening ring animation. No copied reference assets or code.
- Open archive notes in the same view; featured projects get their own hash routes. Shared demo unlock remains visual-only.
- Placeholder media is still illustrative. The limited four SVG assets are not representative of the richness of the user's final images.

Original code in the reference is MIT; fonts/dependencies and artwork have separate notices. No reference code or artwork has been imported in this revision. Google Fonts serves the reference type family with an Arial fallback.
