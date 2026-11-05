#!/usr/bin/env python3
"""Scrape RFC 2119 statements from the published VCALM TR via BeautifulSoup.

Fetches https://www.w3.org/TR/vcalm-1.0/ (pre-rendered Respec) and extracts
every ``.rfc2119`` keyword plus its enclosing statement and section heading.

Writes:
  docs/normative-statements.json
  docs/normative-statements.md
  docs/normative-statements.html  (overview + side-by-side spec pane)

Usage:
  python3 docs/scripts/scrape_normative.py
  python3 docs/scripts/scrape_normative.py --url https://www.w3.org/TR/vcalm-1.0/
"""
from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

from bs4 import BeautifulSoup, Comment

DEFAULT_URL = 'https://www.w3.org/TR/vcalm-1.0/'
DOCS = Path(__file__).resolve().parent.parent
USER_AGENT = 'vcalm-test-suite-normative-scraper/1.0 (+https://github.com/w3c/vcalm-test-suite)'

KW_ORDER = (
    'MUST NOT', 'MUST', 'SHOULD NOT', 'SHOULD',
    'REQUIRED', 'RECOMMENDED', 'MAY NOT', 'MAY', 'OPTIONAL',
)
KW_COLORS = {
    'MUST': '#c62828',
    'MUST NOT': '#ad1457',
    'REQUIRED': '#e65100',
    'SHOULD': '#f9a825',
    'SHOULD NOT': '#f57f17',
    'RECOMMENDED': '#2e7d32',
    'MAY': '#1565c0',
    'MAY NOT': '#4527a0',
    'OPTIONAL': '#00838f',
}
BOILERPLATE_RE = re.compile(r'key words.+bcp\s*14', re.I)


def fetch(url: str) -> tuple[str, str]:
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode('utf-8', 'replace'), resp.geturl()


def clean(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()


def section_for(el) -> dict:
    heading = ''
    section_id = ''
    for h in el.find_all_previous(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], limit=1):
        heading = clean(h.get_text(' ', strip=True))
        parent = h.find_parent(['section', 'div'], id=True)
        if parent and parent.get('id'):
            section_id = parent['id']
        elif h.get('id'):
            section_id = h['id']
        break
    if not section_id:
        parent = el.find_parent(['section', 'div'], id=True)
        if parent and parent.get('id'):
            section_id = parent['id']
    return {'section': heading, 'section_id': section_id}


def block_for(em):
    return em.find_parent(
        ['p', 'li', 'td', 'th', 'dd', 'dt', 'blockquote']
    ) or em.parent


def scrape(html: str, source: str) -> tuple[list[dict], BeautifulSoup]:
    """Return statements and the annotated soup (each .rfc2119 gets data-hit)."""
    soup = BeautifulSoup(html, 'lxml')
    rows: list[dict] = []
    seen: set[tuple[str, str]] = set()
    hit = 0

    for em in soup.select('.rfc2119'):
        keyword = em.get_text(strip=True)
        block = block_for(em)
        statement = clean(
            block.get_text(' ', strip=True) if block else em.get_text(' ', strip=True)
        )
        if not statement:
            continue
        key = (keyword, statement)
        if key in seen:
            continue
        seen.add(key)
        hit += 1
        hit_id = f'hit-{hit}'
        em['data-hit'] = hit_id
        em['id'] = hit_id
        meta = section_for(em)
        rows.append({
            'id': hit_id,
            'keyword': keyword,
            'section': meta['section'],
            'section_id': meta['section_id'],
            'statement': statement,
            'boilerplate': bool(BOILERPLATE_RE.search(statement)),
            'source': source,
        })
    return rows, soup


def prepare_spec_embed(soup: BeautifulSoup, source: str) -> str:
    """Strip scripts/chrome; keep body content for the side-by-side pane."""
    for tag in soup.find_all(['script', 'noscript']):
        tag.decompose()
    for comment in soup.find_all(string=lambda t: isinstance(t, Comment)):
        comment.extract()

    # Drop Respec UI / toc sidebars that fight the split layout
    for sel in (
        '#toc-nav', '#toc', 'nav#toc', '.toc-sidebar',
        '#sticky-toc', 'button', 'input', 'select', 'textarea',
    ):
        for el in soup.select(sel):
            # Keep in-document ToC lists that are part of content? Prefer remove nav chrome only.
            if el.name == 'button' or el.get('id') in {
                'toc-nav', 'sticky-toc',
            } or 'toc' in (el.get('class') or []):
                el.decompose()

    body = soup.body
    if body is None:
        return '<p>Could not embed TR body.</p>'

    # Make fragment links absolute to the published TR for "open original"
    for a in body.find_all('a', href=True):
        href = a['href']
        if href.startswith('#'):
            a['data-tr-hash'] = href
            # keep hash for in-pane navigation
        elif href.startswith('/'):
            a['href'] = 'https://www.w3.org' + href
            a['target'] = '_blank'
            a['rel'] = 'noopener'
        elif href.startswith('http'):
            a['target'] = '_blank'
            a['rel'] = 'noopener'

    # Images / links that are relative
    for img in body.find_all('img', src=True):
        src = img['src']
        if src.startswith('/'):
            img['src'] = 'https://www.w3.org' + src
        elif not src.startswith('http') and not src.startswith('data:'):
            img['src'] = source.rstrip('/') + '/' + src

    return body.decode_contents()


def write_json(path: Path, source: str, rows: list[dict]) -> None:
    counts = Counter(r['keyword'] for r in rows)
    payload = {
        'source': source,
        'count': len(rows),
        'keyword_counts': dict(sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))),
        'statements': rows,
    }
    path.write_text(json.dumps(payload, indent=2) + '\n', encoding='utf-8')


def write_markdown(path: Path, source: str, rows: list[dict]) -> None:
    listed = [r for r in rows if not r['boilerplate']]
    counts = Counter(r['keyword'] for r in listed)
    lines = [
        '# VCALM — Normative statements',
        '',
        f'**Source:** {source}',
        '**Method:** BeautifulSoup `select(".rfc2119")` on the published TR.',
        f'**Count:** {len(listed)} statements'
        f' ({len(rows) - len(listed)} RFC 2119 boilerplate hits omitted below)',
        '',
        '## Keyword summary',
        '',
        '| Keyword | Count |',
        '|---------|------:|',
    ]
    for kw in KW_ORDER:
        if counts.get(kw):
            lines.append(f'| {kw} | {counts[kw]} |')
    lines += ['', '## Statements', '']

    by_sec: dict[str, list[dict]] = defaultdict(list)
    for r in listed:
        by_sec[r['section'] or '(no section)'].append(r)

    for sec, items in by_sec.items():
        lines.append(f'### {sec}')
        lines.append('')
        for i, r in enumerate(items, 1):
            lines.append(f'{i}. **[{r["keyword"]}]** {r["statement"]}')
        lines.append('')

    path.write_text('\n'.join(lines), encoding='utf-8')


def write_html(
    path: Path,
    source: str,
    rows: list[dict],
    spec_embed: str,
) -> None:
    listed = [r for r in rows if not r['boilerplate']]
    boilerplate_n = len(rows) - len(listed)
    by_sec: dict[str, list[dict]] = defaultdict(list)
    for r in listed:
        by_sec[r['section'] or '(no section)'].append(r)

    # Preserve document order for the statement list (better for side-by-side)
    section_order: list[str] = []
    for r in listed:
        sec = r['section'] or '(no section)'
        if sec not in section_order:
            section_order.append(sec)

    section_totals = {s: len(by_sec[s]) for s in section_order}
    real_kw = Counter(r['keyword'] for r in listed)

    def esc(s: str) -> str:
        return html_lib.escape(s)

    def slug(sec: str) -> str:
        return re.sub(r'[^a-zA-Z0-9_-]+', '-', sec).strip('-')

    stmt_blocks = []
    for sec in section_order:
        items = by_sec[sec]
        section_id = items[0].get('section_id') or ''
        cards = []
        for r in items:
            color = KW_COLORS.get(r['keyword'], '#555')
            tr_link = f'{esc(source)}#{esc(r["section_id"])}' if r.get('section_id') else esc(source)
            cards.append(
                f'<button type="button" class="stmt" data-hit="{esc(r["id"])}" '
                f'data-kw="{esc(r["keyword"])}" data-section-id="{esc(section_id)}" '
                f'data-section="{esc(sec)}">'
                f'<span class="kw" style="background:{color}">{esc(r["keyword"])}</span>'
                f'<span class="text">{esc(r["statement"])}</span>'
                f'<a class="ext" href="{tr_link}" target="_blank" rel="noopener" '
                f'title="Open in TR" onclick="event.stopPropagation()">↗</a>'
                f'</button>'
            )
        stmt_blocks.append(
            f'<div class="stmt-sec" data-section="{esc(sec)}" '
            f'data-section-id="{esc(section_id)}" id="list-{esc(slug(sec))}">'
            f'<h3>{esc(sec)} <span class="count">{len(items)}</span></h3>'
            f'{"".join(cards)}</div>'
        )

    toc = ''.join(
        f'<a href="#list-{esc(slug(sec))}" data-section-id="'
        f'{esc(by_sec[sec][0].get("section_id") or "")}" data-jump-sec="{esc(sec)}">'
        f'{esc(sec)} <span>{section_totals[sec]}</span></a>'
        for sec in section_order
    )

    chips = ''.join(
        f'<button type="button" class="chip" data-filter="{esc(k)}" '
        f'style="--chip:{KW_COLORS.get(k, "#555")}">{esc(k)} '
        f'<span>{real_kw[k]}</span></button>'
        for k in KW_ORDER if real_kw.get(k)
    )

    # Section bar chart in document order
    chart_payload = {
        'source': source,
        'listed': len(listed),
        'boilerplate': boilerplate_n,
        'kw_order': [k for k in KW_ORDER if real_kw.get(k)],
        'kw_values': [real_kw[k] for k in KW_ORDER if real_kw.get(k)],
        'kw_colors': [KW_COLORS.get(k, '#555') for k in KW_ORDER if real_kw.get(k)],
        'section_labels': section_order,
        'section_totals': [section_totals[s] for s in section_order],
    }

    must_n = real_kw.get('MUST', 0) + real_kw.get('MUST NOT', 0)
    req_n = real_kw.get('REQUIRED', 0) + real_kw.get('RECOMMENDED', 0)
    should_n = real_kw.get('SHOULD', 0) + real_kw.get('SHOULD NOT', 0)
    may_n = real_kw.get('MAY', 0) + real_kw.get('OPTIONAL', 0)

    doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VCALM Normative Statements</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
:root {{
  --bg: #f4f1ea; --ink: #1a1a1a; --muted: #5a5a5a; --card: #fff;
  --line: #d9d2c5; --accent: #0b3d5c; --pane: #faf9f6;
  --hit: #ffe082;
}}
* {{ box-sizing: border-box; }}
html, body {{ height: 100%; }}
body {{
  margin: 0; font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  background: var(--bg); color: var(--ink); line-height: 1.45;
  display: flex; flex-direction: column; min-height: 100vh;
}}
a {{ color: #0b57a0; }}
.overview {{
  flex: 0 0 auto;
  background: linear-gradient(135deg, #0b3d5c 0%, #1a6b8a 55%, #2a8f7c 100%);
  color: #fff; padding: 1.25rem 1.25rem 1rem;
}}
.overview h1 {{ margin: 0 0 .25rem; font-size: 1.45rem; font-weight: 650; }}
.overview .sub {{ margin: 0; opacity: .9; font-size: .92rem; max-width: 70rem; }}
.overview a {{ color: #c8e7ff; }}
.overview-body {{
  max-width: 1400px; margin: .85rem auto 0; padding: 0 .25rem;
}}
.metrics {{
  display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: .55rem;
}}
@media (max-width: 1100px) {{
  .metrics {{ grid-template-columns: repeat(3, minmax(0, 1fr)); }}
}}
@media (max-width: 640px) {{
  .metrics {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
}}
.metric {{
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.22);
  border-radius: 10px; padding: .65rem .75rem;
}}
.metric .n {{ font-size: 1.35rem; font-weight: 700; }}
.metric .l {{ font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; opacity: .85; }}
.charts {{
  display: grid; grid-template-columns: 280px 1fr; gap: .75rem; margin-top: .75rem;
}}
@media (max-width: 900px) {{ .charts {{ grid-template-columns: 1fr; }} }}
.chart-card {{
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
  border-radius: 10px; padding: .65rem .75rem;
}}
.chart-card h2 {{ margin: 0 0 .4rem; font-size: .85rem; font-weight: 600; opacity: .95; }}
.toolbar {{
  display: flex; flex-wrap: wrap; gap: .35rem; align-items: center;
  margin-top: .75rem;
}}
.chip {{
  border: 1px solid rgba(255,255,255,.35);
  background: rgba(255,255,255,.12); color: #fff; border-radius: 999px;
  padding: .3rem .65rem; cursor: pointer; font: inherit; font-size: .8rem;
}}
.chip span {{ font-weight: 700; margin-left: .2rem; }}
.chip.active, .chip:hover {{ background: #fff; color: #0b3d5c; }}
.chip[data-filter="ALL"].active {{ background: #fff; color: #0b3d5c; }}
.split {{
  flex: 1 1 auto; min-height: 0;
  display: grid; grid-template-columns: minmax(320px, 42%) 1fr;
  gap: 0; border-top: 1px solid var(--line);
  max-width: 1600px; width: 100%; margin: 0 auto;
}}
@media (max-width: 900px) {{
  .split {{ grid-template-columns: 1fr; grid-template-rows: 45vh 55vh; }}
}}
.pane {{
  min-height: 0; overflow: auto; background: var(--card);
}}
.pane-head {{
  position: sticky; top: 0; z-index: 3;
  background: #fff; border-bottom: 1px solid var(--line);
  padding: .55rem .85rem; display: flex; justify-content: space-between;
  align-items: center; gap: .5rem;
}}
.pane-head h2 {{ margin: 0; font-size: .95rem; }}
.pane-head .hint {{ font-size: .78rem; color: var(--muted); }}
.left {{ border-right: 1px solid var(--line); background: var(--pane); }}
.toc {{
  display: flex; flex-wrap: wrap; gap: .3rem; padding: .55rem .75rem;
  border-bottom: 1px solid var(--line); background: #fff;
}}
.toc a {{
  text-decoration: none; color: var(--ink); font-size: .72rem;
  background: #eef2f4; border-radius: 999px; padding: .2rem .5rem;
}}
.toc a span {{ color: var(--muted); margin-left: .15rem; }}
.toc a.active {{ background: var(--accent); color: #fff; }}
.toc a.active span {{ color: #cfe3ef; }}
.stmt-sec {{ padding: .65rem .75rem .85rem; border-bottom: 1px solid var(--line); }}
.stmt-sec h3 {{
  margin: 0 0 .45rem; font-size: .88rem; position: sticky; top: 42px;
  background: var(--pane); padding: .25rem 0; z-index: 2;
}}
.stmt-sec h3 .count {{
  font-size: .72rem; color: var(--muted); background: #e8e4da;
  border-radius: 999px; padding: .05rem .4rem;
}}
.stmt {{
  display: grid; grid-template-columns: auto 1fr auto; gap: .45rem;
  align-items: start; width: 100%; text-align: left;
  border: 1px solid var(--line); background: #fff; border-radius: 8px;
  padding: .5rem .55rem; margin: 0 0 .4rem; cursor: pointer; font: inherit;
}}
.stmt:hover {{ border-color: #9bb8c9; }}
.stmt.active {{
  border-color: var(--accent); box-shadow: 0 0 0 2px rgba(11,61,92,.18);
  background: #f0f7fb;
}}
.stmt.hidden {{ display: none; }}
.kw {{
  display: inline-block; color: #fff; font-size: .68rem; font-weight: 700;
  letter-spacing: .03em; padding: .12rem .35rem; border-radius: 4px;
  margin-top: .1rem;
}}
.stmt .text {{ font-size: .84rem; color: #222; }}
.stmt .ext {{
  text-decoration: none; color: var(--muted); font-size: .85rem; padding: .1rem .2rem;
}}
.stmt .ext:hover {{ color: var(--accent); }}
.right {{ background: #fff; }}
#spec {{
  padding: 1rem 1.25rem 3rem; font-family: "Source Serif 4", "Georgia", serif;
  font-size: .95rem; max-width: 52rem;
}}
#spec .rfc2119 {{
  font-weight: 700; font-style: normal; font-family: "IBM Plex Sans", sans-serif;
  font-size: .78em; padding: 0 .2rem; border-radius: 3px;
  background: #e3f2fd; color: #0d47a1;
}}
#spec .rfc2119[data-hit].flash,
#spec .rfc2119.active-hit {{
  background: var(--hit); color: #3e2723; outline: 2px solid #f9a825;
}}
#spec h1, #spec h2, #spec h3, #spec h4, #spec h5, #spec h6 {{
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  scroll-margin-top: 3rem;
}}
#spec table {{ border-collapse: collapse; width: 100%; font-size: .85rem; }}
#spec th, #spec td {{ border: 1px solid #ccc; padding: .35rem .45rem; vertical-align: top; }}
#spec img {{ max-width: 100%; height: auto; }}
#spec .issue-marker, #spec .advisement, #spec aside.note {{
  border-left: 3px solid #bbb; padding-left: .6rem; color: #444;
}}
footer.meta {{
  flex: 0 0 auto; font-size: .78rem; color: var(--muted);
  padding: .4rem 1rem; border-top: 1px solid var(--line); background: #fff;
}}
</style>
</head>
<body>
<header class="overview">
  <h1>VCALM normative statements</h1>
  <p class="sub">Overview from <a href="{esc(source)}" target="_blank" rel="noopener">{esc(source)}</a>
    · BeautifulSoup <code>.rfc2119</code> · click a statement to scroll the embedded spec
    ({boilerplate_n} keyword-definition hits omitted).</p>
  <div class="overview-body">
    <div class="metrics">
      <div class="metric"><div class="n">{len(listed)}</div><div class="l">Statements</div></div>
      <div class="metric"><div class="n">{len(section_order)}</div><div class="l">Sections</div></div>
      <div class="metric"><div class="n">{must_n}</div><div class="l">MUST*</div></div>
      <div class="metric"><div class="n">{req_n}</div><div class="l">REQUIRED / RECOMMENDED</div></div>
      <div class="metric"><div class="n">{should_n}</div><div class="l">SHOULD*</div></div>
      <div class="metric"><div class="n">{may_n}</div><div class="l">MAY / OPTIONAL</div></div>
    </div>
    <div class="charts">
      <div class="chart-card"><h2>By keyword</h2><canvas id="kwChart" height="180"></canvas></div>
      <div class="chart-card"><h2>By section (document order)</h2><canvas id="secChart" height="180"></canvas></div>
    </div>
    <div class="toolbar" id="filters">
      <button type="button" class="chip active" data-filter="ALL">ALL <span>{len(listed)}</span></button>
      {chips}
    </div>
  </div>
</header>

<div class="split">
  <section class="pane left" aria-label="Statement list">
    <div class="pane-head">
      <h2>Statements</h2>
      <span class="hint">Click to locate in the spec →</span>
    </div>
    <nav class="toc" aria-label="Sections">{toc}</nav>
    <div id="statements">{''.join(stmt_blocks)}</div>
  </section>
  <section class="pane right" id="spec-pane" aria-label="Specification">
    <div class="pane-head">
      <h2>Specification</h2>
      <span class="hint"><a href="{esc(source)}" target="_blank" rel="noopener">Open TR ↗</a></span>
    </div>
    <div id="spec">{spec_embed}</div>
  </section>
</div>
<footer class="meta">
  Generated by <code>docs/scripts/scrape_normative.py</code> ·
  <code>docs/normative-statements.json</code> · raw hits {len(rows)}
</footer>

<script>
const DATA = {json.dumps(chart_payload)};
const specPane = document.getElementById('spec-pane');
const specRoot = document.getElementById('spec');

new Chart(document.getElementById('kwChart'), {{
  type: 'doughnut',
  data: {{
    labels: DATA.kw_order,
    datasets: [{{ data: DATA.kw_values, backgroundColor: DATA.kw_colors }}]
  }},
  options: {{
    plugins: {{ legend: {{ position: 'bottom', labels: {{ color: '#fff', boxWidth: 12 }} }} }}
  }}
}});
new Chart(document.getElementById('secChart'), {{
  type: 'bar',
  data: {{
    labels: DATA.section_labels,
    datasets: [{{ data: DATA.section_totals, backgroundColor: 'rgba(255,255,255,.85)' }}]
  }},
  options: {{
    indexAxis: 'y',
    plugins: {{ legend: {{ display: false }} }},
    scales: {{
      x: {{ beginAtZero: true, ticks: {{ color: '#e8f1f6', precision: 0 }}, grid: {{ color: 'rgba(255,255,255,.15)' }} }},
      y: {{ ticks: {{ color: '#e8f1f6', font: {{ size: 10 }} }}, grid: {{ display: false }} }}
    }}
  }}
}});

function clearActive() {{
  document.querySelectorAll('.stmt.active').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#spec .rfc2119.active-hit').forEach(el => el.classList.remove('active-hit'));
  document.querySelectorAll('.toc a.active').forEach(el => el.classList.remove('active'));
}}

function scrollSpecTo(hitId, sectionId) {{
  let target = hitId ? specRoot.querySelector('[data-hit="' + hitId + '"]') : null;
  if (!target && sectionId) target = specRoot.querySelector('#' + CSS.escape(sectionId));
  if (!target) return;
  clearActive();
  if (target.classList && target.classList.contains('rfc2119')) {{
    target.classList.add('active-hit', 'flash');
    setTimeout(() => target.classList.remove('flash'), 1200);
  }}
  const top = target.getBoundingClientRect().top - specPane.getBoundingClientRect().top + specPane.scrollTop - 56;
  specPane.scrollTo({{ top, behavior: 'smooth' }});
}}

document.querySelectorAll('.stmt').forEach(btn => {{
  btn.addEventListener('click', () => {{
    clearActive();
    btn.classList.add('active');
    const sec = btn.dataset.section;
    document.querySelectorAll('.toc a').forEach(a => {{
      if (a.dataset.jumpSec === sec) a.classList.add('active');
    }});
    scrollSpecTo(btn.dataset.hit, btn.dataset.sectionId);
  }});
}});

document.querySelectorAll('.toc a').forEach(a => {{
  a.addEventListener('click', ev => {{
    ev.preventDefault();
    const sec = a.dataset.jumpSec;
    const list = document.getElementById('list-' + sec.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, ''));
    // fallback: query by data-section
    const block = document.querySelector('.stmt-sec[data-section="' + CSS.escape(sec) + '"]');
    (block || list)?.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
    scrollSpecTo(null, a.dataset.sectionId);
    clearActive();
    a.classList.add('active');
  }});
}});

document.querySelectorAll('.chip').forEach(chip => {{
  chip.addEventListener('click', () => {{
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    document.querySelectorAll('.stmt').forEach(btn => {{
      btn.classList.toggle('hidden', f !== 'ALL' && btn.dataset.kw !== f);
    }});
    document.querySelectorAll('.stmt-sec').forEach(sec => {{
      sec.style.display = sec.querySelectorAll('.stmt:not(.hidden)').length ? '' : 'none';
    }});
  }});
}});

// While scrolling the spec, highlight the nearest left-hand section
const hitToSection = new Map();
document.querySelectorAll('.stmt').forEach(btn => {{
  hitToSection.set(btn.dataset.hit, btn.dataset.section);
}});
let syncTimer = null;
specPane.addEventListener('scroll', () => {{
  if (syncTimer) return;
  syncTimer = setTimeout(() => {{
    syncTimer = null;
    const hits = [...specRoot.querySelectorAll('.rfc2119[data-hit]')];
    const paneTop = specPane.getBoundingClientRect().top + 80;
    let current = null;
    for (const h of hits) {{
      if (h.getBoundingClientRect().top <= paneTop) current = h;
      else break;
    }}
    if (!current) return;
    const sec = hitToSection.get(current.getAttribute('data-hit'));
    if (!sec) return;
    document.querySelectorAll('.toc a').forEach(a => {{
      a.classList.toggle('active', a.dataset.jumpSec === sec);
    }});
  }}, 80);
}}, {{ passive: true }});
</script>
</body>
</html>
'''
    path.write_text(doc, encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default=DEFAULT_URL, help='Published TR URL')
    parser.add_argument(
        '--out-dir', type=Path, default=DOCS,
        help='Output directory (default: docs/)',
    )
    args = parser.parse_args()

    html, final_url = fetch(args.url)
    rows, soup = scrape(html, final_url)
    if not rows:
        raise SystemExit(
            f'No .rfc2119 elements found at {final_url}. '
            'Use a pre-rendered TR page, not the Respec editor-draft source.'
        )

    spec_embed = prepare_spec_embed(soup, final_url)

    out = args.out_dir
    out.mkdir(parents=True, exist_ok=True)
    write_json(out / 'normative-statements.json', final_url, rows)
    write_markdown(out / 'normative-statements.md', final_url, rows)
    write_html(out / 'normative-statements.html', final_url, rows, spec_embed)

    listed = sum(1 for r in rows if not r['boilerplate'])
    html_size = (out / 'normative-statements.html').stat().st_size
    print(f'Source: {final_url}')
    print(
        f'Wrote {len(rows)} hits ({listed} listed) → '
        f'{out}/normative-statements.{{json,md,html}} ({html_size:,} bytes)'
    )


if __name__ == '__main__':
    main()
