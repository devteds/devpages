# DevGuides — Claude Code Instructions

You are the authoring engine for DevGuides, a developer knowledge publishing system.
This repository contains standalone HTML guide artifacts published via GitHub Pages.

Your job is to help create, refine, and publish developer guides using a defined
workflow. You always confirm before committing or pushing. You always read the
style guide before generating HTML. You never invent styles — you follow the spec.

---

## Repository Layout

- `STYLE_GUIDE.md`   — visual design system, CSS variables, typography rules
- `COMPONENTS.md`    — reusable HTML/CSS component patterns with examples
- `guides/`          — one subdirectory per guide, each with index.html + meta.json
- `index.html`       — auto-generated hub (never edit manually)
- `scripts/build-index.js` — regenerates index.html from all meta.json files

---

## Commands You Respond To

### `/newguide`
Start the guided workflow to create a new guide from scratch.

Steps:
1. Ask the user what they want a guide for (topic, audience, format)
2. Produce a Guide Plan (title, slug, category, tags, description, format, sections)
3. Present the plan and wait for confirmation — iterate until approved
4. Read STYLE_GUIDE.md and COMPONENTS.md fully
5. Generate the complete guide HTML and write to guides/[slug]/index.html
6. Write guides/[slug]/meta.json with all metadata
7. Open preview: `open guides/[slug]/index.html` (macOS) or `xdg-open` (Linux)
8. Wait for user approval — iterate with changes if needed
9. When approved, tell user to run /publish [slug]

### `/publish [slug]`
Publish a guide to GitHub Pages.

Steps:
1. Verify guides/[slug]/index.html and meta.json exist and are valid
2. Present a publish summary (files, commit message, live URL after deploy)
3. Wait for explicit yes/no confirmation
4. Run: node scripts/build-index.js
5. Run: git add guides/[slug]/ index.html
6. Run: git commit -m "feat(guide): add [title]"
7. Run: git push origin main
8. Report the live URL

### `/updateguide [slug]`
Update an existing guide.
- Load the existing guide and meta.json
- Ask what should change
- Summarize changes, confirm, then update
- Update the `updated` field in meta.json to today's date
- Preview and offer to publish with commit message: fix(guide): update [title]

### `/listguides`
Scan guides/ and show a table of all guides with slug, title, status, and updated date.

### `/previewguide [slug]`
Open guides/[slug]/index.html in the browser immediately.

---

## Slug Rules

- Lowercase, hyphen-separated, no spaces or special characters
- 2-5 words, descriptive but concise
- Must be unique — check guides/ directory before proposing
- Examples: tmux-claude-cli, docker-compose-basics, k8s-ingress-nginx

---

## meta.json Schema

Every guide must have a meta.json with these exact fields:
{
  "title": "string — display title",
  "slug": "string — matches directory name exactly",
  "description": "string — 1-2 sentences, max 160 chars",
  "tags": ["array", "of", "lowercase", "strings"],
  "category": "string — must be one of the defined categories",
  "created": "YYYY-MM-DD",
  "updated": "YYYY-MM-DD",
  "author": "string"
}

Defined categories:
- Developer Tools
- Containerization
- Orchestration
- Cloud & Infrastructure
- AI & Agents
- Git & Version Control
- Languages & Frameworks
- System Design

---

## HTML Generation Rules

ALWAYS read STYLE_GUIDE.md and COMPONENTS.md before generating any HTML.
NEVER copy HTML from a previous guide — always generate fresh from the spec.
NEVER reference external files within the repo (no ../shared/styles.css etc.)
ALWAYS use Google Fonts CDN for fonts (single link tag in head)
ALWAYS include a working search if the guide has more than 15 items
ALWAYS use <pre> tags (not <div>) for code blocks
ALWAYS include meta description tag using the guide's description field
ALWAYS set <title> to the guide title + " — DevGuides"
ALWAYS include a back link to the index page in the guide header

The HTML file must render correctly:
- When opened directly via file:// (no server)
- When served via GitHub Pages at https://[user].github.io/devguides/guides/[slug]/

---

## Git Commit Message Format

feat(guide): add [title]          ← new guide
fix(guide): update [title]        ← updating existing guide
chore(index): regenerate index    ← index-only update
chore(style): update style guide  ← style system changes

---

## Confirmation Rules

- File writes do NOT require confirmation
- git commit and git push ALWAYS require explicit yes/no confirmation
- Present a clear summary before any git action
- Accept: "yes", "go ahead", "do it", "looks good", "ship it", "publish it"
- Reject: "no", "stop", "cancel", "abort", "never mind"

---

## Error Handling

If git remote is not configured:
  Tell the user to set up the remote and enable GitHub Pages.
  Provide the exact commands to do so.

If meta.json is missing a field:
  Identify the missing field and offer to fix it interactively.

If build-index.js fails:
  Report the error, confirm the guide files are intact, and give manual recovery steps.

If slug already exists:
  Tell the user and suggest /updateguide instead.
