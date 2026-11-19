/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.8 (n): what it does`.
//
// (1) is about the ProblemDetails the implementation returns, so it has
// responds checks and no refusal. The checks read the ProblemDetails the
// OpenAPI declares: those in the result of a verification that fails, and an
// exchange's lastError after it refuses a response (see ../problem-details.js).
// The exchange state is searched at any depth, so lastError is found wherever
// the body puts it. A response with no ProblemDetails is not applicable. (2)
// and (3) are SHOULD statements and have no row.

import {NotApplicable, setupStatementMatrix, statementTest} from
  '../statement-test.js';
import {
  problemDetailsIn, shouldHaveUrlTypes, tamperedCredential,
  verifyTestPresentation
} from '../problem-details.js';
import {requestDomain, servedRequest} from '../presentation-request.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {testDidAuthenticationResponse} from '../signing.js';
import {VCALM_TAG} from '../helpers.js';

const implementations = new Map();
for(const property of ['verifiers', 'workflows']) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  for(const [name, implementation] of match) {
    implementations.set(name, implementation);
  }
}

function shouldHaveUrlTypesIn(body) {
  const found = problemDetailsIn(body);
  if(found.length === 0) {
    throw new NotApplicable('the response has no ProblemDetails');
  }
  shouldHaveUrlTypes(found);
}

// Answers a DID Authentication request with a response signed for another
// challenge, then returns the exchange's state.
async function stateAfterRefusedResponse(endpoints) {
  const {workflowId, exchangeId} = await servedRequest({
    endpoints,
    request: {query: [{
      type: 'DIDAuthentication',
      acceptedMethods: [{method: 'key'}],
      acceptedCryptosuites: [{cryptosuite: 'eddsa-rdfc-2022'}]
    }]}
  });
  const verifiablePresentation = await testDidAuthenticationResponse({
    challenge: 'not-the-requested-challenge',
    domain: requestDomain(endpoints)
  });
  await endpoints.participateInExchange(
    workflowId, exchangeId, {verifiablePresentation});
  const {data} = await endpoints.getExchangeState(workflowId, exchangeId);
  return data;
}

describe('Error Handling', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: '3-8-error-handling-1'
      }, async ({endpoints, responds}) => {
        if(endpoints.verifier) {
          await responds('3.8 (1): a credential that fails verification',
            async () => {
              const {data} = await endpoints.verifyCredential(
                await tamperedCredential());
              shouldHaveUrlTypesIn(data);
            });
          await responds('3.8 (1): a presentation that fails verification',
            async () => {
              const {data} = await verifyTestPresentation(
                {endpoints, tampered: true});
              shouldHaveUrlTypesIn(data);
            });
        }
        if(endpoints.workflow) {
          await responds('3.8 (1): the lastError of an exchange that ' +
            'refused a response', async () => {
            shouldHaveUrlTypesIn(await stateAfterRefusedResponse(endpoints));
          });
        }
      });
    });
  }
});
