/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.4.3.2 (n): what it does`.
//
// The statements give the form of a DID Authentication response, which a
// holder sends to the workflow service that asked for it. The suite tests
// the receiving side: the test holder (../signing.js) answers a DID
// Authentication request through the exchange protocol (POST {}, then POST
// the presentation), and the exchange must accept a response of the required
// form and refuse one that breaks the statement. The spec does not say in
// words that a service must refuse such a response; the suite reads a
// response that breaks these MUSTs as not a DID Authentication response, so
// the exchange must not complete with it.
//
// Each step sets `createChallenge` (an OpenAPI step field) so the service
// adds a challenge, and sets the request's `domain`, which the service does
// not add on its own.

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import chai from 'chai';
import {createWorkflowRequest} from '../mock.data.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {shouldBeListedRefusal} from '../openapi.js';
import {shouldCreateWorkflow} from '../assertions.js';
import {testDidAuthenticationResponse} from '../signing.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const {match: implementations} = filterByTag(
  {property: 'workflows', tags: [VCALM_TAG]});

// A workflow whose only step asks for DID Authentication, an exchange on it,
// and the request the exchange returns for POST {}.
async function didAuthenticationRequest({
  endpoints, methods = ['key'], cryptosuites = ['eddsa-rdfc-2022']
}) {
  const domain = new URL(endpoints.workflow.settings.endpoint).origin;
  const created = await endpoints.createWorkflow({
    ...createWorkflowRequest(),
    steps: {start: {
      createChallenge: true,
      verifiablePresentationRequest: {
        domain,
        query: [{
          type: 'DIDAuthentication',
          acceptedMethods: methods.map(method => ({method})),
          acceptedCryptosuites: cryptosuites.map(cryptosuite => ({cryptosuite}))
        }]
      }
    }}
  });
  shouldCreateWorkflow(created);
  const {workflowId} = created;
  const {exchangeId} = await endpoints.createExchange(workflowId);
  const started = await endpoints.participateInExchange(
    workflowId, exchangeId, {});
  expect(started.result?.status, 'POST {} to the exchange').to.equal(200);
  const request = started.data?.verifiablePresentationRequest;
  expect(request?.challenge, 'the request challenge').to.be.a('string');
  return {workflowId, exchangeId, challenge: request.challenge, domain};
}

// Answers a fresh DID Authentication request with the response that
// `respond` builds from it, and returns the exchange's HTTP result.
async function answer({endpoints, request = {}, respond}) {
  const exchange = await didAuthenticationRequest({endpoints, ...request});
  const verifiablePresentation = await respond(exchange);
  const {result} = await endpoints.participateInExchange(
    exchange.workflowId, exchange.exchangeId, {verifiablePresentation});
  return result;
}

const correct = ({challenge, domain}) =>
  testDidAuthenticationResponse({challenge, domain});

function accepted(result) {
  expect(result?.status, 'Expected the exchange to accept the response.')
    .to.equal(200);
}

function refused(result) {
  shouldBeListedRefusal({result, operation: 'participateInExchange'});
}

describe('The DID Authentication Response Format', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-3-2-the-did-authentication-response-format-1'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.2 (1): a signed DID Authentication response',
          async () => accepted(await answer({endpoints, respond: correct})));
        await refuses('3.4.3.2 (1): a response without a proof', async () => {
          const result = await answer({endpoints, respond: async exchange => {
            const presentation = await correct(exchange);
            delete presentation.proof;
            return presentation;
          }});
          refused(result);
        });
      });

      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-3-2-the-did-authentication-response-format-2'
      }, async ({endpoints, accepts, refuses}) => {
        // eddsa-jcs-2022 signs a document whose type is not
        // VerifiablePresentation; eddsa-rdfc-2022 cannot (see ../signing.js).
        const request = {cryptosuites: ['eddsa-jcs-2022']};
        await accepts('3.4.3.2 (2): type VerifiablePresentation', async () =>
          accepted(await answer({endpoints, request,
            respond: ({challenge, domain}) => testDidAuthenticationResponse(
              {challenge, domain, cryptosuite: 'eddsa-jcs-2022'})})));
        await refuses('3.4.3.2 (2): type VerifiableCredential', async () =>
          refused(await answer({endpoints, request,
            respond: ({challenge, domain}) => testDidAuthenticationResponse({
              challenge, domain, cryptosuite: 'eddsa-jcs-2022',
              change: document => ({...document,
                type: ['VerifiableCredential']})
            })})));
      });

      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-3-2-the-did-authentication-response-format-3'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.2 (3): holder is a did:key, as requested',
          async () => accepted(await answer({endpoints, respond: correct})));
        await refuses('3.4.3.2 (3): no holder', async () =>
          refused(await answer({endpoints,
            respond: ({challenge, domain}) => testDidAuthenticationResponse({
              challenge, domain,
              change: document => {
                delete document.holder;
                return document;
              }
            })})));
        await refuses('3.4.3.2 (3): a did:key holder when did:web is requested',
          async () => refused(await answer({endpoints,
            request: {methods: ['web']}, respond: correct})));
      });

      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-3-2-the-did-authentication-response-format-4'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.2 (4): an eddsa-rdfc-2022 proof, as requested',
          async () => accepted(await answer({endpoints, respond: correct})));
        await refuses('3.4.3.2 (4): an eddsa-rdfc-2022 proof when only ' +
          'eddsa-jcs-2022 is requested', async () =>
          refused(await answer({endpoints,
            request: {cryptosuites: ['eddsa-jcs-2022']}, respond: correct})));
      });

      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-3-2-the-did-authentication-response-format-5'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.2 (5): the requested challenge and domain',
          async () => accepted(await answer({endpoints, respond: correct})));
        await refuses('3.4.3.2 (5): another challenge', async () =>
          refused(await answer({endpoints,
            respond: ({domain}) => testDidAuthenticationResponse(
              {challenge: 'urn:uuid:00000000-0000-4000-8000-000000000000',
                domain})})));
        await refuses('3.4.3.2 (5): another domain', async () =>
          refused(await answer({endpoints,
            respond: ({challenge}) => testDidAuthenticationResponse(
              {challenge, domain: 'https://other.example'})})));
        await refuses('3.4.3.2 (5): no domain', async () =>
          refused(await answer({endpoints,
            respond: ({challenge}) => testDidAuthenticationResponse(
              {challenge})})));
      });

      statementTest({
        name, implementation,
        rowId: '3-4-3-2-the-did-authentication-response-format-6',
        skip: 'not tested: the statement binds holders, which check the ' +
          'domain against their own channel'
      });
    });
  }
});
