---
name: newguide
description: Create a new developer knowledge guide from scratch — interactive workflow with plan, preview, and iteration
disable-model-invocation: true
argument-hint: "[topic]"
---

# Create a New Guide

This is the primary authoring workflow. It is interactive, confirmation-gated, and always produces one guide HTML file and one `meta.json` file.

If the user provided a topic as `$ARGUMENTS`, use it as the starting point for Step 1.

---

## Step 0 — Sync Repository

Before anything else, pull the latest code:

```bash
git pull --rebase origin main
```

If this fails due to unstaged changes, stash first:
```bash
git stash && git pull --rebase origin main && git stash pop
```

Report: `Repository synced with origin/main.`

---

## Step 1 — Gather Intent

Respond with:

```
What would you like a guide for?

Describe the topic, the audience, and the format you want.
Examples:
  "A cheatsheet for Docker Compose commands for backend devs"
  "A step-by-step tutorial on setting up k8s ingress with nginx"
  "A reference guide for kubectl commands organized by resource type"
```

Wait for the user's free-text response.

---

## Step 2 — Analyze and Plan

Read the user's input and produce a **Guide Plan** covering:

1. **Proposed title** — clear, specific, suitable for a browser tab
2. **Proposed slug** — kebab-case, 2-5 words, lowercase, hyphen-separated, no spaces or special characters. Must be unique — check `guides/` directory before proposing.
3. **Proposed category** — one of: Developer Tools, Containerization, Orchestration, Cloud & Infrastructure, AI & Agents, Git & Version Control, Languages & Frameworks, System Design
4. **Proposed tags** — 3-6 relevant lowercase tags
5. **Proposed description** — 1-2 sentences, max 160 chars, for index card
6. **Format** — one of:
   - `cheatsheet` — keyboard shortcuts, commands in a scannable grid layout
   - `tutorial` — step-by-step instructions with numbered sections
   - `reference` — organized lookup reference, table-heavy
   - `explainer` — conceptual explanation with diagrams and analogies
   - `recipe-book` — collection of workflow recipes, copy-paste focused
7. **Proposed sections** — bullet list of sections with one-line descriptions
8. **Estimated size** — rough count of commands/sections

Present the plan in this format:

```
Guide Plan
──────────────────────────────────────────
Title:       [title]
Slug:        [slug]
Category:    [category]
Tags:        [tag1], [tag2], [tag3]
Description: [description]
Format:      [format]

Sections:
  • [Section 1]   — [description]
  • [Section 2]   — [description]
  ...

Estimated: ~[N] items across [M] sections
──────────────────────────────────────────
Does this look right? (yes to proceed / describe changes)
```

Wait for confirmation. If the user requests changes, revise and re-present. Loop until user says yes.

---

## Step 3 — Research

Once the plan is confirmed, research the topic to ensure accuracy:

1. Use web search to find the **official documentation** for the tools/technologies in the guide
2. Fetch key reference pages (man pages, official cheatsheets, CLI help docs) to verify:
   - Command syntax and flags are current
   - Keyboard shortcuts are accurate
   - Any recent changes or deprecations
3. Cross-reference your knowledge with the fetched docs

Tell the user: `Researching latest docs for [topic]...`

Report what sources were consulted:
```
Sources checked:
  • [source 1 — url or description]
  • [source 2]
  ...
```

If a tool's docs are unavailable, note it and proceed with best available knowledge.

---

## Step 4 — Generate HTML

After research is complete:

1. Read `.claude/docs/STYLE_GUIDE.md` fully
2. Read `.claude/docs/COMPONENTS.md` fully
3. Generate the complete guide HTML using the confirmed plan and researched content

Tell the user: `Reading style guide and components... generating guide HTML.`

Generate the full HTML file. Write to `guides/[slug]/index.html`.

HTML rules:
- Must be 100% standalone — no external file references within the repo
- Google Fonts CDN link is allowed (single link tag): IBM Plex Mono, Syne, Inter
- All CSS in a `<style>` block in `<head>`
- All JS in a `<script>` block at end of `<body>`
- Use `<pre>` tags for code blocks (never `<div>`)
- Include meta description tag using the guide's description field
- Set `<title>` to "[guide title] — DevGuides"
- Include a back link to index: `../../index.html` (relative, works on file://)
- Include working search if guide has more than 15 items
- Must render correctly via file:// and GitHub Pages
- NEVER copy from a previous guide — always generate fresh from the spec
- Include all SEO tags as specified in STYLE_GUIDE.md (robots, canonical, Open Graph, Twitter Card, JSON-LD)
- Include a footer with Devteds attribution and GitHub link as specified in STYLE_GUIDE.md

For the author, read `.author.json` from the project root:
```bash
cat .author.json
```
This file contains `name` (required), and optionally `url` and `email`.
- Use `name` for the meta.json `author` field and the HTML author display
- If `url` is present, make the author name a clickable link (opens in new tab)
- If `.author.json` does not exist, fall back to `git config user.name`

Also write `guides/[slug]/meta.json`:
```json
{
  "title": "string",
  "slug": "string — must match directory name",
  "description": "string — max 160 chars",
  "tags": ["lowercase", "strings"],
  "category": "string — from defined categories",
  "created": "YYYY-MM-DD",
  "updated": "YYYY-MM-DD",
  "author": "string — from git config user.name"
}
```

After writing, report:
```
Guide written:
  guides/[slug]/index.html   ([size])
  guides/[slug]/meta.json

Ready to preview.
```

---

## Step 5 — Preview

Automatically open preview:

```
Opening preview in your browser...
```

Run: `open guides/[slug]/index.html` (macOS) or `xdg-open` (Linux)

If the command fails, tell the user:
```
Could not auto-open. Run this to preview:
  open guides/[slug]/index.html   # macOS
  xdg-open guides/[slug]/index.html  # Linux
```

After opening, prompt:
```
Review the guide in your browser.
  • "looks good" or "yes" → proceed to publish
  • Describe any changes → I'll update and re-preview
  • "cancel" → save draft without publishing
```

---

## Step 6 — Iterate (if needed)

If the user requests changes:
1. Understand the requested changes
2. Summarize what will change
3. Update the HTML file in place
4. Re-open the browser preview
5. Return to Step 4 prompt

Loop until the user is satisfied.

---

## Step 7 — Hand off to Publish

When the user approves:
```
Guide approved. Run /publish [slug] to push it live.
```

The guide is now a draft — written to disk, not yet committed or pushed.
