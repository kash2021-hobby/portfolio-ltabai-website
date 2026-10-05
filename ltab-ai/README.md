# LTAB AI — Marketing Website (built from the designer handoff)

Production build of the four-page LTAB AI marketing site, recreated from the
high-fidelity design handoff in the `designer2-46e574f1-1a61-4036-beda-a5bcde69205d`
design repo (bundle `design_handoff_ltab-ai-website`).

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, manifesto, four freedoms (pinned scroll), services tabs, idea→business, two paths, selected work, QA bug-hunt teaser, proof & markets, recent developments, Freedom Lab lead wizard, footer |
| `software-testing.html` | QA-as-a-service landing — release-readiness panel, testing types, flagship offer, six-step life cycle, packages, deliverables, boundaries, FAQ, intake form |
| `our-work.html` | Filterable/searchable project archive with grid/list views and a slide-in case-study reader |
| `recent-developments.html` | Updates index with category filters, deep-linkable reader (`#d1`…`#d7`) and three inline interactive demos |

## Framework choice

No existing codebase was present, so the project ships as a **zero-build static site**
(vanilla HTML/CSS/JS). Rationale: the design is pixel-perfect and its behaviour layer is
already vanilla (`site/scene.js` is framework-agnostic; `common.js`'s defensive reveal/motion
system is explicitly meant to be kept "in any port"). Adding a bundler would add risk without
adding capability for a marketing site with no data layer. The section markup is the component
boundary; if React/Astro is adopted later, each `<section data-scene>` maps 1:1 to a component
and `js/scene.js` can stay at a single mount point.

## Run it

```bash
cd ltab-ai
python3 -m http.server 8080     # or `npx serve`
# open http://localhost:8080
```

Serve over HTTP(S) (not `file://`) so the self-hosted fonts load.

## Structure

```
ltab-ai/
├── index.html / software-testing.html / our-work.html / recent-developments.html
├── assets/
│   ├── ltab-logo*.png            # real brand logos from the handoff
│   └── vendor/three.min.js       # Three.js 0.149.0, vendored locally (was unpkg CDN)
├── css/
│   ├── fonts.css                 # @font-face for self-hosted fonts
│   ├── styles.css                # design tokens, global system, home sections
│   └── pages.css                 # subpage components (QA, work archive, posts, reader…)
├── fonts/*.woff2                 # Bricolage Grotesque / Manrope / JetBrains Mono (latin, variable)
└── js/
    ├── common.js                 # regions, region detection, phone field, reveal net, motion-clock guard
    ├── scene.js                  # "The Free L" — shared Three.js scene + section state machine
    ├── app.js                    # home interactions + Freedom Lab wizard
    ├── qa.js                     # Software Testing page logic (readiness, life cycle, intake)
    ├── work.js                   # Our Work archive logic (extracted from inline design script)
    └── posts.js                  # Recent Developments logic incl. interactive demos (extracted)
```

## Wired for production

- Cloudflare `/cdn-cgi/l/email-protection` obfuscation replaced with real
  `mailto:hello@ltab.ai` links (header menu + footer).
- Three.js 0.149.0 vendored at `assets/vendor/three.min.js` (design pinned this version;
  `sRGBEncoding` is pre-r152 API and intentionally kept).
- Fonts self-hosted (latin subsets, variable builds). Google Fonts CDN no longer used.
- Page files renamed to lowercase slugs (`index.html`, `our-work.html`,
  `software-testing.html`, `recent-developments.html`); all cross-links updated.
- Favicon added from the brand logo; meta descriptions added to the two pages missing them.

## Placeholders that still need real content

These are by design in the handoff, kept as-is:

- **Imagery:** project screenshots, video stills, showreel and post covers are striped
  CSS placeholders ("[ project screenshot ]").
- **Data:** `js/work.js` holds 48 synthetic projects; `js/posts.js` holds 7 posts
  (3 written, 4 stubs). Swap for real content.
- **QA prices** are indicative USD "starting from" amounts — confirm before shipping.

## Lead capture (CRM)

Both forms (Freedom Lab on Home, QA intake on Software Testing) POST JSON to a CRM
webhook. Set the endpoint in **two** places:

```js
const CRM_ENDPOINT = '';   // js/app.js  → line ~320 (Freedom Lab)
const CRM_ENDPOINT = '';   // js/qa.js   → line ~148 (QA intake)
```

Until it is set, payloads are logged to the browser console (`[LTAB] lead payload…`).
Before going live, add server-side validation/spam protection and a submit error state
(none of this exists in the design, per the handoff).

## Not built (not designed yet)

The handoff's "not yet designed" list: the other eight service detail pages, the eight
region pages (`/us /ca /au /nz /eu /ae /my /sg`), individual case-study pages, About,
Insights, Careers, Contact and Legal pages — see `Website Map v2.md` in the design repo.
