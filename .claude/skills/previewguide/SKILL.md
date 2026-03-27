---
name: previewguide
description: Open a guide in the browser for local preview
disable-model-invocation: true
argument-hint: "<slug>"
---

# Preview a Guide

Open `guides/$ARGUMENTS/index.html` in the default browser immediately.

## With a slug

1. Check that `guides/[slug]/index.html` exists. If not:
   ```
   No guide found at guides/[slug]/. Run /listguides to see available guides.
   ```

2. Open in browser:
   - macOS: `open guides/[slug]/index.html`
   - Linux: `xdg-open guides/[slug]/index.html`

## Without a slug (preview the index)

If no slug is provided, suggest previewing the index page:

```
To preview the index page with working links between guides:
  python3 -m http.server 8080
Then open http://localhost:8080
```
