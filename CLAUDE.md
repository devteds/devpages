# DevGuides — Claude Code Instructions

You are the authoring engine for DevGuides, a developer knowledge publishing system.
This repository contains standalone HTML guide artifacts published via GitHub Pages.

Your job is to help create, refine, and publish developer guides using a defined
workflow. You always confirm before committing or pushing. You always read the
style guide before generating HTML. You never invent styles — you follow the spec.

---

## Repository Layout

- `.claude/docs/STYLE_GUIDE.md` — visual design system, CSS variables, typography rules
- `.claude/docs/COMPONENTS.md`  — reusable HTML/CSS component patterns with examples
- `.claude/skills/`             — slash command workflows (newguide, publish, updateguide, listguides, previewguide)
- `guides/`                     — one subdirectory per guide, each with index.html + meta.json
- `index.html`                  — auto-generated hub (never edit manually)
- `scripts/build-index.js`      — regenerates index.html from all meta.json files

---

## Slash Commands (Skills)

All workflows are registered as Claude Code skills in `.claude/skills/`.
Users invoke them as slash commands:

| Command | Description |
|---------|-------------|
| `/newguide [topic]` | Create a new guide from scratch |
| `/publish <slug>` | Publish a guide to GitHub Pages |
| `/updateguide <slug>` | Update an existing guide |
| `/listguides` | List all guides with metadata |
| `/previewguide <slug>` | Open a guide in the browser |

Each skill's `SKILL.md` contains the full workflow steps.

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

ALWAYS read `.claude/docs/STYLE_GUIDE.md` and `.claude/docs/COMPONENTS.md` before generating any HTML.
NEVER copy HTML from a previous guide — always generate fresh from the spec.
NEVER reference external files within the repo (no ../shared/styles.css etc.)
ALWAYS use Google Fonts CDN for fonts (single link tag in head)
ALWAYS include a working search if the guide has more than 15 items
ALWAYS use <pre> tags (not <div>) for code blocks
ALWAYS include meta description tag using the guide's description field
ALWAYS set <title> to the guide title + " — DevGuides"
ALWAYS include a back link to the index page using relative path: `../../index.html`

The HTML file must render correctly:
- When opened directly via file:// (no server)
- When served via GitHub Pages at https://[user].github.io/devpages/guides/[slug]/

---

## Git Commit Message Format

feat(guide): add [title]          <- new guide
fix(guide): update [title]        <- updating existing guide
chore(index): regenerate index    <- index-only update
chore(style): update style guide  <- style system changes

---

## Git Workflow Rules

- Never force push
- One commit per publish — do not bundle unrelated changes
- Always pull before push: `git pull --rebase origin main`
- Never commit node_modules, .DS_Store, or other junk

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
