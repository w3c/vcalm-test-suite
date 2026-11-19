/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.6.5 (n): what it does`.
// (1) and (3) are about the endpoint's own response, so they have responds
// checks and no refusal.

import {
  setupStatementMatrix, statementTest
} from '../statement-test.js';
import {
  shouldCreateExchange,
  shouldCreateWorkflow,
  shouldGetCurrentExchangeVpr
} from '../assertions.js';
import chai from 'chai';
import {createWorkflowRequest} from '../mock.data.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;
const {match: implementations} = filterByTag(
  {property: 'workflows', tags: [VCALM_TAG]});

// Creates a workflow from `body` and an exchange on it, and returns the
// exchange's current verifiable presentation request.
async function currentVpr({endpoints, body}) {
  const workflow = await endpoints.createWorkflow(body);
  shouldCreateWorkflow(workflow);
  const exchange = await endpoints.createExchange(workflow.workflowId);
  shouldCreateExchange(exchange);
  return endpoints.getCurrentExchangeVpr(
    workflow.workflowId, exchange.exchangeId);
}

describe('Get Current Exchange VPR', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      // The workflow's first step has a verifiable presentation request.
      // An implementation may add values such as a challenge, so the check
      // compares the query it was configured with.
      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-6-5-get-current-exchange-vpr-1'
      }, async ({endpoints, responds}) => {
        await responds('3.6.5 (1): the request of a step with one',
          async () => {
            const body = createWorkflowRequest();
            const response = await currentVpr({endpoints, body});
            shouldGetCurrentExchangeVpr(response);
            expect(response.data.verifiablePresentationRequest.query)
              .to.deep.equal(body.steps.start.verifiablePresentationRequest
                .query);
          });
      });

      // The workflow's only step presents a verifiable presentation and
      // requests none.
      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-6-5-get-current-exchange-vpr-3'
      }, async ({endpoints, responds}) => {
        await responds('3.6.5 (3): the request of a step without one',
          async () => {
            const body = {
              ...createWorkflowRequest(),
              steps: {start: {verifiablePresentation: {
                '@context': ['https://www.w3.org/ns/credentials/v2'],
                type: ['VerifiablePresentation']
              }}}
            };
            const response = await currentVpr({endpoints, body});
            shouldGetCurrentExchangeVpr({...response, empty: true});
          });
      });

      statementTest({
        name, implementation, rowId: '3-6-5-get-current-exchange-vpr-4',
        skip: 'not tested: the statement binds the coordinator that makes a ' +
          'Digital Credentials API request, not the workflow service'
      });

      statementTest({
        name, implementation, rowId: '3-6-5-get-current-exchange-vpr-5',
        skip: 'not tested: the statement binds the browser, not the ' +
          'workflow service'
      });
    });
  }
});
