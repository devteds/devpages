---
name: listguides
description: List all guides with slug, title, status (published/draft), and updated date
disable-model-invocation: true
---

# List All Guides

Scan the `guides/` directory and display a table of all guides.

## Steps

1. **Scan guides/** — Find all subdirectories that contain a `meta.json` file.

2. **Load metadata** — Read each `meta.json` and extract: slug, title, category, updated date.

3. **Determine status** — Check git status for each guide:
   - `published` — if the guide files are committed and pushed
   - `draft` — if the guide files are not yet committed

4. **Display table** — Show in this format, sorted by updated date (newest first):

```
Slug                     Title                              Status     Updated
──────────────────────────────────────────────────────────────────────────────
tmux-claude-cli          tmux × Claude CLI Cheatsheet       published  2026-03-27
docker-compose-basics    Docker Compose Basics              draft      2026-03-28
```

5. **Handle empty state** — If no guides exist:
```
No guides found. Run /newguide to create your first guide.
```

6. **Handle errors** — If any meta.json is missing or has invalid JSON, note the issue in the output but continue listing the rest.
