---
name: updateguide
description: Update an existing guide's content or metadata with preview and publish option
disable-model-invocation: true
argument-hint: "<slug>"
---

# Update an Existing Guide

Update the guide with slug `$ARGUMENTS`.

If no slug is provided, list all guides (scan `guides/` for directories with `meta.json`) and ask the user to pick one.

---

## Step 1 — Load Existing Guide

Read `guides/[slug]/index.html` and `guides/[slug]/meta.json`.

If the slug doesn't exist:
```
No guide found with slug "[slug]".
Use /listguides to see available guides, or /newguide to create a new one.
```

Present the loaded guide summary:
```
Loaded: [title] ([slug])
Created: [created] | Last updated: [updated]
Tags: [tag1], [tag2], [tag3]

What would you like to change?
```

Wait for user response.

---

## Step 2 — Describe Changes

User describes what they want changed. Summarize the changes you will make and ask for confirmation before editing.

---

## Step 3 — Update Files

Before making HTML changes:
1. Read `.claude/docs/STYLE_GUIDE.md` fully
2. Read `.claude/docs/COMPONENTS.md` fully

Apply the changes to the HTML and/or meta.json.

Update the `updated` field in meta.json to today's date.

---

## Step 4 — Preview and Iterate

Open preview: `open guides/[slug]/index.html` (macOS) or `xdg-open` (Linux)

Prompt:
```
Review the updated guide in your browser.
  • "looks good" or "yes" → ready to publish
  • Describe any changes → I'll update and re-preview
  • "cancel" → keep changes on disk without publishing
```

Iterate until the user is satisfied.

---

## Step 5 — Offer to Publish

When the user approves:
```
Guide updated. Run /publish [slug] to push the changes live.
```

Note: When publishing an update, the commit message should use `fix(guide): update [title]` (not `feat`).
