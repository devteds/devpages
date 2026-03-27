# DevGuides — Component Library

This file contains all reusable HTML+CSS patterns for DevGuides guides.
Read this file before generating any guide HTML.
Use these exact patterns — do not invent variations.

---

## 1. Command Row

The fundamental unit for cheatsheets. A keyboard shortcut or command on the left, description on the right.

### HTML
```html
<div class="cmd-row" data-tags="keyword1 keyword2 keyword3">
  <kbd class="purple">prefix d</kbd>
  <span class="cmd-desc">Detach — <em>session keeps running</em></span>
</div>
```

### CSS
```css
.cmd-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.cmd-row:last-child { border-bottom: none; }
.cmd-row.hidden { display: none; }   /* used by search */

kbd {
  font-family: var(--mono);
  font-size: 0.78rem;
  color: #fff;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-bottom: 2px solid var(--border2);
  padding: 0.15rem 0.5rem;
  border-radius: 5px;
  white-space: nowrap;
  flex-shrink: 0;
}
kbd.purple { border-color: rgba(124,106,247,0.4); border-bottom-color: var(--accent-purple); color: #c4bdff; }
kbd.green  { border-color: rgba(56,217,169,0.3);  border-bottom-color: var(--accent-green);  color: #7eecd4; }
kbd.orange { border-color: rgba(247,169,74,0.3);  border-bottom-color: var(--accent-orange); color: #fcd49a; }

.cmd-desc {
  font-size: 0.8rem;
  color: #8a90a8;
  text-align: right;
  flex: 1;
  line-height: 1.4;
}
.cmd-desc em {
  font-style: normal;
  color: var(--text);
  font-weight: 500;
}
```

### Rules
- `data-tags` must be a space-separated string of keywords used by search
- `kbd` color class matches the section color (purple/green/orange)
- Description text uses `<em>` (non-italic) for key words within the description
- Keep descriptions under 60 characters when possible
- Commands that are file paths or env vars use `kbd.orange` regardless of section color

---

## 2. Code Block

For multi-line shell scripts, config files, and workflow recipes.

### HTML
```html
<pre class="code-block">
<span class="syn-comment"># This is a comment</span>
<span class="syn-command">tmux new -s</span> myproject
<span class="syn-command">claude -w</span> feature-payments <span class="syn-comment"># worker agent</span>
<span class="syn-string">"a string value"</span>
</pre>
```

### CSS
```css
.code-block {
  background: #050709;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem 1.2rem;
  font-family: var(--mono);
  font-size: 0.78rem;
  line-height: 1.8;
  overflow-x: auto;
  margin-top: 0.5rem;
  white-space: pre;
  word-break: normal;
  overflow-wrap: normal;
}

.syn-comment { color: var(--syn-comment); }
.syn-command { color: var(--syn-command); }
.syn-flag    { color: var(--syn-flag); }
.syn-string  { color: var(--syn-string); }
.syn-text    { color: var(--syn-text); }
```

### Rules
- ALWAYS use `<pre>` not `<div>` — divs do not preserve whitespace and line breaks
- NEVER put code blocks inside a `<div class="code-block">` — always `<pre>`
- Apply syntax span classes liberally — un-highlighted code is hard to scan
- Comments (`syn-comment`) are de-emphasized intentionally — they're dark
- Commands/keywords (`syn-command`) are green — they are the hero
- Strings/values (`syn-string`) are orange
- Flags (`syn-flag`) are purple

---

## 3. Card Label

A small all-caps label above a group of cmd-rows within a card.

### HTML
```html
<div class="card-label">Create &amp; Start</div>
```

### CSS
```css
.card-label {
  font-family: var(--mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.6rem;
}
```

---

## 4. Search Input

For guides with 15+ searchable items.

### HTML
```html
<div class="search-wrap">
  <span class="search-icon">⌕</span>
  <input id="search" type="text" placeholder="Search commands..." autocomplete="off" />
  <span class="search-count" id="search-count"></span>
</div>
```

### CSS
```css
.search-wrap { position: relative; margin-bottom: 2rem; }

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 0.85rem;
  pointer-events: none;
  font-family: var(--mono);
}

#search {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 10px;
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  font-family: var(--mono);
  font-size: 0.88rem;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}
#search::placeholder { color: var(--muted); }
#search:focus { border-color: var(--accent-purple); }

.search-count {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--muted);
}
```

### JavaScript
```javascript
const searchInput = document.getElementById('search');
const countEl = document.getElementById('search-count');

function doSearch() {
  const q = searchInput.value.trim().toLowerCase();
  let total = 0;

  // Remove old highlights
  document.querySelectorAll('.highlight-match').forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });

  document.querySelectorAll('.cmd-row').forEach(row => {
    if (!q) { row.classList.remove('hidden'); total++; return; }
    const tags = (row.dataset.tags || '').toLowerCase();
    const text = row.textContent.toLowerCase();
    if (tags.includes(q) || text.includes(q)) {
      row.classList.remove('hidden');
      total++;
      highlightIn(row.querySelector('.cmd-desc'), q);
    } else {
      row.classList.add('hidden');
    }
  });

  countEl.textContent = q ? `${total} match${total !== 1 ? 'es' : ''}` : '';
}

function highlightIn(el, q) {
  if (!el || !q) return;
  const text = el.textContent;
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return;
  el.innerHTML = '';
  el.appendChild(document.createTextNode(text.slice(0, idx)));
  const span = document.createElement('span');
  span.className = 'highlight-match';
  span.textContent = text.slice(idx, idx + q.length);
  el.appendChild(span);
  el.appendChild(document.createTextNode(text.slice(idx + q.length)));
}

searchInput.addEventListener('input', doSearch);
```

### CSS for highlight
```css
.highlight-match {
  background: rgba(247,169,74,0.25);
  color: var(--accent-orange);
  border-radius: 2px;
  padding: 0 1px;
}
```

---

## 5. Filter Tabs

For guides with multiple layers or categories.

### HTML
```html
<div class="tabs">
  <button class="tab active-orange" data-filter="all">All</button>
  <button class="tab" data-filter="tmux">tmux only</button>
  <button class="tab" data-filter="claude">Claude CLI only</button>
  <button class="tab" data-filter="both">Works Together</button>
</div>
```

### CSS
```css
.tabs { display: flex; gap: 0.4rem; margin-bottom: 2rem; flex-wrap: wrap; }

.tab {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border2);
  background: var(--surface);
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.tab:hover { color: var(--text); }
.tab.active-purple { border-color: var(--accent-purple); color: var(--accent-purple); background: rgba(124,106,247,0.1); }
.tab.active-green  { border-color: var(--accent-green);  color: var(--accent-green);  background: rgba(56,217,169,0.1); }
.tab.active-orange { border-color: var(--accent-orange); color: var(--accent-orange); background: rgba(247,169,74,0.08); }
```

---

## 6. Terminal Visualization

An ASCII-art style terminal window showing multiple panes. Used for layout/architecture diagrams.

### HTML
```html
<div class="terminal-viz">
  <div class="terminal-bar">
    <div class="dot dot-r"></div>
    <div class="dot dot-y"></div>
    <div class="dot dot-g"></div>
  </div>
  <div class="term-grid">
    <div class="term-pane">
      <div class="term-label">agent-1 · feature-payments</div>
      <div class="term-line">✓ Created PaymentsController</div>
      <div class="term-active">Writing tests... <span class="term-cursor"></span></div>
    </div>
    <div class="term-pane">
      <div class="term-label">agent-2 · bugfix-auth</div>
      <div class="term-active">Applying fix... <span class="term-cursor"></span></div>
    </div>
    <div class="term-pane wide">
      <div class="term-label">agent-3 · orchestrator</div>
      <div class="term-active">Reviewing changes... <span class="term-cursor"></span></div>
    </div>
  </div>
</div>
```

### CSS
```css
.terminal-viz {
  background: #0a0c14;
  border: 1px solid #1e2235;
  border-radius: 12px;
  padding: 1.2rem;
  margin: 1rem 0;
}
.terminal-bar { display: flex; gap: 6px; margin-bottom: 1rem; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-r { background: #ff5f56; }
.dot-y { background: #ffbd2e; }
.dot-g { background: #27c93f; }

.term-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--muted);
}
.term-pane {
  background: #0f1117;
  border: 1px solid #1e2235;
  border-radius: 4px;
  padding: 0.5rem 0.6rem;
  min-height: 60px;
}
.term-pane.wide { grid-column: span 2; }
.term-label  { color: var(--accent-green); font-weight: 700; font-size: 0.7rem; margin-bottom: 0.3rem; }
.term-line   { color: #4a5178; }
.term-active { color: #a8c0ff; }
.term-cursor {
  display: inline-block;
  width: 7px; height: 12px;
  background: var(--accent-purple);
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }
```

---

## 7. Info Callout

For tips, warnings, or notes within a guide.

### HTML
```html
<!-- Tip -->
<div class="callout callout-green">
  <span class="callout-icon">💡</span>
  <span>Use <code>prefix z</code> to zoom in on one agent's pane for detailed reading.</span>
</div>

<!-- Warning -->
<div class="callout callout-orange">
  <span class="callout-icon">⚠</span>
  <span>The Agent Teams feature requires Opus model and is experimental.</span>
</div>
```

### CSS
```css
.callout {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin: 0.8rem 0;
}
.callout-green  { background: rgba(56,217,169,0.08);  border: 1px solid rgba(56,217,169,0.2);  color: #9ee8d4; }
.callout-orange { background: rgba(247,169,74,0.08);  border: 1px solid rgba(247,169,74,0.2);  color: #fcd49a; }
.callout-purple { background: rgba(124,106,247,0.08); border: 1px solid rgba(124,106,247,0.2); color: #c4bdff; }
.callout-icon   { flex-shrink: 0; font-size: 0.9rem; }
.callout code   { font-family: var(--mono); font-size: 0.8rem; }
```

---

## 8. Legend Row

For guides that use color-coded layers to distinguish content types.

### HTML
```html
<div class="legend">
  <div class="legend-item">
    <div class="legend-dot" style="background:var(--accent-purple)"></div>
    tmux shortcut
  </div>
  <div class="legend-item">
    <div class="legend-dot" style="background:var(--accent-green)"></div>
    claude cli command
  </div>
  <div class="legend-item">
    <div class="legend-dot" style="background:var(--accent-orange)"></div>
    works in both
  </div>
</div>
```

### CSS
```css
.legend {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--muted);
}
.legend-item { display: flex; align-items: center; gap: 0.4rem; }
.legend-dot  { width: 6px; height: 6px; border-radius: 50%; }
```

---

## 9. Data Table

For reference guides with structured tabular data.

### HTML
```html
<div class="data-table-wrap">
  <table class="data-table">
    <thead>
      <tr>
        <th>Agents</th>
        <th>Approach</th>
        <th>Complexity</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2–3 agents</td>
        <td>tmux panes + worktrees, manual switching</td>
        <td><span class="badge badge-green">Easy</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

### CSS
```css
.data-table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  margin: 1rem 0;
}
.data-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.data-table th {
  background: var(--surface2);
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.data-table td {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  color: #c5c9de;
  vertical-align: top;
}
.data-table tr:hover td { background: rgba(124,106,247,0.04); }

.badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-family: var(--mono);
}
.badge-green  { background: rgba(56,217,169,0.15);  color: var(--accent-green); }
.badge-orange { background: rgba(247,169,74,0.15);  color: var(--accent-orange); }
.badge-purple { background: rgba(124,106,247,0.15); color: var(--accent-purple); }
```

---

## Component Usage Rules

1. **Do not mix patterns** — use cmd-rows for commands, not code blocks, and vice versa
2. **Do not invent new components** — if none of these fit, ask the user before creating new patterns
3. **All components are responsive** — do not add fixed widths or heights that break on mobile
4. **data-tags on cmd-rows** — always include, even for guides without search, for future compatibility
5. **Code blocks are always `<pre>`** — never `<div>` — this is a hard rule
6. **Terminal visualizations** — only use when demonstrating a multi-pane layout, not as decoration
7. **Callouts** — use sparingly, max 2 per section
8. **Tables** — use `data-table-wrap` with full overflow handling, never naked `<table>` elements
