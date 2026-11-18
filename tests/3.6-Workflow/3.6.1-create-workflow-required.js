/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// REQUIRED fields of a create-workflow request. The sentences require the
// client to pass each field and state no server behavior for a request that
// omits one, so there is no refusal to test on the wire. Each row's cell is
// not applicable (skipped), not passed.

import * as notApplicable from '../not-applicable.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'workflows', tags: [VCALM_TAG]});

// No refusal is defined for these sentences, so there is no implementation
// negative.
const NO_REFUSAL =
  'no refusal is defined by this sentence; no implementation negative yet';

function noRefusalFor(field) {
  return [{
    name: `negative: no refusal is defined for a request without "${field}"`,
    run: async () => {
      throw new notApplicable.NotApplicable(NO_REFUSAL);
    }
  }];
}

describeNormativeStatement({
  section: '3.6.1 Create Workflow',
  match,
  columnLabel: 'Workflow',
  statements: [{
    statement: NORMATIVE['3-6-1-create-workflow-2'],
    link: `${TR}#create-workflow`,
    subtests() {
      return noRefusalFor('initialStep');
    }
  }, {
    statement: NORMATIVE['3-6-1-create-workflow-6'],
    link: `${TR}#create-workflow`,
    subtests() {
      return noRefusalFor('steps');
    }
  }]
});
