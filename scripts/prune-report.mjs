#!/usr/bin/env node
/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Remove sections from the generated report that have no results and no text.
// The report template lists every heading from the spec's outline, so a
// heading with no tests under it would otherwise render as an empty section.
// A section is kept when it has a results table or any text of its own.
// Parents are removed once all of their children have been removed.

import fs from 'node:fs';

const REPORT = new URL('../reports/index.html', import.meta.url);

// Every <section> in the HTML with the offsets of its opening and closing
// tags, found by matching nested section tags.
function sectionSpans(html) {
  const tags = /<\/?section\b[^>]*>/g;
  const stack = [];
  const spans = [];
  let m;
  while((m = tags.exec(html)) !== null) {
    if(m[0][1] === '/') {
      const open = stack.pop();
      if(open) {
        spans.push({start: open.start, innerStart: open.innerStart,
          innerEnd: m.index, end: tags.lastIndex});
      }
    } else {
      stack.push({start: m.index, innerStart: tags.lastIndex});
    }
  }
  return spans;
}

// True when the section has no table and no text other than its headings.
function isEmpty(inner) {
  if(inner.includes('<table')) {
    return false;
  }
  const text = inner
    .replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/g, ' ')
    .replace(/<a class="self-link"[^>]*>\s*<\/a>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return text.trim() === '';
}

export function pruneReport(html) {
  let out = html;
  for(;;) {
    // remove the innermost empty section first, then look again
    const spans = sectionSpans(out).sort((a, b) => b.start - a.start);
    const empty = spans.find(span =>
      isEmpty(out.slice(span.innerStart, span.innerEnd)));
    if(!empty) {
      return out;
    }
    out = out.slice(0, empty.start) + out.slice(empty.end);
  }
}

if(import.meta.url === `file://${process.argv[1]}`) {
  const html = fs.readFileSync(REPORT, 'utf8');
  const pruned = pruneReport(html);
  fs.writeFileSync(REPORT, pruned);
  const removed = (html.match(/<section\b/g) ?? []).length -
    (pruned.match(/<section\b/g) ?? []).length;
  console.log(`pruned ${removed} empty section(s) from the report`);
}
