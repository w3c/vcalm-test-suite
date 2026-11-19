/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js).

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from '../helpers.js';

const {match: implementations} = filterByTag(
  {property: 'workflows', tags: [VCALM_TAG]});

describe('Create Workflow', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      // Whether a `result` value names a variable is only known when an
      // exchange has variables, so a value that breaks the rule cannot be
      // refused when the workflow is created. Testing it needs an exchange
      // that runs an issue request.
      statementTest({
        name, implementation, rowId: '3-6-1-create-workflow-2',
        skip: 'not tested yet: needs an exchange that runs an issue request'
      });
    });
  }
});
