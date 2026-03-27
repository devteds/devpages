---
name: publish
description: Publish a guide to GitHub Pages — commits, rebuilds index, and pushes
disable-model-invocation: true
argument-hint: "<slug>"
---

# Publish a Guide

Publish the guide with slug `$ARGUMENTS` to GitHub Pages.

If no slug is provided, list unpublished (uncommitted) guides in `guides/` and ask the user which one to publish.

---

## Step 1 — Pre-publish Check

Run these checks in order. If any fail, report the specific issue and stop.

1. Does `guides/[slug]/index.html` exist? If not: `No guide found at guides/[slug]/. Run /newguide to create one.`
2. Does `guides/[slug]/meta.json` exist and contain valid JSON with all 8 required fields (title, slug, description, tags, category, created, updated, author)? If a field is missing: identify it and offer to fix it interactively.
3. Is there a git repo initialized? (`git rev-parse --git-dir`)
4. Is there a remote named `origin`? If not:
   ```
   No git remote found. Set up GitHub Pages first:
     1. Create a repo on GitHub
     2. git remote add origin https://github.com/[user]/devpages.git
     3. git push -u origin main
     4. Enable Pages: repo Settings → Pages → Deploy from branch → main
   ```
5. Are there any merge conflicts in the working tree?

---

## Step 2 — Confirm Publish

Read meta.json to get the title. Determine if this is a new guide or an update (check git status).

Present the publish summary:

```
Publish Summary
──────────────────────────────────────────
Guide:       [title]
Slug:        [slug]
URL after publish:
  https://[username].github.io/devpages/guides/[slug]/

Files to commit:
  + guides/[slug]/index.html
  + guides/[slug]/meta.json
  ~ index.html  (will be regenerated)

Commit message:
  feat(guide): add [title]

This will push to origin/main and trigger GitHub Pages deployment.
Deployment takes ~30 seconds after push.
──────────────────────────────────────────
Proceed? (yes / no)
```

For updates to existing guides, use commit message: `fix(guide): update [title]`

Wait for explicit confirmation.
- Accept: "yes", "go ahead", "do it", "looks good", "ship it", "publish it"
- Reject: "no", "stop", "cancel", "abort", "never mind" → stop and report what was/wasn't done

---

## Step 3 — Regenerate Index

Run:
```bash
node scripts/build-index.js
```

Report: `Index regenerated: N guides indexed.`

If build fails:
```
Index build failed. Error:
  [error output]
The guide files are intact. Fix the error above and re-run:
  node scripts/build-index.js
Then commit and push manually.
```

---

## Step 4 — Git Commit and Push

Run:
```bash
git pull --rebase origin main
git add guides/[slug]/index.html
git add guides/[slug]/meta.json
git add index.html
git commit -m "feat(guide): add [title]"
git push origin main
```

For updates, use: `git commit -m "fix(guide): update [title]"`

Show the git output and report:
```
Pushed to origin/main.
GitHub Pages deploying... (~30 seconds)

Live URL:
  https://[username].github.io/devpages/guides/[slug]/

Index:
  https://[username].github.io/devpages/
```

Rules:
- Never force push
- One commit per publish — do not bundle unrelated changes
- Never commit node_modules, .DS_Store, or other junk
