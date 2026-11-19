/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.2.1 (n): what it does`.
//
// Whether a use case requires multiple proofs is the issuer instance's
// configuration, which the suite cannot see. An issuers entry declares it
// with the `multiProofs` tag (README, "Issuer entries"). The sentence covers
// proof sets and proof chains alike, so the check counts proofs and does not
// look at how they relate. Implementations with no such entry get a skipped
// cell.

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {shouldReturnHttpResult} from '../assertions.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const MULTI_PROOFS_TAG = 'multiProofs';

const {match: implementations} = filterByTag(
  {property: 'issuers', tags: [VCALM_TAG]});

// The VCALM issuers entries that attach multiple proofs.
function multipleProofIssuers(implementation) {
  return implementation.issuers.filter(issuer =>
    issuer.tags.has(VCALM_TAG) && issuer.tags.has(MULTI_PROOFS_TAG));
}

describe('Issue Credential', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      const issuers = multipleProofIssuers(implementation);
      statementTest({
        name, implementation, rowId: '3-2-1-issue-credential-1',
        role: 'issuer',
        skip: issuers.length === 0 ?
          `no issuers entry tagged VCALM and ${MULTI_PROOFS_TAG}` :
          undefined
      }, async ({endpoints, responds}) => {
        for(const issuer of issuers) {
          await responds(
            '3.2.1 (1): one issue call returns multiple proofs', async () => {
              endpoints.issuer = issuer;
              const {issuedVc, result, error} =
                await endpoints.issueCredential();
              shouldReturnHttpResult({result, error});
              expect(result.status).to.equal(201);
              const attached = [issuedVc?.proof].flat().filter(Boolean);
              expect(attached.length, 'Expected multiple proofs.')
                .to.be.at.least(2);
              const values = attached.map(proof => proof.proofValue ??
                JSON.stringify(proof));
              expect(new Set(values).size, 'Expected distinct proofs.')
                .to.equal(attached.length);
            });
        }
      });
    });
  }
});
