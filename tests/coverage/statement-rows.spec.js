/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Checks that the section files have exactly one row for each REQUIRED
// statement and none for SHOULD or MAY statements. A statement with no test
// still needs a row, skipped with its reason. statementTest only defines rows
// inside each implementation's describe, so this reads the section files as
// text: it runs with no implementations configured, and it needs each row id
// written as a string literal (`rowId: '...'`).

import {describe, it} from 'mocha';
import {NORMATIVE, REQUIRED} from '../normative-statements.js';
import chai from 'chai';
import fs from 'node:fs';

const {expect} = chai;

// Fails listing every item, which chai would shorten.
function expectNone(items, message) {
  expect(items.length, `${message}\n  ${items.join('\n  ')}`).to.equal(0);
}

const sectionsDir = new URL('../sections/', import.meta.url);

// Each `rowId:` in the section files, with the file it is in.
function readRows() {
  const rows = [];
  for(const file of fs.readdirSync(sectionsDir)) {
    if(!file.endsWith('.spec.js')) {
      continue;
    }
    const text = fs.readFileSync(new URL(file, sectionsDir), 'utf8');
    for(const [, value] of text.matchAll(/\browId:\s*([^,}\n]+)/g)) {
      rows.push({file, value: value.trim()});
    }
  }
  return rows;
}

describe('Statement rows', function() {
  const rows = readRows();
  const keys = rows.map(({value}) => value.match(/^'([^']+)'$/)?.[1]);

  it('every row id is a string literal', function() {
    const others = rows.filter((_, i) => keys[i] === undefined)
      .map(({file, value}) => `${file}: rowId: ${value}`);
    expectNone(others, 'Write each rowId as a string literal:');
  });

  it('every row id is a statement key', function() {
    const unknown = keys.filter(key => key && NORMATIVE[key] === undefined);
    expectNone(unknown, 'Unknown statement keys:');
  });

  it('every REQUIRED statement has exactly one row', function() {
    const problems = REQUIRED.flatMap(key => {
      const count = keys.filter(k => k === key).length;
      return count === 1 ? [] : [`${key}: ${count} rows`];
    });
    expectNone(problems, 'Each REQUIRED statement needs one row, tested ' +
      'or skipped with its reason:');
  });

  it('no SHOULD or MAY statement has a row', function() {
    const optional = keys.filter(key =>
      key && NORMATIVE[key] !== undefined && !REQUIRED.includes(key));
    expectNone(optional, 'Rows for statements that are not REQUIRED:');
  });
});
