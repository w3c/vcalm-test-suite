/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {addPerTestMetadata, setupMatrix, VCALM_TAG} from './helpers.js';
import {TestEndpoints} from './TestEndpoints.js';

/**
 * Run every positive and negative check for one statement.
 * A failing check does not stop the others. The statement test fails
 * if any check fails.
 *
 * @param {Array<object>} subtests - Named checks.
 * @returns {Promise<void>} Resolves when every check has run.
 */
async function runSubtests(subtests) {
  const failures = [];
  for(const subtest of subtests) {
    try {
      await subtest.run();
    } catch(error) {
      failures.push(`${subtest.name}: ${error.message}`);
    }
  }
  if(failures.length > 0) {
    throw new Error(failures.join('\n'));
  }
}

/**
 * One interop test per normative statement.
 * The statement text is the test name. Positive and negative checks
 * are subtests of that test. The implementation name is the column.
 *
 * @param {object} options - Options.
 * @param {string} options.section - Spec section heading.
 * @param {string} [options.statement] - Normative statement text.
 * @param {string} [options.link] - Spec section URL.
 * @param {Array<object>} [options.statements] - Statements that share a
 *   section. Each item has `statement`, `link`, and `subtests`.
 * @param {Map} options.match - Tagged implementations.
 * @param {string} [options.columnLabel] - Matrix column heading.
 * @param {string} [options.tag] - Endpoint tag.
 * @param {Function} [options.subtests] - Checks for `options.statement`.
 * @param {boolean} [options.unimplemented] - Show the column as not
 *   implemented and skip every statement.
 */
export function describeNormativeStatement({
  section,
  statement,
  link,
  statements,
  match,
  columnLabel = 'Implementation',
  tag = VCALM_TAG,
  subtests,
  unimplemented = false
}) {
  const cases = statements ?? [{statement, link, subtests}];
  const matrix = match instanceof Map ? match : new Map(match);
  describe(section, function() {
    setupMatrix.call(this, matrix, columnLabel);
    if(unimplemented) {
      this.notImplemented = this.implemented;
      this.implemented = [];
    }
    for(const [name, implementation] of matrix) {
      const endpoints = new TestEndpoints({implementation, tag});
      describe(name, function() {
        beforeEach(addPerTestMetadata);
        for(const item of cases) {
          const skipped = unimplemented || item.skip;
          const run = skipped ? function() {
            this.test.link = item.link;
            this.test.cell.skipMessage = item.skipMessage ||
              'Not implemented.';
            this.skip();
          } : async function() {
            this.test.link = item.link;
            const checks = item.subtests({
              name,
              endpoints,
              implementation,
              link: item.link
            });
            await runSubtests(checks);
          };
          it(item.statement, run);
        }
      });
    }
  });
}
