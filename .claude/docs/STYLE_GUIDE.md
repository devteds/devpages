# DevGuides — Style Guide

This is the visual design system for all DevGuides guides. Claude Code reads this
before generating any HTML. Every guide must follow these specifications exactly.
Do not invent new colors, fonts, or layout patterns — use what is defined here.

---

## Design Philosophy

- **Dark terminal aesthetic** — guides feel at home next to a terminal
- **Functional density** — information is packed but never cluttered
- **Monospace-first** — code and commands are the hero, prose supports them
- **Scannable** — a developer should find what they need in under 5 seconds
- **Timeless** — no trendy gradients or animations that age poorly; subtle scanlines and grid backgrounds are acceptable

---

## Color System

All colors are defined as CSS custom properties on `:root`.
Every guide must declare these exact variables:

```css
:root {
  /* Backgrounds */
  --bg:        #080b10;   /* page background */
  --surface:   #0e1219;   /* card / section background */
  --surface2:  #141920;   /* hover state, nested surfaces */

  /* Borders */
  --border:    #1c2333;   /* default border */
  --border2:   #243040;   /* slightly lighter border for inputs */

  /* Brand accents */
  --accent-purple: #7c6af7;   /* tmux / primary accent */
  --accent-green:  #38d9a9;   /* claude / secondary accent */
  --accent-orange: #f7a94a;   /* warnings, workflows, both-layer items */
  --accent-red:    #f06a6a;   /* errors, danger */

  /* Text */
  --text:  #d8dde8;   /* primary text */
  --muted: #5a6480;   /* secondary text, labels, placeholders */

  /* Syntax coloring (for code blocks) */
  --syn-comment:  #2e3f55;   /* code comments */
  --syn-command:  #38d9a9;   /* commands, keywords */
  --syn-flag:     #7c6af7;   /* flags, accent words */
  --syn-string:   #f7a94a;   /* strings, values */
  --syn-text:     #8a90a8;   /* neutral code text */
}
```

### Color Usage Rules

- Never use hex values directly in component CSS — always use the CSS variable
- `--bg` is only used on `body` background
- `--surface` is the default card/section background
- `--surface2` is used for hover states and nested elements only
- `--accent-purple` is the primary interactive color (focused inputs, active tabs)
- `--accent-green` is for Claude CLI commands and secondary highlights
- `--accent-orange` is for items that span both tmux and Claude, or for warnings
- `--accent-red` is for error states only, never for decoration
- `--muted` is for metadata, labels, and de-emphasized text — never for body copy

---

## Typography

### Font Stack

Guides use exactly three fonts loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
```

| Font | Variable | Usage |
|---|---|---|
| IBM Plex Mono | `--mono` | All code, commands, kbd elements, labels |
| Syne | `--display` | Page titles, section headers (h1, h2) |
| Inter | `--sans` | Body text, descriptions, prose |

```css
:root {
  --mono:    'IBM Plex Mono', monospace;
  --sans:    'Inter', sans-serif;
  --display: 'Syne', sans-serif;
}

body {
  font-family: var(--sans);
}
```

### Type Scale

| Element | Font | Size | Weight |
|---|---|---|---|
| Page title (h1) | --display | clamp(1.8rem, 4vw, 3rem) | 800 |
| Section title (h2) | --display | 0.8rem | 700 |
| Card label | --mono | 0.65rem | 600 |
| Body text | --sans | 0.9rem–1rem | 400 |
| Command (kbd) | --mono | 0.78rem | 400 |
| Description text | --sans | 0.8rem–0.88rem | 400 |
| Muted label | --mono | 0.65rem–0.72rem | 600 |
| Code block | --mono | 0.78rem | 400 |

### Section Title Treatment

Section titles use a specific pattern: small caps, letter-spaced, with a colored dot indicator.

```html
<div class="section-header">
  <div class="section-dot dot-purple"></div>
  <span class="section-title purple">TMUX — SESSION MANAGEMENT</span>
  <span class="section-desc">// working across multiple projects</span>
</div>
```

Section title color classes:
- `purple` — tmux-related content
- `green` — Claude CLI content
- `orange` — workflow / both-layer content

---

## Layout System

### Page Structure

```
body
└── .wrap (max-width: 1100px, centered, padding: 2.5rem 1.5rem 5rem)
    ├── header
    ├── .search-wrap (if guide has search)
    ├── .tabs (if guide has category tabs)
    ├── .legend (if guide has color-coded layers)
    └── .section × N
        ├── .section-header
        └── .cards
            └── .card × N
                ├── .card-label
                └── .cmd-row × N (or other content)
```

### Wrap

```css
.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
  position: relative;
  z-index: 1;
}
```

### Cards Grid

The `.cards` container uses CSS Grid with auto-fill columns:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1px;
  background: var(--border);   /* gap color via background trick */
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.card {
  background: var(--surface);
  padding: 1.1rem 1.3rem;
  transition: background 0.15s;
}

.card:hover { background: var(--surface2); }

.card.full {
  grid-column: 1 / -1;   /* full width card */
}
```

### Responsive Breakpoints

```css
@media (max-width: 600px) {
  .cards { grid-template-columns: 1fr; }
}
```

---

## Background Treatment

Every guide must include these two background effects on `body`:

### Scanline overlay (via `body::before`)
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.04) 2px,
    rgba(0,0,0,0.04) 4px
  );
  pointer-events: none;
  z-index: 1000;
}
```

### Grid background (via `body::after`)
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(124,106,247,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,106,247,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
```

The `.wrap` must have `position: relative; z-index: 1` to render above these layers.

---

## Header Pattern

Every guide header follows this pattern:

```html
<header>
  <div class="logo-row">
    <a class="back-link" href="../../index.html">← DevGuides</a>
  </div>
  <div class="pill-row">
    <span class="pill pill-purple">tmux</span>
    <span class="separator">×</span>
    <span class="pill pill-green">claude cli</span>
  </div>
  <h1><span class="purple">tmux</span> <span class="muted">×</span> <span class="green">Claude</span><br>Cheatsheet</h1>
  <p class="byline">// multi-project · multi-session · multi-agent</p>
  <p class="author">by <a href="[author url]" target="_blank">[Author Name]</a></p>
</header>
```

```css
header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 2rem;
  margin-bottom: 2.5rem;
}

.back-link {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--muted);
  text-decoration: none;
}
.back-link:hover { color: var(--text); }

.pill {
  font-family: var(--mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  border: 1px solid;
}
.pill-purple { border-color: var(--accent-purple); color: var(--accent-purple); background: rgba(124,106,247,0.08); }
.pill-green  { border-color: var(--accent-green);  color: var(--accent-green);  background: rgba(56,217,169,0.08); }
.pill-orange { border-color: var(--accent-orange); color: var(--accent-orange); background: rgba(247,169,74,0.08); }

.byline {
  font-size: 0.88rem;
  color: var(--muted);
  font-family: var(--mono);
}

.author {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--muted);
  margin-top: 0.5rem;
  letter-spacing: 0.03em;
}
.author a {
  color: var(--accent-green);
  text-decoration: none;
}
.author a:hover { text-decoration: underline; }

h1 {
  font-family: var(--display);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0.75rem 0 0.5rem;
}
h1 .purple { color: var(--accent-purple); }
h1 .green  { color: var(--accent-green); }
h1 .muted  { color: var(--muted); }
```

---

## Section Header Pattern

```css
.section { margin-bottom: 2rem; }

.section-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border);
}

.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-purple { background: var(--accent-purple); box-shadow: 0 0 8px var(--accent-purple); }
.dot-green  { background: var(--accent-green);  box-shadow: 0 0 8px var(--accent-green); }
.dot-orange { background: var(--accent-orange); box-shadow: 0 0 8px var(--accent-orange); }

.section-title {
  font-family: var(--display);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.section-title.purple { color: var(--accent-purple); }
.section-title.green  { color: var(--accent-green); }
.section-title.orange { color: var(--accent-orange); }

.section-desc {
  font-size: 0.75rem;
  color: var(--muted);
  font-family: var(--mono);
  margin-left: auto;
}
```

---

## Animation Rules

Minimal, purposeful animation only:

```css
/* Section fade-in on load */
.section {
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Stagger delay per section */
.section:nth-child(1) { animation-delay: 0.05s; }
.section:nth-child(2) { animation-delay: 0.10s; }
/* etc up to 8 */

/* Hover transitions on cards only */
.card { transition: background 0.15s; }

/* No other animations */
```

Rules:
- No infinite animations on content
- No parallax
- No scroll-triggered animations (they conflict with keyboard navigation)
- Cursor blink in terminal visualizations is acceptable

---

## Search Component

Any guide with more than 15 searchable items must include a search input.

See `COMPONENTS.md` for the exact HTML pattern and JS implementation.

Search behavior rules:
- Filters live as user types (no submit button)
- Shows match count (e.g., "12 matches")
- Highlights matched text in results
- Shows "No results" message when nothing matches
- Does not filter across sections that are hidden by tab/filter

---

## Footer Pattern

Every guide must include a footer with the Devteds attribution and GitHub link:

```html
<footer>
  <p>DevGuides by <a href="https://devteds.com" target="_blank">Devteds</a> &middot; <a href="https://github.com/devteds/devpages" target="_blank">GitHub</a></p>
</footer>
```

```css
footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--muted);
}
footer a {
  color: var(--accent-green);
  text-decoration: none;
}
footer a:hover { text-decoration: underline; }
```

---

## SEO Requirements

Every guide must include the following in `<head>` for search engine and social media optimization.

### Required Meta Tags

```html
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://devteds.github.io/devpages/guides/[slug]/" />
```

### Open Graph Tags

```html
<meta property="og:type" content="article" />
<meta property="og:title" content="[Guide Title]" />
<meta property="og:description" content="[Guide description from meta.json]" />
<meta property="og:url" content="https://devteds.github.io/devpages/guides/[slug]/" />
<meta property="og:site_name" content="DevGuides by Devteds" />
<meta property="article:published_time" content="[YYYY-MM-DD]" />
<meta property="article:author" content="[Author Name]" />
```

### Twitter Card Tags

```html
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="[Guide Title]" />
<meta name="twitter:description" content="[Guide description from meta.json]" />
```

### JSON-LD Structured Data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "[Guide Title]",
  "description": "[Guide description]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "url": "[Author URL if available]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Devteds",
    "url": "https://devteds.com"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "url": "https://devteds.github.io/devpages/guides/[slug]/",
  "keywords": ["tag1", "tag2"],
  "articleSection": "[category]"
}
</script>
```

### Base URL

The GitHub Pages base URL is: `https://devteds.github.io/devpages/`
All canonical and og:url values must use this base.
