# DevPages

**Live site:** [devteds.github.io/devpages](https://devteds.github.io/devpages/)

A Git-backed developer knowledge publishing system powered by Claude Code.

DevPages helps you create, preview, and publish beautiful standalone HTML guide artifacts to GitHub Pages. Each guide is a single self-contained HTML file — no build tools, no frameworks, no dependencies.

## How It Works

1. Open this repo in Claude Code
2. Run `/newguide` to create a guide interactively
3. Preview it in your browser
4. Run `/publish` to push it live to GitHub Pages

## Commands

| Command | Description |
|---|---|
| `/newguide` | Create a new guide from scratch |
| `/publish [slug]` | Publish a guide to GitHub Pages |
| `/updateguide [slug]` | Update an existing guide |
| `/listguides` | List all guides with status |
| `/previewguide [slug]` | Open a guide in your browser |

## Repository Structure

```
├── CLAUDE.md                    — Instructions for Claude Code
├── index.html                   — Auto-generated hub page
├── guides/                      — One folder per guide
│   └── [slug]/
│       ├── index.html           — The guide (standalone HTML)
│       └── meta.json            — Guide metadata
├── scripts/
│   └── build-index.js           — Regenerates index.html
├── .claude/
│   ├── docs/
│   │   ├── STYLE_GUIDE.md      — Visual design system
│   │   └── COMPONENTS.md       — Reusable HTML/CSS patterns
│   └── skills/                  — Slash command workflows
│       ├── newguide/
│       ├── publish/
│       ├── updateguide/
│       ├── listguides/
│       └── previewguide/
└── .github/workflows/
    └── pages.yml                — GitHub Pages deployment
```

## Setup

1. Clone this repo
2. Enable GitHub Pages: Settings → Pages → Deploy from branch → `main` / `/ (root)`
3. Set up your author identity (see below)
4. Open in Claude Code and run `/newguide`

## Author Configuration

Guides are attributed to the author. Create a `.author.json` file in the project root:

```bash
cp .author.example.json .author.json
```

Then edit it with your details:

```json
{
  "name": "Your Name",
  "url": "https://linkedin.com/in/yourhandle",
  "email": "you@example.com"
}
```

- `name` — **required** — your display name
- `url` — optional — link attached to your name (LinkedIn, website, etc.)
- `email` — optional — not displayed publicly, stored in meta.json only

If `.author.json` is not present, the author defaults to your `git config user.name`.

> **Note:** `.author.json` is gitignored — each contributor maintains their own.

## Prerequisites

- Node.js >= 16 (for build-index.js)
- Git with push access to this repo
- Claude Code CLI

## Contributing

Contributions are welcome! To get started:

1. Fork this repo
2. Clone your fork and set up your `.author.json` (see above)
3. Create a branch for your guide: `git checkout -b guide/your-topic`
4. Run `/newguide` in Claude Code to create your guide
5. Preview it locally, then open a PR against `main`

### Guidelines

- One guide per PR
- Follow the existing style guide (`.claude/docs/STYLE_GUIDE.md`)
- Keep guides self-contained — no external file dependencies
- Include accurate, up-to-date commands and shortcuts
- Test that the HTML renders correctly via `file://` before submitting

## License

This project is licensed under the [MIT License](LICENSE).

## Copyright

© 2026 [Devteds](https://devteds.com). All rights reserved.
