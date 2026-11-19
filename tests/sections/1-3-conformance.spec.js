/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `1.3 (n): what it does`.
// A statement binds one service role, and an implementation without an entry
// for that role gets a skipped cell.

import {
  createIssueBodyCredentialWithoutType,
  createIssueBodyEmpty,
  createIssueBodyMissingCredential,
  WORKFLOW_EXCHANGE_NEGATIVE_CASES,
  WORKFLOW_NEGATIVE_CASES
} from '../negative-fixtures.js';
import {
  NotApplicable, setupStatementMatrix, statementTest
} from '../statement-test.js';
import {
  shouldAcceptExchangeCallback,
  shouldBeIssuedVc,
  shouldCreateExchange,
  shouldCreateWorkflow,
  shouldGetCurrentExchangeVpr,
  shouldGetExchangeProtocols,
  shouldGetExchangeState,
  shouldGetWorkflowConfiguration,
  shouldParticipateInExchange,
  shouldReturnHttpResult,
  shouldUpdateCredentialStatus,
  shouldVerifyCredential,
  shouldVerifyPresentation
} from '../assertions.js';
import {testCredential, testPresentation} from '../signing.js';
import chai from 'chai';
import {createWorkflowRequest} from '../mock.data.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {randomUUID} from 'node:crypto';
import {shouldBeListedRefusal} from '../openapi.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

// Implementations with any endpoint tagged VCALM. filterByTag matches one
// property at a time, so take the union over the role keys.
const ROLE_KEYS = [
  'issuers', 'verifiers', 'holders', 'workflows', 'status', 'interactions'
];
const implementations = new Map();
for(const property of ROLE_KEYS) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  for(const [name, implementation] of match) {
    implementations.set(name, implementation);
  }
}

// The HTTP response of a TestEndpoints call, whether or not it was an error.
const responseOf = ({result, error}) => result ?? error?.response;

// A verifier refuses a credential or presentation when it answers with a
// client error the OpenAPI lists, or with 200 and verified false (3.8.1).
function shouldRefuseVerification({data, result, operation}) {
  if(result?.status === 200) {
    expect(data?.verified, 'Expected verified to be false.').to.equal(false);
    return;
  }
  shouldBeListedRefusal({result, operation});
}

describe('Conformance', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, role: 'issuer', rowId: '1-3-conformance-1'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('1.3 (1): POST /credentials/issue issues a credential',
          async () => {
            const {data, result, error} = await endpoints.issueCredential();
            shouldReturnHttpResult({result, error});
            expect(result.status).to.equal(201);
            shouldBeIssuedVc({data, result});
          });
        const issueBodies = {
          'no credential': createIssueBodyMissingCredential(),
          'an empty body': createIssueBodyEmpty(),
          'a credential without type': createIssueBodyCredentialWithoutType()
        };
        for(const [what, body] of Object.entries(issueBodies)) {
          await refuses(`1.3 (1): issue with ${what}`, async () => {
            const {result} = await endpoints.issueCredentialWithBody(body);
            shouldBeListedRefusal({result, operation: 'issueCredential'});
          });
        }
      });

      // The test issuer and test holder (../signing.js) sign the credential
      // and the presentation, so only the verifier is under test.
      statementTest({
        name, implementation, role: 'verifier', rowId: '1-3-conformance-3'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('1.3 (3): verify a credential from the test issuer',
          async () => {
            const response = await endpoints.verifyCredential(
              await testCredential());
            shouldVerifyCredential(response);
            expect(response.data.verified).to.equal(true);
          });
        await refuses('1.3 (3): verify a credential changed after signing',
          async () => {
            const credential = await testCredential();
            credential.credentialSubject.id = `urn:uuid:${randomUUID()}`;
            const {data, result} = await endpoints.verifyCredential(credential);
            shouldRefuseVerification(
              {data, result, operation: 'verifyCredential'});
          });
        // The same presentation is verified twice: with the challenge it was
        // signed for, and with another one, so only the challenge differs.
        const challenge = randomUUID();
        const domain = 'https://vcalm-test-suite.example';
        const presentation = await testPresentation({
          credentials: [await testCredential()], challenge, domain
        });
        await accepts('1.3 (3): verify a presentation from the test holder',
          async () => {
            const response = await endpoints.verifyPresentation(
              presentation, {challenge, domain});
            shouldVerifyPresentation(response);
            expect(response.data.verified).to.equal(true);
          });
        await refuses('1.3 (3): verify the presentation with another challenge',
          async () => {
            const {data, result} = await endpoints.verifyPresentation(
              presentation, {challenge: randomUUID(), domain});
            shouldRefuseVerification(
              {data, result, operation: 'verifyPresentation'});
          });
      });

      statementTest({
        name, implementation, rowId: '1-3-conformance-5',
        skip: 'not tested yet: needs an exchange that the holder service ' +
          'takes part in'
      });

      statementTest({
        name, implementation, role: 'status', rowId: '1-3-conformance-7'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('1.3 (7): update the status of an issued credential',
          async () => {
            if(!endpoints.issuer) {
              throw new NotApplicable(
                'needs an issuers entry to issue a credential with a status');
            }
            const issued = await endpoints.issueCredential(undefined, {
              statusPurpose: 'revocation'
            });
            shouldReturnHttpResult(issued);
            expect(issued.result.status).to.equal(201);
            const {credentialStatus} = issued.issuedVc ?? {};
            const {data, result} = await endpoints.updateCredentialStatus({
              credentialId: issued.issuedVc?.id,
              credentialStatus: [credentialStatus].flat()[0],
              status: false
            });
            shouldUpdateCredentialStatus({data, result});
          });
        await refuses('1.3 (7): update status with an empty body',
          async () => {
            const response = await endpoints.updateCredentialStatus({});
            shouldBeListedRefusal(
              {result: responseOf(response), operation: 'updateStatus'});
          });
      });

      statementTest({
        name, implementation, role: 'workflow', rowId: '1-3-conformance-8'
      }, async ({endpoints, accepts, refuses}) => {
        const createdWorkflow = async () => {
          const created = await endpoints.createWorkflow();
          shouldCreateWorkflow(created);
          return created;
        };
        const createdExchange = async () => {
          const workflow = await createdWorkflow();
          const exchange = await endpoints.createExchange(workflow.workflowId);
          shouldCreateExchange(exchange);
          return {workflowId: workflow.workflowId,
            exchangeId: exchange.exchangeId};
        };
        await accepts('1.3 (8): create a workflow', createdWorkflow);
        await accepts('1.3 (8): get the workflow configuration', async () => {
          const sent = createWorkflowRequest();
          const created = await endpoints.createWorkflow(sent);
          shouldCreateWorkflow(created);
          const configuration = await endpoints.getWorkflowConfiguration(
            created.workflowId);
          shouldGetWorkflowConfiguration({...configuration, sent});
        });
        await accepts('1.3 (8): create an exchange', createdExchange);
        await accepts('1.3 (8): get the exchange protocols', async () => {
          const {workflowId, exchangeId} = await createdExchange();
          shouldGetExchangeProtocols(
            await endpoints.getExchangeProtocols(workflowId, exchangeId));
        });
        await accepts('1.3 (8): get the current exchange VPR', async () => {
          const {workflowId, exchangeId} = await createdExchange();
          shouldGetCurrentExchangeVpr(
            await endpoints.getCurrentExchangeVpr(workflowId, exchangeId));
        });
        await accepts('1.3 (8): participate in an exchange with an empty body',
          async () => {
            const {workflowId, exchangeId} = await createdExchange();
            shouldParticipateInExchange(await endpoints.participateInExchange(
              workflowId, exchangeId, {}));
          });
        await accepts('1.3 (8): get the exchange state', async () => {
          const {workflowId, exchangeId} = await createdExchange();
          const state = await endpoints.getExchangeState(
            workflowId, exchangeId);
          shouldGetExchangeState({...state, exchangeId});
        });
        await accepts('1.3 (8): accept an exchange step callback', async () => {
          shouldAcceptExchangeCallback(await endpoints.exchangeStepCallback(
            `urn:uuid:${randomUUID()}`));
        });
        for(const item of WORKFLOW_NEGATIVE_CASES) {
          await refuses(`1.3 (8): ${item.title}`, async () => {
            const created = await endpoints.createWorkflowWithBody(item.body);
            shouldBeListedRefusal(
              {result: responseOf(created), operation: 'createWorkflow'});
          });
        }
        for(const item of WORKFLOW_EXCHANGE_NEGATIVE_CASES) {
          await refuses(`1.3 (8): ${item.title}`, async () => {
            const created = await endpoints.createExchange(item.workflowId);
            shouldBeListedRefusal(
              {result: responseOf(created), operation: 'createExchange'});
          });
        }
      });

      statementTest({
        name, implementation, rowId: '1-3-conformance-9',
        skip: 'not tested: the statement binds service clients, and the ' +
          'suite tests services'
      });
    });
  }
});
