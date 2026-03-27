#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(__dirname, '..', 'guides');
const OUTPUT_FILE = path.join(__dirname, '..', 'index.html');

const REQUIRED_FIELDS = ['title', 'slug', 'description', 'tags', 'category', 'created', 'updated', 'author'];

function loadGuides() {
  const guides = [];
  const warnings = [];
  const errors = [];

  if (!fs.existsSync(GUIDES_DIR)) {
    return { guides, warnings, errors };
  }

  const entries = fs.readdirSync(GUIDES_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const metaPath = path.join(GUIDES_DIR, entry.name, 'meta.json');

    if (!fs.existsSync(metaPath)) {
      warnings.push(`Warning: guides/${entry.name}/ has no meta.json — skipping`);
      continue;
    }

    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    } catch (e) {
      errors.push(`Error: guides/${entry.name}/meta.json is not valid JSON: ${e.message}`);
      continue;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!(field in meta)) {
        errors.push(`Error: guides/${entry.name}/meta.json is missing required field: "${field}"`);
      }
    }

    if (errors.length === 0) {
      guides.push(meta);
    }
  }

  return { guides, warnings, errors };
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateIndexHtml(guides) {
  // Sort by updated date descending
  guides.sort((a, b) => b.updated.localeCompare(a.updated));

  // Get unique categories
  const categories = [...new Set(guides.map(g => g.category))].sort();

  // Get all tags
  const allTags = [...new Set(guides.flatMap(g => g.tags))].sort();

  const guideCardsHtml = guides.map(g => `
        <a class="guide-card" href="guides/${escapeHtml(g.slug)}/" data-category="${escapeHtml(g.category)}" data-tags="${escapeHtml(g.tags.join(' '))}" data-title="${escapeHtml(g.title.toLowerCase())}" data-desc="${escapeHtml(g.description.toLowerCase())}">
          <div class="guide-card-header">
            <span class="guide-category">${escapeHtml(g.category)}</span>
            <span class="guide-date">${formatDate(g.updated)}</span>
          </div>
          <h3 class="guide-title">${escapeHtml(g.title)}</h3>
          <p class="guide-description">${escapeHtml(g.description.length > 160 ? g.description.slice(0, 157) + '...' : g.description)}</p>
          <div class="guide-tags">
            ${g.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('\n            ')}
          </div>
        </a>`).join('\n');

  const categoryTabsHtml = categories.map(c =>
    `      <button class="tab" data-filter="${escapeHtml(c)}">${escapeHtml(c)}</button>`
  ).join('\n');

  const emptyStateHtml = `
        <div class="empty-state">
          <p>No guides yet.</p>
          <p>Run <code>/newguide</code> in Claude Code to create your first guide.</p>
        </div>`;

  const today = new Date().toISOString().split('T')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="DevPages — A developer knowledge publishing hub." />
  <title>DevPages</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg:        #080b10;
      --surface:   #0e1219;
      --surface2:  #141920;
      --border:    #1c2333;
      --border2:   #243040;
      --accent-purple: #7c6af7;
      --accent-green:  #38d9a9;
      --accent-orange: #f7a94a;
      --accent-red:    #f06a6a;
      --text:  #d8dde8;
      --muted: #5a6480;
      --mono:    'IBM Plex Mono', monospace;
      --sans:    'Inter', sans-serif;
      --display: 'Syne', sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--sans);
      min-height: 100vh;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px
      );
      pointer-events: none;
      z-index: 1000;
    }

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

    .wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
      position: relative;
      z-index: 1;
    }

    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 2rem;
      margin-bottom: 2.5rem;
    }

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

    .tagline {
      font-family: var(--mono);
      font-size: 0.88rem;
      color: var(--muted);
      margin-bottom: 0.5rem;
    }

    .guide-count {
      font-family: var(--mono);
      font-size: 0.72rem;
      color: var(--muted);
      letter-spacing: 0.05em;
    }

    /* Search */
    .search-wrap { position: relative; margin-bottom: 2rem; }
    .search-icon {
      position: absolute; left: 1rem; top: 50%;
      transform: translateY(-50%);
      color: var(--muted); font-size: 0.85rem;
      pointer-events: none; font-family: var(--mono);
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
      position: absolute; right: 1rem; top: 50%;
      transform: translateY(-50%);
      font-family: var(--mono); font-size: 0.7rem; color: var(--muted);
    }

    /* Tabs */
    .tabs { display: flex; gap: 0.4rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .tab {
      font-family: var(--mono);
      font-size: 0.75rem; font-weight: 600;
      letter-spacing: 0.05em;
      padding: 0.45rem 1rem; border-radius: 8px;
      border: 1px solid var(--border2);
      background: var(--surface); color: var(--muted);
      cursor: pointer; transition: all 0.15s; user-select: none;
    }
    .tab:hover { color: var(--text); }
    .tab.active {
      border-color: var(--accent-purple);
      color: var(--accent-purple);
      background: rgba(124,106,247,0.1);
    }

    /* Guide Grid */
    .guide-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }

    .guide-card {
      background: var(--surface);
      padding: 1.3rem 1.5rem;
      text-decoration: none;
      color: var(--text);
      transition: background 0.15s;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .guide-card:hover { background: var(--surface2); }
    .guide-card.hidden { display: none; }

    .guide-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .guide-category {
      font-family: var(--mono);
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--accent-purple);
    }
    .guide-date {
      font-family: var(--mono);
      font-size: 0.65rem;
      color: var(--muted);
    }

    .guide-title {
      font-family: var(--display);
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .guide-description {
      font-size: 0.85rem;
      color: var(--muted);
      line-height: 1.5;
    }

    .guide-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      margin-top: 0.3rem;
    }
    .tag {
      font-family: var(--mono);
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      background: rgba(124,106,247,0.08);
      color: var(--accent-purple);
      border: 1px solid rgba(124,106,247,0.2);
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 0.9rem;
    }
    .empty-state code {
      color: var(--accent-green);
      font-family: var(--mono);
    }

    /* Footer */
    footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
      font-family: var(--mono);
      font-size: 0.7rem;
      color: var(--muted);
    }

    @media (max-width: 600px) {
      .guide-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1><span class="purple">Dev</span><span class="green">Pages</span></h1>
      <p class="tagline">// developer knowledge, published</p>
      <p class="guide-count">${guides.length} guide${guides.length !== 1 ? 's' : ''} published</p>
    </header>

    <div class="search-wrap">
      <span class="search-icon">⌕</span>
      <input id="search" type="text" placeholder="Search guides..." autocomplete="off" />
      <span class="search-count" id="search-count"></span>
    </div>

    <div class="tabs">
      <button class="tab active" data-filter="all">All</button>
${categoryTabsHtml}
    </div>

    <div class="guide-grid" id="guide-grid">
${guides.length > 0 ? guideCardsHtml : emptyStateHtml}
    </div>

    <footer>
      Generated by Claude Code &middot; ${today}
    </footer>
  </div>

  <script>
    // Category filter
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.guide-card');
    let activeCategory = 'all';

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.dataset.filter;
        applyFilters();
      });
    });

    // Search
    const searchInput = document.getElementById('search');
    const countEl = document.getElementById('search-count');

    searchInput.addEventListener('input', applyFilters);

    function applyFilters() {
      const q = searchInput.value.trim().toLowerCase();
      let visible = 0;
      const total = cards.length;

      cards.forEach(card => {
        const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const matchesSearch = !q ||
          (card.dataset.title || '').includes(q) ||
          (card.dataset.desc || '').includes(q) ||
          (card.dataset.tags || '').includes(q);

        if (matchesCategory && matchesSearch) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (q || activeCategory !== 'all') {
        countEl.textContent = 'Showing ' + visible + ' of ' + total + ' guides';
      } else {
        countEl.textContent = '';
      }
    }
  </script>
</body>
</html>`;
}

// Main
const { guides, warnings, errors } = loadGuides();

warnings.forEach(w => console.log(w));

if (errors.length > 0) {
  errors.forEach(e => console.error(e));
  console.error('Index not written. Fix the meta.json and re-run.');
  process.exit(1);
}

const html = generateIndexHtml(guides);
fs.writeFileSync(OUTPUT_FILE, html);

const categories = [...new Set(guides.map(g => g.category))];
console.log(`Index built: ${guides.length} guides across ${categories.length} categories`);
