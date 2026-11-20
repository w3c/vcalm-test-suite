/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js).

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from '../helpers.js';

// Implementations with any endpoint tagged VCALM.
const ROLE_KEYS = ['issuers', 'verifiers', 'holders', 'workflows', 'status'];
const implementations = new Map();
for(const property of ROLE_KEYS) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  for(const [name, implementation] of match) {
    implementations.set(name, implementation);
  }
}

describe('Authorization', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      // The sentence constrains the requests clients send, and states no
      // server behavior for a request that breaks it, so there is no refusal
      // to observe.
      statementTest({
        name, implementation, rowId: 'forbidden-authorization-1',
        skip: 'not tested: the statement binds the requests clients send, ' +
          'and states no server behavior to observe'
      });
    });
  }
});
