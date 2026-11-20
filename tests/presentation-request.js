/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Workflows whose only step asks for a verifiable presentation, for the 3.4
// sections. The exchange protocol is used as a wallet uses it: POST {} to
// the exchange returns the step's request (section 3.6.6).

import {CompactEncrypt, importJWK} from 'jose';
import chai from 'chai';
import {createWorkflowRequest} from './mock.data.js';
import {shouldBeListedRefusal} from './openapi.js';
import {shouldCreateWorkflow} from './assertions.js';

const {expect} = chai;

export const DID_AUTHENTICATION_QUERY = {
  type: 'DIDAuthentication',
  acceptedMethods: [{method: 'key'}],
  acceptedCryptosuites: [{cryptosuite: 'eddsa-rdfc-2022'}]
};

// 3.4.2: "The `credentialQuery` property in a `QueryByExample` query is a
// single object."
export const QUERY_BY_EXAMPLE = {
  type: 'QueryByExample',
  credentialQuery: {example: {type: 'VerifiableCredential'}}
};

/**
 * The domain the suite puts in its requests: the workflow service's origin.
 * The service does not add a domain on its own.
 *
 * @param {object} endpoints - TestEndpoints.
 * @returns {string} The domain.
 */
export function requestDomain(endpoints) {
  return new URL(endpoints.workflow.settings.endpoint).origin;
}

/**
 * A create workflow body whose only step asks for `request`. The step sets
 * `createChallenge` (an OpenAPI step field), and `step` adds other fields.
 *
 * @param {object} options - Options.
 * @param {object} options.endpoints - TestEndpoints.
 * @param {object} options.request - The step's presentation request, without
 *   a domain.
 * @param {object} [options.step] - More step fields.
 * @returns {object} The body.
 */
export function stepWorkflow({endpoints, request, step = {}}) {
  return {
    ...createWorkflowRequest(),
    steps: {start: {
      createChallenge: true,
      verifiablePresentationRequest: {
        domain: requestDomain(endpoints), ...request
      },
      ...step
    }}
  };
}

/**
 * Creates a workflow for `request`, starts an exchange on it with POST {},
 * and returns the request the exchange sends.
 *
 * @param {object} options - Options.
 * @param {object} options.endpoints - TestEndpoints.
 * @param {object} options.request - The step's presentation request, without
 *   a domain.
 * @param {object} [options.step] - More step fields.
 * @returns {Promise<object>} `{workflowId, exchangeId, served, sent}`.
 */
export async function servedRequest({endpoints, request, step}) {
  const body = stepWorkflow({endpoints, request, step});
  const created = await endpoints.createWorkflow(body);
  shouldCreateWorkflow(created);
  const {workflowId} = created;
  const {exchangeId} = await endpoints.createExchange(workflowId);
  const started = await endpoints.participateInExchange(
    workflowId, exchangeId, {});
  expect(started.result?.status, 'POST {} to the exchange').to.equal(200);
  const served = started.data?.verifiablePresentationRequest;
  expect(served, 'Expected a verifiable presentation request.')
    .to.be.an('object');
  return {
    workflowId, exchangeId, served,
    sent: body.steps.start.verifiablePresentationRequest
  };
}

/**
 * Asserts that the workflow service does not give a holder a request of the
 * wrong form. In an exchange the service is the verifier that provides the
 * request, so the form statements bind what it serves. It may refuse when
 * the workflow is created, when an exchange is created on it, or when the
 * exchange starts (a step can be a template, so the request may only exist
 * then), each time with a status the OpenAPI lists. Serving it fails.
 *
 * @param {object} options - Options.
 * @param {object} options.endpoints - TestEndpoints.
 * @param {object} options.request - The step's presentation request, without
 *   a domain.
 * @param {object} [options.step] - More step fields.
 */
export async function shouldRefuseRequest({endpoints, request, step}) {
  const created = await endpoints.createWorkflow(
    stepWorkflow({endpoints, request, step}));
  if(created.result?.status !== 201) {
    shouldBeListedRefusal(
      {result: created.result, operation: 'createWorkflow'});
    return;
  }
  const exchange = await endpoints.createExchange(created.workflowId);
  if(exchange.result?.status !== 201 || !exchange.exchangeId) {
    shouldBeListedRefusal(
      {result: exchange.result, operation: 'createExchange'});
    return;
  }
  const {exchangeId} = exchange;
  const started = await endpoints.participateInExchange(
    created.workflowId, exchangeId, {});
  if(started.result?.status === 200) {
    throw new Error('The workflow was created (201) and its exchange served ' +
      'the request: ' +
      JSON.stringify(started.data?.verifiablePresentationRequest));
  }
  shouldBeListedRefusal(
    {result: started.result, operation: 'participateInExchange'});
}

/**
 * Encrypts a presentation to a key from a request's `acceptedEncryption`, as
 * section 3.4.1 describes: an EnvelopedVerifiablePresentation whose `id` is a
 * `data:application/jwt,` URL carrying a JWE compact serialization.
 *
 * @param {object} options - Options.
 * @param {object} options.presentation - The presentation to encrypt.
 * @param {object} options.jwk - A public JWK from `acceptedEncryption.jwks`.
 * @returns {Promise<object>} The enveloped presentation.
 */
export async function encryptPresentation({presentation, jwk}) {
  const alg = jwk.alg ?? 'ECDH-ES';
  const key = await importJWK(jwk, alg);
  const jwe = await new CompactEncrypt(
    new TextEncoder().encode(JSON.stringify(presentation)))
    .setProtectedHeader({alg, enc: 'A128GCM', kid: jwk.kid})
    .encrypt(key);
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: 'EnvelopedVerifiablePresentation',
    id: `data:application/jwt,${jwe}`
  };
}
