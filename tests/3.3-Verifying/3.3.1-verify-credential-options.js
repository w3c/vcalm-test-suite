/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Statements about the verify request options and the credentialSchema and
// credentialStatus result arrays. The OpenAPI schema defines the options
// object and the item shapes, so the response is checked against it.

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {shouldVerifyCredential} from '../assertions.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'verifiers', tags: [VCALM_TAG]});

describeNormativeStatement({
  section: '3.3.1 Verify Credential',
  match,
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['3-3-1-verify-credential-1'],
    link: `${TR}#verify-credential`,
    subtests({endpoints}) {
      return [{
        name: 'positive: a verify request with the documented options is ' +
          'accepted and the response satisfies the schema',
        run: async () => {
          const issuedVc = await endpoints.issue();
          const {data, result} = await endpoints.verifyCredential(issuedVc, {
            returnResults: true,
            returnProblemDetails: true
          });
          shouldVerifyCredential({data, result});
        }
      }];
    }
  }, {
    statement: NORMATIVE['3-3-1-verify-credential-3'],
    link: `${TR}#verify-credential`,
    skip: true,
    skipMessage: 'Not exercised: the verifier is not configured to return ' +
      'credentialSchema results.'
  }, {
    statement: NORMATIVE['3-3-1-verify-credential-4'],
    link: `${TR}#verify-credential`,
    skip: true,
    skipMessage: 'Not exercised: the verifier is not configured to return ' +
      'credentialStatus results.'
  }]
});
