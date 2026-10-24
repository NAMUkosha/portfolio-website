# Wenjia Space — visual exploration

Current version: revision 4, following the orocoa reference analysis in `docs/orocoa-reference.md`: compact asymmetrical selected work, a personal introduction, grey/off-white background, square edges, a sticky horizontal work track, and an arc archive with stationary captions and index. The arc is an independent DOM prototype, not the reference's full WebGL implementation. Source: `space.html`, `space.css`, `space.js`; `index.html` is the entry copy. Revision 3 is preserved as `index-v3.html`.

Initial directions (historical):

- A / Exhibition: a single large lead project.
- B / Dialogue: two staggered projects above the remaining selection.

Open `index.html` directly, or from the repository root run:

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory visual-exploration
```

Visit http://127.0.0.1:4173/ and scroll down through selected work. Arrow buttons and keyboard arrows also browse the track. No build or package installation needed. Google Fonts is optional; system fonts are the offline fallback.

Includes an expandable Design / Research exhibition, a fixed featured selection, floating navigation after scrolling, a draggable archive with year filters and in-place details, responsive layouts, keyboard navigation, reduced motion, and a site-wide visual unlock demo.

Demo password: `preview`. This is client-side UI state only, kept for the browser tab's session. It is NOT access control. All artwork and writing is illustrative, not Wenjia's actual work. Do not put confidential assets here. Production needs server-validated access and protected asset delivery. Featured case studies use separate hash routes with placeholder content. Archive entries open in place. About copy is a placeholder.

Nothing has been published or pushed. The `visual-exploration/` source folder can be committed and pushed when ready. This is a visual prototype, not the final website implementation.
