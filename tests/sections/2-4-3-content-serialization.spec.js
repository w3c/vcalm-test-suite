/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `2.4.3 (n): what it does`.
//
// The sentence binds requests and responses. Requests are the suite's own,
// so the checks observe responses only: each response of an operation the
// OpenAPI defines with a body must be JSON with a Content-Type of
// application/json. Refusing a request body that is not JSON is checked
// under 2.4.2 (5).

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import {shouldCreateExchange, shouldCreateWorkflow} from '../assertions.js';
import {testCredential, testPresentation} from '../signing.js';
import chai from 'chai';
import {createIssueBodyEmpty} from '../negative-fixtures.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {randomUUID} from 'node:crypto';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const implementations = new Map();
for(const property of ['issuers', 'verifiers', 'workflows']) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  for(const [name, implementation] of match) {
    implementations.set(name, implementation);
  }
}

// A workflow and an exchange on it, from the implementation's create options.
async function createdExchange(endpoints) {
  const workflow = await endpoints.createWorkflow();
  shouldCreateWorkflow(workflow);
  const exchange = await endpoints.createExchange(workflow.workflowId);
  shouldCreateExchange(exchange);
  return {workflowId: workflow.workflowId, exchangeId: exchange.exchangeId};
}

// `settled` is a TestEndpoints result: `{data, result}`, where `data` is the
// parsed body.
function shouldBeJsonResponse({data, result} = {}) {
  expect(result, 'Expected an HTTP response.').to.exist;
  const contentType = result.headers?.get('content-type') ?? '';
  expect(contentType).to.match(/^application\/json\b/,
    `Expected a Content-Type of application/json, got "${contentType}".`);
  expect(data, 'Expected a JSON body.').to.be.an('object');
}

describe('Content Serialization', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: 'content-serialization-1'
      }, async ({endpoints, responds}) => {
        if(endpoints.issuer) {
          await responds('2.4.3 (1): the issue response', async () => {
            const {data, result} = await endpoints.issueCredential();
            expect(result?.status).to.equal(201);
            shouldBeJsonResponse({data, result});
          });
          await responds('2.4.3 (1): the issue error response', async () => {
            const {data, result} = await endpoints.issueCredentialWithBody(
              createIssueBodyEmpty());
            expect(result?.status).to.be.within(400, 499);
            shouldBeJsonResponse({data, result});
          });
        }
        if(endpoints.verifier) {
          await responds('2.4.3 (1): the verify credential response',
            async () => {
              shouldBeJsonResponse(await endpoints.verifyCredential(
                await testCredential()));
            });
          await responds('2.4.3 (1): the verify presentation response',
            async () => {
              const challenge = randomUUID();
              const domain = 'https://vcalm-test-suite.example';
              const presentation = await testPresentation({
                credentials: [await testCredential()], challenge, domain
              });
              shouldBeJsonResponse(await endpoints.verifyPresentation(
                presentation, {challenge, domain}));
            });
        }
        if(endpoints.workflow) {
          await responds('2.4.3 (1): the workflow configuration response',
            async () => {
              const created = await endpoints.createWorkflow();
              shouldCreateWorkflow(created);
              shouldBeJsonResponse(await endpoints.getWorkflowConfiguration(
                created.workflowId));
            });
          await responds('2.4.3 (1): the exchange responses', async () => {
            const {workflowId, exchangeId} = await createdExchange(endpoints);
            shouldBeJsonResponse(await endpoints.getExchangeProtocols(
              workflowId, exchangeId));
            shouldBeJsonResponse(await endpoints.getCurrentExchangeVpr(
              workflowId, exchangeId));
            shouldBeJsonResponse(await endpoints.getExchangeState(
              workflowId, exchangeId));
          });
        }
      });
    });
  }
});
