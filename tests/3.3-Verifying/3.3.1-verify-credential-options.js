/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// The verify request options are checked as part of the verifier's interface
// conformance. The response is checked against the OpenAPI schema, which
// defines the options object and the credentialSchema and credentialStatus
// result items. Those result items are only present when the verifier returns
// them, and our verifier does not, so they are not exercised here.

import {implementationsWithIssuerAndVerifier, VCALM_TAG} from '../helpers.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {shouldVerifyCredential} from '../assertions.js';
import {TR} from '../skipped-section.js';

// The positive check issues a credential with the implementation's own issuer
// before verifying it, so only entries with an issuer and a verifier match.
const {match: tagged} = filterByTag({tags: [VCALM_TAG]});
const match = implementationsWithIssuerAndVerifier(tagged, VCALM_TAG);

describeNormativeStatement({
  section: 'Conformance',
  match,
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['1-3-conformance-3'],
    link: `${TR}#conformance`,
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
  }]
});
