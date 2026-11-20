/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// The statement matrix for the files in tests/sections/: one test per
// statement and implementation, with labelled checks. This follows the
// Recognized Entities suite. It is a separate module from helpers.js because
// TestEndpoints.js imports helpers.js.

import {it} from 'mocha';
import {LINK} from './normative-links.js';
import {NORMATIVE} from './normative-statements.js';
import {TestEndpoints} from './TestEndpoints.js';
import {VCALM_TAG} from './helpers.js';

// The implementation config key for each TestEndpoints role.
const ROLE_KEYS = {
  issuer: 'issuers',
  verifier: 'verifiers',
  holder: 'holders',
  workflow: 'workflows',
  status: 'status'
};

/**
 * Thrown by a check whose condition the response does not let the suite
 * observe. The cell is then skipped with the reason, not passed.
 */
export class NotApplicable extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotApplicable';
  }
}

/**
 * Marks a section describe as a report matrix, with one column per
 * implementation. Call it as `setupStatementMatrix({suite: this, names})`.
 *
 * @param {object} options - Options.
 * @param {object} options.suite - The mocha suite (`this` in describe).
 * @param {Array<string>} options.names - Implementation names.
 */
export function setupStatementMatrix({suite, names} = {}) {
  suite.report = true;
  suite.matrix = true;
  suite.implemented = [...names];
  suite.notImplemented = [];
  suite.rowLabel = 'Normative statement';
  suite.columnLabel = 'Implementation';
}

/**
 * Records a row's statement text for the report. At-risk rows lose their
 * cells, so the report reads their text from this registry.
 *
 * @param {object} options - Options.
 * @param {string} options.rowId - The statement key.
 */
export function recordRow({rowId} = {}) {
  globalThis.interopRowText ??= {};
  globalThis.interopRowText[rowId] = NORMATIVE[rowId];
}

/**
 * One test for one statement and one implementation. It fills the report
 * cell and runs `checks({endpoints, accepts, refuses, responds})`. Each of
 * those takes a label and a function that makes a request and asserts on the
 * response:
 *
 * - `accepts`: the implementation does what the statement requires.
 * - `refuses`: the implementation refuses input that breaks the statement.
 * - `responds`: the implementation's own response has the form the
 *   statement requires. Use it only for statements about the
 *   implementation's output, which have no input to refuse.
 *
 * A failed check is recorded under its label and the next one runs, so the
 * test fails once, listing every failed check. A test needs at least one
 * `accepts` and one `refuses`, or at least one `responds`. A check that
 * throws NotApplicable makes the cell skipped, unless another check failed.
 *
 * @param {object} options - Options.
 * @param {string} options.name - Implementation name (the column).
 * @param {object} options.implementation - The implementation.
 * @param {string} options.rowId - The statement key.
 * @param {string} [options.role] - TestEndpoints role the statement binds;
 *   without it the cell is skipped.
 * @param {string} [options.skip] - Reason the row has no test yet. The cell
 *   is skipped with this reason.
 * @param {Function} [checks] - The checks.
 */
export function statementTest({
  name, implementation, rowId, role, skip
} = {}, checks) {
  if(NORMATIVE[rowId] === undefined) {
    throw new Error(`No normative statement "${rowId}".`);
  }
  recordRow({rowId});
  it(NORMATIVE[rowId], async function() {
    this.test.cell = {columnId: name, rowId, statement: NORMATIVE[rowId]};
    this.test.link = LINK[rowId];
    const endpoints = new TestEndpoints({implementation, tag: VCALM_TAG});
    const reason = skip ?? (role && !endpoints[role] ?
      `no ${ROLE_KEYS[role]} entry tagged ${VCALM_TAG}` : undefined);
    if(reason) {
      this.test.cell.skipMessage = reason;
      this.skip();
    }
    const failures = [];
    const notApplicable = [];
    const used = {accepts: 0, refuses: 0, responds: 0};
    const check = kind => async (label, run) => {
      used[kind]++;
      try {
        await run();
      } catch(error) {
        (error instanceof NotApplicable ? notApplicable : failures)
          .push(`${label}: ${error.message}`);
      }
    };
    await checks({
      endpoints,
      accepts: check('accepts'),
      refuses: check('refuses'),
      responds: check('responds')
    });
    if(used.responds === 0 && (used.accepts === 0 || used.refuses === 0)) {
      failures.push('suite error: the test needs an accepts and a refuses ' +
        'check, or a responds check');
    }
    if(failures.length > 0) {
      throw new Error(failures.join('\n'));
    }
    if(notApplicable.length > 0) {
      this.test.cell.skipMessage = notApplicable.join('; ');
      this.skip();
    }
  });
}
