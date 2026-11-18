/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Checks an issued credential against the overlay constraints in ../overlay.js.
// The rules are in the OpenAPI description, not in a normative statement, so
// they are checked as part of the issuer's interface conformance.

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {findNonStringItems} from '../overlay.js';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'issuers', tags: [VCALM_TAG]});

// Issue a credential and check that every item of `field` is a string.
function itemsAreStrings(endpoints, field) {
  return {
    name: `positive: issued credential "${field}" items are strings`,
    run: async () => {
      const issuedVc = await endpoints.issue();
      const problems = findNonStringItems(issuedVc, field);
      if(problems.length > 0) {
        throw new Error(problems.join('; '));
      }
    }
  };
}

describeNormativeStatement({
  section: 'Conformance',
  match,
  columnLabel: 'Issuer',
  statements: [{
    statement: NORMATIVE['1-3-conformance-1'],
    link: `${TR}#conformance`,
    subtests({endpoints}) {
      return [
        itemsAreStrings(endpoints, '@context'),
        itemsAreStrings(endpoints, 'type')
      ];
    }
  }]
});
