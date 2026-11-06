/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Checks an issued credential against the overlay constraints in ../overlay.js.
// These rules are not in the OpenAPI schema, so they are checked here.

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {findNonStringItems} from '../overlay.js';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'issuers', tags: [VCALM_TAG]});

describeNormativeStatement({
  section: '3.2.1 Issue Credential',
  match,
  columnLabel: 'Issuer',
  statements: [{
    statement: NORMATIVE['3-2-1-issue-credential-1'],
    link: `${TR}#issue-credential`,
    subtests({endpoints}) {
      return [{
        name: 'positive: issued credential "@context" items are strings',
        run: async () => {
          const issuedVc = await endpoints.issue();
          const problems = findNonStringItems(issuedVc, '@context');
          if(problems.length > 0) {
            throw new Error(problems.join('; '));
          }
        }
      }];
    }
  }, {
    statement: NORMATIVE['3-2-1-issue-credential-2'],
    link: `${TR}#issue-credential`,
    subtests({endpoints}) {
      return [{
        name: 'positive: issued credential "type" items are strings',
        run: async () => {
          const issuedVc = await endpoints.issue();
          const problems = findNonStringItems(issuedVc, 'type');
          if(problems.length > 0) {
            throw new Error(problems.join('; '));
          }
        }
      }];
    }
  }]
});
