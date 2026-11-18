/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Results matrix rows for every MUST and REQUIRED statement in the spec that
// no other test file has a row for. Rows are recorded by
// describeNormativeStatement (see ../coverage-registry.js), so there is no
// list to maintain here.

import {NORMATIVE, REQUIRED, SECTION} from '../normative-statements.js';
import {covered} from '../coverage-registry.js';
import {describeNormativeStatement} from '../statement-suite.js';
import fs from 'node:fs';
import {TR} from '../skipped-section.js';

// Load every test module before reading `covered`. Mocha loads this file
// in an unspecified order, and imports are cached, so each module still runs
// once. Only files in subfolders are test modules, matching the mocha glob
// `tests/*/**/*.js`. This folder is skipped.
const testsDir = new URL('..', import.meta.url);
const testFiles = fs.readdirSync(testsDir, {recursive: true})
  .filter(file => file.endsWith('.js') && file.includes('/') &&
    !file.startsWith('Coverage/'));
for(const file of testFiles) {
  await import(new URL(file, testsDir).href);
}

const bySection = new Map();
for(const key of REQUIRED) {
  if(covered.has(key)) {
    continue;
  }
  if(!bySection.has(SECTION[key])) {
    bySection.set(SECTION[key], []);
  }
  bySection.get(SECTION[key]).push(NORMATIVE[key]);
}
// Uncovered statements get one skipped row, under a single placeholder
// column for an implementation that does not exist, so no implementation
// appears to have tested them.
const NOT_IMPLEMENTED = new Map([['Not implemented', {}]]);
for(const [section, statements] of bySection) {
  describeNormativeStatement({
    section,
    match: NOT_IMPLEMENTED,
    columnLabel: 'Implementation',
    statements: statements.map(statement => ({
      statement,
      link: `${TR}#conformance`,
      skip: true,
      skipMessage: 'Not implemented.'
    }))
  });
}
