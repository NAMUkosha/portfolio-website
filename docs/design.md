# Design decisions

## Latest feedback — revision 3
- Reject blue, oversized CTA blocks, excessive dividers, rounded corners, and the impersonal headline/font treatment in v2.
- Prefer soft grey/off-white rather than pure white. Keep blur treatment.
- Make the homepage personal with a short self-introduction; draft bio is proposed copy, not verified biography.
- Reduce redundant calls to action while retaining clear navigation selection and clickable project surfaces.
- Use square edges, Instrument Sans with a small Instrument Serif accent, smaller type and muted grey/olive neutrals. Color and type remain open to user feedback.
- Keep sticky horizontal browsing. Add staggered intro entry, slight scroll movement of the intro composition, project-filter fades, and archive entry. No hover image transformations.
- Revisited supplied website text; live Even Realities browser viewing failed. Do not claim its animations were visually inspected.

## Confirmed with user
- Audience: primarily design-company recruiters, then peers.
- English first. Chinese is a possible later addition.
- White / off-white, simple, interesting and surprising without excessive effects.
- Home: exhibition space, 2–4 selected projects, design emphasized. Design / Research switch.
- Featured projects ultimately open independent detailed case-study pages. Detail-page motion is deferred.
- Personal gallery: curious personal studio / archive, timeline grouping, interests and small experiments. In-place descriptions and images, optional outbound links; no deeper gallery navigation.
- Gallery direction: dot-grid canvas, collapsible side information, thumbnail focus / enlargement, synchronized description.
- Public and private projects may appear throughout. One shared password unlocks all private projects across the site (option A). Public metadata only before unlock. Actual private images/text must require server authorization.
- Explore locally before the user pushes to GitHub. No deployment requested.

## References supplied
- https://www.360and5.com/
- https://www.evenrealities.com/
- https://obys.agency/
- https://studiofreight.com/
- https://github.com/orocoa/orocoa_web
- User's own three-column gallery sketch (in chat). Inspiration only, not a literal template.

## Current experiment
`visual-exploration/` compares a single lead exhibition (A) and staggered paired works (B). Original SVG artwork and proposed English copy are placeholders, not confirmed portfolio content. Temporary name: Wenjia Space, taken from the current site title.

## Pending decisions
- Preferred direction, typography, density and accent color.
- Actual lead projects, final name treatment and approved copy.
- Production stack, secure password access and hosting.

## Revision 2 feedback and implementation
- User rejected the quiet, overly restrained first version and decorative numbering / nav superscripts.
- Explicit button affordances and selected navigation state are required.
- No hover tilt or image scaling; use color / border feedback.
- Desktop selected work uses 4 illustrative cards in a horizontal track: about 2.5 visible, sticky and vertically centered while vertical scrolling advances the track, then normal page flow resumes.
- Add scroll-triggered entry for the archive section. Mobile and reduced-motion modes use native horizontal browsing.
- Current visual experiment uses white, black, and vivid blue. This color choice awaits user feedback.
