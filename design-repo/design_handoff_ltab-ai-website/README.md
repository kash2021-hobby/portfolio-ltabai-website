# Handoff: LTAB AI — Marketing Website

## Overview

LTAB AI is a software / AI / brand studio ("Freedom to build"). This bundle contains the
complete design for a four-page marketing website plus one interactive WebGL brand element:

1. **Home** (`LTAB AI Website.html`) — the full narrative: hero, manifesto, four freedoms,
   services, idea→business path, two paths, work, QA teaser, proof & markets, recent
   developments, Freedom Lab lead form, footer.
2. **Software Testing** (`Software Testing.html`) — the QA-as-a-service landing page, a
   complete long-form service page with a flagship offer, six-step testing life cycle,
   deliverables browser, packages, boundaries and a detailed intake form.
3. **Our Work** (`Our Work.html`) — filterable/searchable project archive with a slide-in
   case-study reader.
4. **Recent Developments** (`Recent Developments.html`) — blog/updates index with category
   filters and a reader overlay containing three small interactive demos.

The signature idea: **"The Free L"** — the two orange capsules of the LTAB logo exist as a
single shared Three.js scene that floats behind every section, splits apart, re-arranges
(mind-map, colour wheel, building blocks, running belt) and snaps back together. It is the
one continuous object of the whole site.

The goal of the site is lead capture. There is no CRM on the site: every CTA feeds one
conversational form ("Freedom Lab") or the QA intake form, which POSTs to a CRM webhook.

---

## About the Design Files

**The files in this bundle are design references created in HTML.** They are prototypes
showing intended look and behaviour — not production code to copy directly.

The task is to **recreate these HTML designs in the target codebase's existing
environment** (React, Vue, Next.js, Astro, SwiftUI, etc.) using its established patterns,
component library and data layer — or, if no environment exists yet, to choose the most
appropriate framework for the project and implement the designs there.

The HTML here is hand-written vanilla JS + one global `THREE` build. In a modern codebase
you would typically: move the three stylesheets into your styling system, split the page
sections into components, and replace the Three.js scene with `@react-three/fiber` (or keep
the vanilla module behind a single mount point — see **The Free L** below). The
`site/scene.js` state machine is framework-agnostic and can be reused almost verbatim.

Two things in the HTML are **not** design decisions and must be replaced in production:
- The Cloudflare email obfuscation leftovers (`/cdn-cgi/l/email-protection` links and
  `[email protected]` placeholders in the mobile menu and footer). Replace with a real
  `mailto:` address.
- `CRM_ENDPOINT = ''` placeholders in `site/app.js` and `site/qa.js`. See **State
  Management → Lead capture**.

---

## Fidelity

**High-fidelity (hifi).** These are pixel-perfect prototypes with final colours,
typography, spacing, copy, motion and interactions. Recreate the UI pixel-perfectly using
the codebase's existing libraries and patterns.

Caveats where the design is intentionally *not* final:
- **Imagery is placeholder.** Project screenshots, video stills, post covers and the
  showreel are striped CSS placeholders with monospace labels such as
  `[ project screenshot · client brand ]`. Real assets must be dropped in — see **Assets**.
- **Project / post / case-study data is placeholder.** `Our Work.html` generates 48 fake
  projects, `Recent Developments.html` has 7 posts (3 fully written, 4 stubs). Replace with
  real content and a real data source.
- **QA package prices** are indicative "starting from" USD amounts, region-aware. Confirm
  before shipping.
- **Copy is final** unless marked as placeholder. It is written in a deliberate plain-English
  voice (see **Copywriting & tone**) — preserve it.

---

## Screens / Views

Global shell: fixed header, full-screen mobile menu, shared footer, fixed WebGL canvas.
See **Global Elements** after the per-page breakdown.

---

### 1. Home — `LTAB AI Website.html`

#### 01 Hero
- **Purpose:** Establish the promise, push to the Freedom Lab form or to Work.
- **Layout:** `<section class="hero">`, `min-height:100svh`, flex-centred, `padding:120px var(--pad) 60px`.
  Inner `.wrap` max-width 1360px. Text column `.hero-text` max-width 720px, `z-index:2`,
  `pointer-events:none` with links re-enabled (so the 3D drag zone behind stays usable).
- **Elements:**
  - Eyebrow: mono 12px, uppercase, `letter-spacing:.12em`, colour `--muted`. Orange
    capsule (`.cap`, 22×8px, pill) + "Software · AI · Brand · Since 2021".
  - H1 `.display`: "Freedom<br>to <span class='o'>build.</span>", font-size
    `clamp(68px,11.5vw,184px)`, weight 800, `letter-spacing:-.045em`, `line-height:.9`,
    margin `22px 0 28px`. "build." is orange.
  - Lede: `clamp(17px,1.4vw,20px)`, colour `#4d4a45` (hero override), max-width 52ch.
  - Two CTAs: `Start your idea` (orange pill, 54px tall) and `See our work` (ghost, 1.5px
    border). 12px gap, `margin-top:36px`.
  - Region line: mono 13px, "Building for **United States** · from our India engineering hub".
- **3D interaction:** `.hero-drag` — an invisible zone covering the right 52% of the hero
  (`cursor:grab`, `touch-action:pan-y`). Pointer-drag pulls the two L capsules apart; release
  springs them back (see **The Free L**).
- **Hint:** bottom-right, mono 12px uppercase "Drag the L. Pull it apart." with an animated
  pill toggle (`@keyframes hint`, 2.4s infinite).

#### 02 Manifesto
- **Layout:** `min-height:140vh`; inner `.sticky` at `top:18vh`.
- **Copy:** "SaaS tells you how to work. We ask how *you* want to work. Then we *build*
  *that.*" — `clamp(42px,7.4vw,124px)`, weight 800, `letter-spacing:-.04em`, `line-height:.98`,
  max-width 13ch.
- **Behaviour:** every word is wrapped in `<span class="w">` at runtime; as the section
  scrolls, words light up one by one (`opacity .12 → 1`, `.25s` transition). Emphasised words
  also get `.o` (orange).

#### 03 Four Freedoms (pinned scroll)
- **Layout:** `height:440vh`, `padding:0`. Inner `.sticky` fills `100vh`, flex-centred.
  Two-column grid (`1fr 1fr`, 40px gap) inside a 1360px wrap. Left column `.fr-left` is
  reserved for the 3D object; the right column holds the content.
- **Big number:** `.fr-num`, `clamp(120px,20vw,300px)`, weight 800, `letter-spacing:-.06em`,
  orange, `height:.82em` with `overflow:hidden`; an inner `<span>` translates on the Y axis
  (`translateY(-i*100%)`, `.7s`) to swap 01→04.
- **Items:** four absolutely-positioned `.fr-item` blocks, cross-faded with
  `opacity/translateY(24px)` over `.6s`. Each has a mono uppercase `.tag`, an `h3`
  (`clamp(40px,5.2vw,78px)`) and body copy (`--muted-d`).

  | # | Tag | Headline | Body (abridged) |
  |---|---|---|---|
  | 01 | Freedom of thinking | Think without a template. | Start from the idea in your head, not the options in someone else's dropdown… |
  | 02 | Freedom of design | Design it the way you see it. | Your colours, your flow, your screens… |
  | 03 | Freedom of development | Built around you, not a SaaS product. | Your rules, your workflow, your stack… |
  | 04 | Freedom of business | Your business. Your rules. Redesign anytime. | Markets change and so do you… |
- **Step rail:** four buttons pinned to the bottom (`border-top:2px solid var(--line-d)`,
  orange when active). Clicking one smooth-scrolls to that step's scroll position. Section is
  `data-theme="dark"`.
- **3D states:** `fr0` orbit/swarm, `fr1` ring, `fr2` grid, `fr3` belt.

#### 04 Services (tabbed pillars)
- **Header:** `.svc-head` flex row, space-between, aligned to end. Left: eyebrow + H2
  "Build. Grow. <span class='o'>Assure.</span>" (`clamp(40px,6.4vw,96px)`). Right: `.tabs`
  — a pill-group (`background:rgba(18,18,18,.06)`, 6px padding) of three buttons:
  `Build 05`, `Grow 05`, `Assure 02` with mono counts at 55% opacity.
- **Pillar line:** `.svc-pillar-line`, display font 700, `clamp(22px,2vw,28px)`, max-width 30ch.
- **Grid:** `repeat(auto-fill,minmax(300px,1fr))`, 14px gap. Cards `.svc`: white, radius 32px,
  `padding:30px 28px 28px`, `min-height:260px`, flex column space-between, `overflow:hidden`.
  - Top-right: 40px circular `.go` button with an arrow; on hover it fills white, turns
    orange, and rotates −45°.
  - Content: mono index `BUILD / 01` (12px, `--muted`), `h3` `clamp(26px,2.3vw,34px)` weight 800
    `line-height:1`, body 16px.
  - **Hover state:** whole card turns orange (`--orange`), text goes white, `translateY(-4px)`,
    `.35s var(--ease)`.
  - Entry animation `@keyframes rise` (`opacity 0 + translateY(20px)` → rest), 60ms stagger
    via inline `animation-delay`.
  - Final card `.svc.wide` spans the full grid, dark (`--ink`) background, holds the
    "Idea → Business" end-to-end offer.
- **Content model** (in `site/app.js` → `SERVICES`): three pillars.
  - **Build:** Custom Applications · AI Agents & AI-Powered Apps · Business Automation ·
    Custom Websites · E-commerce
  - **Grow:** Branding · AI Digital Marketing & Ads · AI Video Production ·
    Interactive AI Videos · Interactive AI Content
  - **Assure:** Software Testing / QA · QA for Developers & Freelancers (both link to
    `Software Testing.html`)
- **Behaviour:** tab click swaps pillar + re-renders the grid; clicking a card pre-selects
  the matching chip in the Freedom Lab form (`preselect()`), so the lead arrives pre-qualified.

#### 05 Idea → Business
- **Layout:** eyebrow + H2 "From idea<br>to <span class='o'>business.</span>" + lede.
- **Track:** `.path-track` — 5-column grid, 14px gap, `margin-top:72px`. An absolutely
  positioned 4px line runs across at `top:27px` with an orange fill `<i>` whose width is
  driven by scroll progress.
- **Steps:** `.step` — 42px circular knob (paper fill, 4px `--line` border; orange when
  `.on`), mono `k` number, `h4` (`clamp(28px,2.6vw,40px)`), 15.5px body, max-width 28ch.
  Content: **01 Idea** · **02 Brand** · **03 Product** · **04 Launch** · **05 Growth**.
- **Mobile:** the track becomes a vertical timeline — the line moves to `left:19px` and the
  fill uses a `--h` custom property.

#### 06 Two Paths
- **Layout:** `.paths` grid `1.1fr 1fr`, 60px gap, aligned to start.
- **Switch:** `.switch` pill (max-width 520px, 6px padding, track
  `rgba(18,18,18,.06)`) with an orange `.thumb` that translates 100% for the second option.
  Buttons: "I'm just starting" / "I run a business" (56px tall, weight 700).
- **Card:** `.path-card` white, radius 32px, `padding:clamp(28px,3vw,44px)`. Contains an
  `h3` (`clamp(30px,3vw,44px)`), an ordered list where each row is
  `grid-template-columns:44px 1fr` with a mono orange number and a 1px top border, then a
  primary CTA. Swapping the toggle re-renders the card with a `.fade-swap` animation
  (`rise .5s`).
- **Copy:** path 0 = "You have an idea. We'll help you turn it into a business." (4 steps);
  path 1 = "Your business works. We'll make it run on AI." (4 steps). The CTA carries a
  `data-stage` attribute that pre-fills the lead's stage.

#### 07 Selected Work
- **Grid:** `repeat(12,1fr)`, 14px gap, `margin-top:56px`.
- **Cards:** `.ph` — striped placeholder background
  (`repeating-linear-gradient(135deg, rgba(18,18,18,.045) 0 1px, transparent 1px 12px)` over
  `#ecebe6`), radius 32px, 24px padding, flex column space-between. Mono `.lbl` label at the
  top, project title (`clamp(24px,2.2vw,32px)`) + tag pills at the bottom. Hover:
  `translateY(-4px)`, `.5s`.
- **Layout spans:** 7/5 for the first two (min-height 440px), then 4/4/4.
- **Showreel:** `.reel` full-width (12 columns), min-height `clamp(260px,42vw,560px)`, dark
  `#1a1a1a` with a white striped overlay, 96px orange circular play button that scales 1.08
  on hover.
- **More-work strip:** `.more-work` — full-width orange bar, radius 32px, display-font
  headline "100+ more projects, all built their way." with translucent-white chips and a
  white button that inverts to ink on hover.

#### 08 QA Teaser
- `data-theme="dark"`. `.qa` grid `1fr 1.05fr`, 60px gap, centred.
- **Left:** eyebrow, H2 "Find the problems<br><span class='o'>before your customers do.</span>",
  lede, six outlined chips (Manual / Compatibility / Performance / Automation / Penetration /
  API & security), two CTAs.
- **Right:** `.bugbox` — a fake browser chrome (three 10px dots, mono URL
  `staging.your-app.com`, mono orange issue counter) over a `.mock` canvas with grey
  skeleton rectangles. Six `.bug` hotspots are scattered over it, each a 30px target with a
  pinging orange dot (`@keyframes ping`, 1.8s). Clicking one marks it found (white dot +
  dark check) and updates the counter; when all six are found the `.bug-done` overlay fades
  in (`rgba(18,18,18,.92)`) with "That's what our testers do. All day, on every device." and
  a "Hunt again" reset button.

#### 09 Proof & Markets
- **Stats:** `.proof` 3-column grid, 14px gap, `margin-top:56px`. Each `.stat` has a 2px ink
  top border, a huge value (`clamp(72px,10vw,150px)`, `line-height:.85`) that counts up from
  0 over 1400ms with a cubic ease-out when scrolled into view, and a bold label.
  Values: **100+** companies · **5** years · **8** markets.
- **Markets header:** flex row, space-between, aligned end, `margin-top:120px` — H2
  "Global quality. <span class='o'>Honest pricing.</span>" + lede.
- **Market grid:** `repeat(4,1fr)`, 12px gap, `margin-top:80px`. `.mk` cards: white, radius
  20px, 22px padding, min-height 150px, 2px transparent border → orange when active.
  Top row is a mono region code pill + a live clock (updated every 20s from the IANA
  timezone). Bottom is the region name (display 24px) + overlap note.
- **Regions (8):** US · CA · UK (Europe & UK) · AE · SG · MY · AU · NZ — each with currency
  and timezone (see `site/app.js` → `REGIONS`).
- **Hub card:** `.mk.hub` spans all 4 columns, dark background, horizontal layout —
  "Engineering hub · India" with a live Asia/Kolkata clock.

#### 10 Recent Developments
- **Header:** `.dev-head` flex space-between aligned end + a ghost "All developments" CTA.
- **Rail:** `.dev-rail` grid `1.3fr 1fr 1fr`, 14px gap. `.dev` cards: white, radius 32px,
  26px padding, min-height 380px, flex column gap 18px. Meta row (kind pill + duration in
  mono), `h3` (`clamp(24px,2.1vw,32px)`), a striped `.viz` placeholder, and a `.read` link
  with an arrow.
- **Feature card** `.dev.feat` (first): dark `--ink`, white text, orange kind pill.
- Three entries: AI Agents (WhatsApp lead agent) · Interactive AI video · Automation
  (invoice → ledger). All link into `Recent Developments.html` anchors.
- **Mobile:** the rail becomes a horizontal scroll-snap carousel with 84%-width cards.

#### 11 Freedom Lab (lead form)
- `data-theme="dark"`, `min-height:100vh`. `.lab-grid` grid `.9fr 1.1fr`, 60px gap.
- **Left:** eyebrow, H2 "What do you want to <span class='o'>build?</span>", lede. A hidden
  `<form id="ctaForm">` exists for a hero quick-input hook.
- **Right:** `.lab-card` — `#1b1b1b`, 1px `--line-d` border, radius 32px,
  `padding:clamp(24px,3vw,44px)`, min-height 520px, flex column.
  - **Progress:** six 6px bars (`#2d2d2d` → orange when reached).
  - **Steps (6):**
    1. **What's your idea?** — 170px-tall textarea, 18px text, `#111` fill, 1.5px `#333`
       border; focus = orange border + `0 0 0 4px rgba(255,106,0,.18)` ring.
    2. **What do you need?** — 11 chips (multi-select): Custom app, AI agents, Automation,
       Website, E-commerce, Branding, Marketing & ads, AI video, Interactive AI,
       Testing / QA, Everything.
    3. **Where are you?** — region chips (pre-selected from timezone detection) + stage chips
       (single-select): Just an idea / Starting a business / Established business /
       Developer / freelancer.
    4. **Timeline & budget** — optional. Timeline: ASAP / 1–3 months / 3–6 months /
       Just exploring. Budget: Under $5k / $5k–15k / $15k–50k / $50k+ / Not sure yet.
    5. **Where do we reply?** — a summary table of everything chosen, then name, email and a
       phone field with a typeable country code.
    6. **Success** — orange 88px circle with a white check, "Your idea is in, *Name*.", and a
       "Send another idea" reset.
  - **Chips:** 46px tall, pill, 1.5px `#3a3a3a` border, weight 600; `.on` = orange fill, white
    text.
  - **Nav:** `← Back` (left, muted → white on hover) and a primary `Continue` /
    `Send my idea` with an arrow. Hidden on the success step.
  - **Errors:** orange 14px line under the card. Rules: idea ≥ 8 chars; at least one need;
    valid name; valid email regex `/^\S+@\S+\.\S+$/`; optional phone must be ≥ 6 digits.
- **Phone field** (`site/common.js` → `mountPhone`): a 128px-wide dial-code input with a
  mono ISO badge, plus a full-width number input. Focusing the code input opens a scrollable
  list of ~56 countries (priority markets first), filterable by typing — matching name,
  ISO or dial code. Arrow keys move a highlight, Enter picks, Escape closes, Tab commits.
  `phoneValue()` returns `{dial, iso, country, number, e164}`.
- **Step persistence:** the current step is written to `localStorage` (`ltab-lab-step`) so a
  refresh does not lose the visitor's place.

#### 12 Footer
- Dark, `padding:80px var(--pad) 40px`. Huge display line "Your idea.<br>Your rules." at
  `clamp(64px,13vw,220px)`, `line-height:.85`.
- Four-column grid `2fr 1fr 1fr 1fr` (40px gap, `margin-top:80px`, 1px top border): brand
  column (dark logo 28px + description + email), **Build** links, **Grow & Assure** links,
  **Markets** list.
- Bottom bar: mono 12px, "© 2026 LTAB AI" and "Privacy · Terms · Cookies · GDPR".

---

### 2. Software Testing — `Software Testing.html`

Body class `sub`, `data-theme="dark"`. Uses `styles.css` + `pages.css`.

- **Subpage hero** (`.sub-hero`, dark, `padding-top:150px`): breadcrumb (mono, muted,
  orange current), H1 `clamp(52px,8.4vw,132px)` "Find the problems
  <span class='o'>before your customers do.</span>", lede, two CTAs, a trust strip of four
  outlined chips.
- **Release Readiness panel** (`.rr`, dark card): a header row ("RELEASE READINESS" + dashed
  "Sample" tag), three rows each with a large display-font number, a 10px bar that animates
  width over 1.4s, and a right-aligned label — **Passed** (green `--pass`), **Failed**
  (red `--crit`), **Blocked** (grey `--blocked`). Below, a status alert with a pinging dot.
  Three tabs cycle sample states on a 3.6s interval until the user clicks:
  1. First run — 151/19/10, red, "1 critical issue needs attention"
  2. After fixes — 168/7/5, amber, "Fixes received · 7 issues left to recheck"
  3. Retest — 177/2/1, green, "Ready with known risks · 2 low issues accepted"
  Counters tween over 900ms.
- **What is QA** — plain-English definition, two-column.
- **Types of testing** — five `.ttype` cards (min-height 360px): 01 Manual · 02 Compatibility
  · 03 Performance · 04 Automation · 05 Penetration. Each has a mono number, 27px headline,
  body copy and a `.why` block pinned to the bottom (`Why it matters` in orange mono). Then
  a secondary 4-up `.ttypes2` row: Regression · Functional · Security · API.
- **What we check** (dark) — two cards side by side, `.plain` lists with orange dot bullets:
  "What we check" vs "Why it matters". Below, a `.only` block: "Testing is the only thing
  this team does." with a 2×2 grid of dark `.oc` cards.
- **Flagship offer** — `.flag` orange panel, grid `1.2fr 1fr`: "Release Readiness Audit" with
  a 3-step ordered list of translucent-white rows (`01 We agree the plan.` /
  `02 We test like real users.` / `03 You get the report.`).
- **What is a testing lab?** — white `.lab-note` card, two-column, with a chip cloud listing
  browsers, devices, test accounts, sandbox data.
- **Testing life cycle** — `.cycle` grid `290px 1fr` on desktop: a sticky vertical `.proc`
  list of six steps beside a two-card `.proc-panel`.
  1. **Plan** — Decide what gets tested
  2. **Prepare** — Set up the lab
  3. **Test** — Use it like a real customer
  4. **Report** — Tell you clearly, in priority order
  5. **Fix** — Your team fixes, we stay close
  6. **Verify & release** — Check the fixes, then decide
  Each step carries three fields: a description, **What you receive**, and **What we need
  from you**. Auto-advances every 3.4s while the section is ≥30% visible; stops on click.
  On mobile the list becomes a horizontal scroll row above the panel.
- **Who it's for** (dark) — eight `.aud2` columns (top 2px border): Small teams on a deadline ·
  Smart teams · Freelancers · New products · Teams with no QA · WordPress & Shopify sites ·
  Vibe-coding developers · Existing websites.
- **Packages** — four `.pk` cards (`repeat(4,1fr)`), 2px border → orange on hover, dark
  "popular" variant with an orange badge:

  | Package | Price (from) | Basis | Best for |
  |---|---|---|---|
  | Release Confidence Check | $1,200 | one-off | Launching or delivering to a client |
  | Sprint QA Partner | $2,800 | per month | Shipping every week or two |
  | Agency White-Label Desk | $1,600 | one-off | Agencies, studios, freelancers |
  | QA Foundation Review | $2,400 | one-off | Small teams wanting a process |

  Each has a "Best for" callout box and a `<details>` "What's inside" disclosure (`+` → `–`).
  Below, `#pkNote` rewrites itself for the selected region (USD base, local-currency promise
  outside the US).
- **What you receive** (dark) — `.rep` grid `.9fr 1.1fr`. Left: six `.rep-item` buttons
  (dark, orange border when active). Right: `.rep-detail` — a *light* card (`#f6f5f1`) inside
  the dark section, holding a green `ok` number chip, headline, sub-headline, a checklist
  (`.del` with orange tick bullets) and a footnote. Items: 01 Test plan · 02 Live progress ·
  03 Bug reports & evidence · 04 Final test report · 05 Retest report · 06 Handover pack.
- **Boundaries** — two cards, "What we cover" (green ticks) vs "What needs its own scope"
  (grey dashes). Then "Clear ownership": five `.role` columns (2px ink top border; the last,
  "Your side", is orange) — Service owner · Testing lead · Testing team · Coordinator ·
  Your side.
- **FAQ** (dark) — nine `<details>` rows, display-font 20–26px questions, a circular +/−
  toggle that turns orange when open. Topics: what you test, choosing types, what we need,
  agency white-label, live testing, penetration testing, zero-bug guarantees, pricing, lead
  time.
- **Intake form** (dark) — `.intake` card: a 3-row textarea for the product, then chip groups
  for focus (8, multi), platform (6, multi), services (10, multi), package (5, single),
  release date + start window (single), access readiness (single), then name/email, role/company,
  country `<select>` and the shared phone field. Validation mirrors the Freedom Lab form plus
  a ≥6-char product description. Success state hides the form and shows a centred confirmation
  with the first name.

---

### 3. Our Work — `Our Work.html`

Body class `sub`, light theme.

- **Hero:** breadcrumb, "100+ products.<br><span class='o'>None alike.</span>", lede.
- **Archive:** a toolbar with a service filter pill row, a search input (48px, pill,
  max-width 260px, orange focus ring), a Grid/List segmented toggle, and a second region
  filter row. A mono count line reads "Showing N of M projects".
- **Grid:** `repeat(3,1fr)`, 14px gap. `.wcard` — white, radius 32px, a 4:3 striped `.shot`
  placeholder, then a title (24px) and tag pills (service ×2, industry, and an
  orange-soft region pill). Hover: `translateY(-4px)`.
- **List view:** `.wgrid.list` collapses to one column of full-width rows with a 120px
  thumbnail on the left and the title/tags spread horizontally; hover tints orange at 5%.
- **Paging:** 12 projects shown initially, "Show more projects" adds 12.
- **Reader:** right-hand slide-in panel (`min(760px,100%)`, `slidein .45s`) with a sticky
  circular close button, breadcrumb, big title, a hero placeholder, Challenge / What we built
  / Results sections, two screen placeholders, a stack chip row, and a CTA. Closes on
  backdrop click, the × button, or Escape. Body scroll is locked while open.
- **Data:** `PROJ` is generated from 48 synthetic entries. Replace with real projects.

---

### 4. Recent Developments — `Recent Developments.html`

Body class `sub`, light theme.

- **Hero:** "What we've been<br><span class='o'>building lately.</span>", lede.
- **Filters:** category pills with mono counts (All, AI Agents, Interactive AI video,
  Automation, E-commerce, Interactive AI content, Software testing) + a search input.
- **Posts:** `repeat(3,1fr)`, 14px gap. `.post` — white card, 16:10 striped `.viz` with an
  optional orange "Interactive · try it" badge, then a mono meta row (category / date ·
  read time), a 25px headline and an excerpt. The first post is `.post.big`: 2 columns wide,
  dark, with a taller visual area and a `clamp(28px,3vw,42px)` headline.
- **Reader overlay:** identical pattern to Our Work, plus three inline interactive demos
  wired in `wire()`:
  - `chat` — a scripted WhatsApp conversation that plays message by message, 800ms apart,
    alternating left (grey) and right (orange) bubbles.
  - `flow` — five workflow nodes (Email arrives → AI reads invoice → Match PO → Post to
    ledger → Done) that light orange in sequence, 550ms apart.
  - `toggle` — a Normal / Interactive video switch that swaps the outcome copy.
- **Deep links:** the reader opens from `location.hash` (`#d1`, `#d2`, …) and rewrites the
  hash on open, so the home page's development cards link straight into a post.
- **Subscribe:** a dark section with an email input and a primary Subscribe button; the
  inline message validates the email format.

---

## Global Elements

### Header (`.hdr`)
- Fixed, full width, `z-index:50`, `padding:18px var(--pad)`, flex space-between.
- A `.hdr-bar` backdrop fades in at `opacity:.94` once `scrollY > 40` (`.solid`), with a
  1px bottom border that flips between `--line` and `--line-d` by theme.
- Hides on scroll-down past 400px and returns on scroll-up (`translateY(-110%)`, `.4s`),
  unless the mobile menu is open.
- **Logo:** 110×26px, two stacked `<img>`s (light/dark) cross-faded by `body[data-theme]`.
- **Nav links:** 15px weight 600, pill hover background (7% ink / 10% white on dark).
  Home nav: Services · Work · Testing · Recent developments · Markets.
- **Region control:** a 42px pill with an 8px orange dot, the mono region code, and a
  "· Region" label (hidden < 760px). Opens a 240px white dropdown with all eight regions
  and their currency; the active row tints orange-soft.
- **CTA:** "Start your idea" (orange pill, 44px tall in the header).
- **Burger:** 44px circle (ink, or white on dark) with two 2px bars; hidden above 1080px.

### Mobile menu (`.mmenu`)
- Full-screen ink panel, `z-index:60`, revealed by a circular `clip-path` wipe from the
  top-right (`circle(0%) → circle(150%)`, `.6s`).
- Display-font links at `clamp(44px,12vw,80px)`, turning orange on hover; a white circular
  close button; a footer eyebrow line with contact info.

### Footer
Shared across pages; the home footer carries the full link grid, subpages carry a compact
variant with a back link and copyright.

### The Free L (WebGL)
- **Canvas:** `#gl`, `position:fixed`, full viewport, `z-index:0`, `pointer-events:none`;
  `main` and `footer` sit at `z-index:1`.
- **Geometry:** two `THREE.CapsuleGeometry` meshes (radius 0.44; vertical 1.75, horizontal
  1.55 rotated 90°) — the vertical capsule is `--orange`, the horizontal is a slightly deeper
  `#f25a00`. Materials are `MeshPhysicalMaterial` (roughness .22, metalness .05, clearcoat 1,
  sheen .6, slight emissive) so the rim lights read as coloured reflections.
- **Swarm:** 18 small capsules (12 on mobile) in orange / white / near-black that form the
  per-section shapes: a free orbit (Thinking), a ring (Design), a grid (Development), a
  running belt (Business).
- **Lighting:** hemisphere + key directional + magenta, electric-blue and lime point lights
  whose positions drift, so reflections shift colour over time. Orange stays the hero colour;
  secondary colours exist only as reflections.
- **State machine:** `STATES` in `site/scene.js` maps every section name (`hero`,
  `manifesto`, `fr0`–`fr3`, `services`, `path`, `work`, `qa`, `proof`, `lab`, `labdone`,
  `footer`) to `{x, y, s, split, swarm, mode, spin, tilt}`. The renderer lerps smoothly toward
  the active state. Sections declare themselves with `data-scene`; a scroll handler finds the
  section crossing the viewport midpoint and calls `LTAB3D.setState(name)`, also flipping
  `body[data-theme]` from the section's `data-theme`.
- **Public API:** `window.LTAB3D = { setState(name), pulse(amount), snap() }`. `pulse()` is
  fired by nearly every UI interaction (tab clicks, chip toggles, bug fixes, form steps) to
  make the object breathe in response; `snap()` is called when a lead is submitted.
- **Interaction:** pointer position tilts the L; dragging in `.hero-drag` pulls the capsules
  apart along the logo's diagonal cut and springs them back on release; `deviceorientation`
  drives tilt on mobile. `prefers-reduced-motion` and a mobile override table
  (`MOBILE_OVERRIDE`) reposition and shrink the object per section.
- **Graceful degradation:** if `THREE` or WebGL is unavailable the canvas is hidden and the
  page renders normally.

### Motion & reveal system (important)
`site/common.js` contains a deliberate safety system — **keep it** in any port:
- `.rv` elements are **visible by default**; the fade-up is opt-in.
- A clock probe (`initMotion`) compares `performance.now()` against
  `document.timeline.currentTime`. If the animation clock is frozen (headless renderers,
  some embedded previews) the body gets `data-motion="off"`, which kills all transitions and
  animations so nothing can rest on an animation's first frame.
- `sweepReveal()` runs on scroll, resize, load and two timers, revealing anything in view
  even if the `IntersectionObserver` never fires.

This exists because a stalled reveal makes a long page look blank. Reproduce the same
defensive behaviour with whatever reveal library you adopt.

---

## Interactions & Behavior

- **Scroll-linked:** header solidify/hide; section→3D state; theme flip; manifesto word
  reveal; the 400vh Four Freedoms pin; the path progress bar; stat count-ups; `.rv` reveals.
- **Click:** service pillar tabs; service card → pre-selected lead chips; freedom step rail
  → scroll to step; path switch; market card → set region (and pulse the 3D object); QA bug
  hunt; QA release-readiness tabs; testing-lifecycle steps; deliverables list; packages
  (`<details>` + CTA that pre-selects the package); region dropdown; burger; reader open/close.
- **Hover:** nav pills; buttons (primary darkens, ghost inverts, arrow nudges 3px right);
  service cards (orange fill, −4px, arrow rotates −45°); work/dev/post/package cards
  (`translateY(-4px)`); market cards; reel play button (scale 1.08).
- **Focus:** text inputs and textareas get an orange border plus a 4px
  `rgba(255,106,0,.18)` ring; the search input uses a lighter 14% ring.
- **Animations:** entry `rise` (`opacity 0 → 1`, `translateY(20–30px) → 0`, `.45–.9s`,
  `cubic-bezier(.2,.8,.2,1)`); fades for swapped panels (`.45–.5s`); reader panel
  `slidein` (`.45s`); mobile menu clip-path wipe (`.6s`); the hero hint pill loop (2.4s
  infinite); the bug dot ping (1.8s); the QA alert ping (1.8s). Counter tweens run 900ms
  (QA) / 1400ms (stats) with a cubic ease-out.
- **Loading:** none — everything renders from static markup; the 3D loads after the text.
- **Error states:** form validation messages only (orange, 14px, directly under the card or
  the submit row). No toast or modal system exists; keep it that way.
- **Responsive:** three breakpoints — **1080px** (nav → burger, grid columns collapse,
  two-column layouts stack) and **760px** (16px body, single-column grids, mobile carousels,
  the path timeline goes vertical, the Freedoms rail becomes a 4px bar) plus a
  `prefers-reduced-motion` block that disables all animation and transition. There is no
  tablet-specific layout beyond the 1080px rules.
- **Persistence:** `ltab-region` (region choice) and `ltab-lab-step` (Freedom Lab step) in
  `localStorage`. The reader uses `history.replaceState` for deep links.

---

## State Management

**Freedom Lab lead object** (`site/app.js`):
```js
{ idea, needs[], region, stage, timeline, budget, name, email, phone, phone_country, phone_dial, sent }
```
Transitions: `showStep(i)` drives the six-step wizard and writes the step to localStorage;
`validate(i)` gates forward motion; `submitLead()` builds the payload and sets `sent = true`,
which also switches the 3D scene to `labdone`.

**QA intake state** (`site/qa.js`):
```js
{ focus[], platform[], services[], package, start, access }
```
plus uncontrolled inputs for the product, stack, date, name, email, role, company, country
and phone. Submitted as `type: 'qa_assessment'`.

**Region** — `REGIONS` (code, name, currency, IANA timezone, overlap note, ISO) lives in
`site/common.js`. `guessRegion()` reads the saved value, otherwise derives a region from
`Intl.DateTimeFormat().resolvedOptions().timeZone`. Changing region updates the header label,
the hero region line, the market card selection, the lab region chip, the QA pricing note and
the phone field's dial code.

**Data fetching — lead capture.** Both forms POST JSON to a CRM webhook and are currently
stubbed:
```js
const CRM_ENDPOINT = ''; // site/app.js and site/qa.js
```
Set it to your CRM's webhook URL. Payloads include UTM parameters (`utm_source`,
`utm_campaign`), a `source` string (`ltab.ai/home#lab`, `ltab.ai/software-testing`), the
resolved region and an ISO `submitted_at`. Until the endpoint is set, payloads are logged to
the console. There is **no** server-side validation, no spam protection and no success/failure
branching — add a real submit handler, rate limiting and a retry/error state in production.
Recommended additions: hidden fields for `region`, `service tags`, `source page` and `UTM`;
an optional AI-generated summary of the visitor's idea attached to the lead.

---

## Design Tokens

### Colour
| Token | Value | Use |
|---|---|---|
| `--orange` | `#FF6A00` | Primary accent, CTAs, active states |
| `--orange-deep` | `#E25500` | Primary button hover, deep capsule |
| `--orange-soft` | `#FFE6D3` | Menu row hover, region pills |
| `--ink` | `#121212` | Dark sections, body text, borders |
| `--ink-2` | `#1d1d1d` | Alternate dark |
| `--paper` | `#F6F5F1` | Light page background |
| `--white` | `#ffffff` | Cards on light |
| `--muted` | `#6b6862` | Secondary text on light |
| `--muted-d` | `#9a978f` | Secondary text on dark |
| `--line` | `rgba(18,18,18,.12)` | Dividers on light |
| `--line-d` | `rgba(255,255,255,.14)` | Dividers on dark |
| `--pass` | `#16A34A` | QA passed (pages.css) |
| `--warn` | `#F59E0B` | QA warning |
| `--crit` | `#DC2626` | QA failed / critical |
| `--blocked` | `#64748B` | QA blocked |

Dark surfaces use `#1b1b1b` for cards/panels and `#111` for inputs. Stripe placeholders sit
on `#ecebe6` (light) / `#1a1a1a`, `#1d1d1d`, `#efeee9` (variants).

### Typography
| Token | Family | Weights loaded | Role |
|---|---|---|---|
| `--f-display` | Bricolage Grotesque (Google Fonts, `opsz 12..96`) | 600, 700, 800 | H1, H2, card headlines, big numbers |
| `--f-body` | Manrope | 400, 500, 600, 700 | Body, UI, buttons |
| `--f-mono` | JetBrains Mono | 400, 500 | Eyebrows, labels, indices, clocks |

All three are loaded from Google Fonts with `display=swap` and `preconnect`. Self-host them
in production.

Scale (all fluid `clamp()`):
| Element | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| Hero H1 `.display` | `clamp(68px,11.5vw,184px)` | 800 | −.045em | .9 |
| Section H2 `.h2` | `clamp(40px,6.4vw,96px)` | 800 | −.035em | .95 |
| Subpage H1 | `clamp(52px,8.4vw,132px)` | 800 | −.045em | .9 |
| Card H3 `.h3` | `clamp(22px,2.2vw,30px)` | 700 | −.02em | 1.05 |
| Footer big | `clamp(64px,13vw,220px)` | 800 | −.06em | .85 |
| Manifesto | `clamp(42px,7.4vw,124px)` | 800 | −.04em | .98 |
| Stat value | `clamp(72px,10vw,150px)` | 800 | −.06em | .85 |
| Lede `.lede` | `clamp(17px,1.4vw,20px)` | 400 | — | 1.55 |
| Body | 17px (16px < 760px) | 400 | — | 1.55 |
| Button | 16px | 700 | — | — |
| Eyebrow | 12px mono | 400/500 | .12em, uppercase | — |

### Spacing & layout
- Page gutter: `--pad: clamp(20px, 5vw, 72px)`.
- Content width: `.wrap` `max-width:1360px`, centred.
- Section padding: `clamp(90px,12vw,170px) var(--pad)`.
- Card grids: 12–14px gaps. Inner card padding 22–30px; large panels
  `clamp(24px,3vw,44px)`.
- Component gaps: 6–12px (chips, pills), 14–16px (lists), 18–22px (card internals),
  40–60px (two-column layouts).

### Radius
`--r-sm:12px` · `--r:20px` · `--r-lg:32px` · `--pill:999px`.
Buttons and chips are always pills; cards are 32px; inputs and market cards are 20px.

### Shadow
Used sparingly: dropdowns `0 20px 60px rgba(0,0,0,.18)`; the dark phone list
`0 20px 60px rgba(0,0,0,.35)`; primary buttons carry an inset highlight
`inset 0 1px 0 rgba(255,255,255,.25)`. No elevation on cards — depth comes from
`translateY(-4px)` on hover and from the WebGL layer.

### Motion
`--ease: cubic-bezier(.2,.8,.2,1)`. Micro-interactions 200–350ms; panel swaps 450–600ms;
entrances 600–900ms; counters 900–1400ms.

### Breakpoints
`1080px` (tablet/nav collapse) and `760px` (mobile), plus
`@media (prefers-reduced-motion: reduce)`.

---

## Copywriting & Tone

Preserve this voice — it is deliberate and load-bearing:
- Short declarative sentences, second person, no jargon. "Think it, design it, build it your
  way." "We're the team that makes it real."
- Plain-English explanations instead of industry terms, with the term introduced afterwards
  ("QA means quality assurance: checking software in a planned way…").
- Honest, slightly contrarian boundaries: "A promise of zero bugs. No review can honestly
  offer that." / "You should be careful with anyone who says yes."
- No exclamation marks, no emoji, no hype adjectives.
- Numbers are used as proof, not decoration: 100+ companies · 5 years · 8 markets.

---

## Assets

| Asset | Path | Notes |
|---|---|---|
| LTAB logo (full) | `assets/ltab-logo.png` | Source logo, 112 KB |
| Logo, light background | `assets/ltab-logo-light.png` | 26px tall in the header |
| Logo, dark background | `assets/ltab-logo-dark.png` | Cross-faded on `data-theme="dark"` |

**Placeholder imagery to replace** (all currently striped CSS gradients with mono labels):
- Home §07 — five project screenshots, one AI video showreel (60–90s, muted autoplay).
- Home §10 — three development visuals (interactive demo / screen recording, video still,
  workflow diagram).
- Our Work — 48 project thumbnails and per-project hero + screen shots inside the reader.
- Recent Developments — seven post covers; three of them host live demos.
- QA page — no photography; all visuals are built from UI.

**Fonts:** Bricolage Grotesque, Manrope and JetBrains Mono, loaded from Google Fonts. Self-host
for production.

**Third-party:** Three.js `0.149.0` from unpkg (UMD `three.min.js`). Swap for a pinned local
build or a maintained fork — note that `outputEncoding` / `sRGBEncoding` are pre-r152 API
names.

---

## Files

All design references live in `design_handoff_ltab-ai-website/`:

| File | What it is |
|---|---|
| `LTAB AI Website.html` | Home page — all twelve sections |
| `Software Testing.html` | QA service page |
| `Our Work.html` | Project archive + case-study reader |
| `Recent Developments.html` | Updates index + reader with interactive demos |
| `site/styles.css` | Global system: tokens, type, buttons, header, hero, manifesto, freedoms, services, path, work, QA, proof, lab form, footer, reveal system, responsive |
| `site/pages.css` | Subpage components: sub-hero, release-readiness panel, testing types, checks, flagship, life cycle, personas, packages, deliverables, boundaries, roles, FAQ, intake, developments, reader, work archive |
| `site/common.js` | Shared: regions, timezone detection, phone/country-code field, subpage header, reveal net, motion-clock guard |
| `site/scene.js` | The Free L — Three.js scene, state machine, pointer/drag/gyro input, `LTAB3D` API |
| `site/app.js` | Home page logic: region, header, section→3D, manifesto, freedoms pin, path, services tabs, two paths, bug hunt, Freedom Lab, lead submit |
| `site/qa.js` | QA page logic: readiness panel, life cycle, deliverables, region pricing, intake form |
| `assets/ltab-logo*.png` | Brand logos |
| `Website Map v2.md` | Original content/IA brief — useful for the full sitemap, per-region plans and the pages not yet designed |

### Recommended build order
1. Design tokens + typography (port `:root` from `styles.css`).
2. Header, mobile menu, footer, buttons, chips, inputs.
3. Home sections 01–06 (static layout first, then scroll behaviours).
4. The Free L as its own module behind a single mount point.
5. Services tabs, work grid, QA teaser, proof/markets, developments.
6. Freedom Lab wizard + phone field + CRM endpoint.
7. The three subpages.
8. Replace placeholder imagery and synthetic project/post data.
9. Add a real submit handler, spam protection and error states.

### Not yet designed (see `Website Map v2.md` for the brief)
Service detail pages for the other eight services, the eight region pages (`/us /ca /au /nz
/eu /ae /my /sg`, English only, with hreflang), individual case-study pages, About (5-year
timeline), Insights, Careers, Contact, and Legal (Privacy / Terms / Cookies / GDPR).
