/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js).
//
// These statements give the form of a verifiable presentation request. In a
// VCALM workflow the request is written by whoever configures the workflow
// step (here, the suite), and the workflow service serves it, adding only the
// challenge. A check of the served request would check the suite's own
// input, so the rows are skipped. Section 3.4.3.2 tests how the service
// handles the response to such a request.

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from '../helpers.js';

const {match: implementations} = filterByTag(
  {property: 'workflows', tags: [VCALM_TAG]});

const AUTHOR = 'not tested: the statement binds the author of the ' +
  'presentation request (the workflow configuration, written here by the ' +
  'suite); the service only serves it';

const HOLDER = 'not tested: the statement binds holders';

const ROWS = [
  ['3-4-1-verifiable-presentation-request-1', AUTHOR],
  ['3-4-1-verifiable-presentation-request-2', AUTHOR],
  ['3-4-1-verifiable-presentation-request-5', AUTHOR],
  ['3-4-1-verifiable-presentation-request-6', AUTHOR],
  ['3-4-1-verifiable-presentation-request-7', AUTHOR],
  ['3-4-1-verifiable-presentation-request-8', HOLDER],
  ['3-4-1-verifiable-presentation-request-10', AUTHOR],
  ['3-4-1-verifiable-presentation-request-11', AUTHOR]
];

describe('Verifiable Presentation Request', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      for(const [rowId, skip] of ROWS) {
        statementTest({name, implementation, rowId, skip});
      }
    });
  }
});
