/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import chai from 'chai';

import {
  expectSatisfiesOpenApi,
  isOpenApiValidationEnabled
} from './openapi.js';
import {extractIssuedCredential} from './response.js';

const should = chai.should();

function shouldSatisfyOpenApi({result, data, operation, pathParams}) {
  if(!isOpenApiValidationEnabled() || !result) {
    return;
  }
  expectSatisfiesOpenApi({result, data, operation, pathParams});
}

export function shouldReturnHttpResult({result, error}) {
  should.not.exist(error, `Expected no error, got ${error?.message}`);
  should.exist(result, 'Expected an HTTP result.');
  should.exist(result.status, 'Expected an HTTP status code.');
}

export function shouldBeIssuedVc({
  data,
  result,
  operation = 'issueCredential',
  pathParams
}) {
  should.exist(data, 'Expected a response body.');
  data.should.be.an('object', 'Expected the response body to be an object.');
  const issuedVc = extractIssuedCredential(data);
  should.exist(issuedVc, 'Expected a verifiable credential.');
  issuedVc.should.have.property('@context');
  issuedVc.should.have.property('type');
  issuedVc.type.should.include(
    'VerifiableCredential',
    'Expected `type` to include "VerifiableCredential".'
  );
  issuedVc.should.have.property('proof');
  const proofs = Array.isArray(issuedVc.proof) ?
    issuedVc.proof :
    [issuedVc.proof];
  proofs.length.should.be.at.least(1, 'Expected at least one proof.');
  for(const proof of proofs) {
    proof.should.be.an('object', 'Expected each proof to be an object.');
  }
  if(result) {
    shouldSatisfyOpenApi({result, data, operation, pathParams});
  }
}

// The OpenAPI defines no body for the 200 of POST /credentials/status.
export function shouldUpdateCredentialStatus({result}) {
  shouldReturnHttpResult({result});
  result.status.should.equal(200, 'Expected status code 200.');
}

export function shouldVerifyCredential({
  data,
  result,
  operation = 'verifyCredential'
}) {
  shouldReturnHttpResult({result});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object', 'Expected a verification result object.');
  shouldReflectVerificationErrorsVsWarnings(data);
  shouldSatisfyOpenApi({result, data, operation});
}

export function verificationErrorsIn(data) {
  if(Array.isArray(data?.errors)) {
    return data.errors;
  }
  if(Array.isArray(data?.problemDetails)) {
    return data.problemDetails.map(item => ({
      type: item.title || item.type,
      detail: item.detail || item.title
    }));
  }
  return [];
}

export function shouldReflectVerificationErrorsVsWarnings(data) {
  data.should.have.property('verified');
  const errors = verificationErrorsIn(data);
  if(errors.length > 0) {
    data.verified.should.equal(
      false,
      'Expected verified to be false when errors are included.'
    );
  } else {
    data.verified.should.equal(
      true,
      'Expected verified to be true when no errors are included.'
    );
  }
}

export function shouldVerifyPresentation({data, result}) {
  shouldVerifyCredential({data, result, operation: 'verifyPresentation'});
}

export function shouldCreateWorkflow({result, error}) {
  shouldReturnHttpResult({result, error});
  [201, 204].should.include(
    result.status,
    'Expected status code 201 or 204.'
  );
  const location = result.headers?.get?.('location') ??
    result.headers?.get?.('Location');
  should.exist(location, 'Expected Location header.');
}

export function shouldCreateExchange({result, error}) {
  shouldCreateWorkflow({result, error});
}

export function shouldGetWorkflowConfiguration({data, result, error, sent}) {
  shouldReturnHttpResult({result, error});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object');
  data.should.have.property('steps');
  if(sent) {
    shouldRoundTripWorkflowConfiguration({sent, configuration: data});
  }
}

export function shouldRoundTripWorkflowConfiguration({sent, configuration}) {
  if(sent.id) {
    configuration.should.have.property('id', sent.id);
  }
  if(sent.initialStep) {
    configuration.should.have.property('initialStep', sent.initialStep);
  }
  for(const stepName of Object.keys(sent.steps ?? {})) {
    configuration.steps.should.have.property(stepName);
  }
}

export function shouldReturnExchangeState({data, result, error, exchangeId}) {
  shouldReturnHttpResult({result, error});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object');
  if(exchangeId) {
    const reportedId = data.exchangeId ?? data.id;
    if(reportedId !== undefined) {
      reportedId.should.equal(exchangeId);
    }
  }
}

export function shouldGetExchangeState({data, result, error, exchangeId}) {
  shouldReturnExchangeState({data, result, error, exchangeId});
}

const EXCHANGE_PROTOCOL_URL_KEYS = [
  'interact',
  'inviteRequest',
  'vcapi',
  'didcomm',
  'oid4vci-1.0',
  'oid4vp-1.0',
  'OID4VCI',
  'OID4VP'
];

export function shouldGetExchangeProtocols({data, result, error}) {
  shouldReturnHttpResult({result, error});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object');
  data.should.have.property('protocols');
  data.protocols.should.be.an('object');
  const urls = EXCHANGE_PROTOCOL_URL_KEYS.filter(key =>
    typeof data.protocols[key] === 'string' &&
    data.protocols[key].length > 0);
  urls.length.should.be.at.least(
    1,
    'Expected protocols to include at least one protocol URL.'
  );
}

export function shouldGetCurrentExchangeVpr({
  data,
  result,
  error,
  empty = false
}) {
  shouldReturnHttpResult({result, error});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object');
  data.should.have.property('verifiablePresentationRequest');
  const vpr = data.verifiablePresentationRequest;
  vpr.should.be.an('object');
  if(empty) {
    vpr.should.deep.equal({});
  }
}

export function shouldParticipateInExchange({
  data,
  result,
  error,
  referenceId
} = {}) {
  shouldReturnHttpResult({result, error});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object');
  shouldAllowServerReferenceId(data);
  if(referenceId) {
    data.should.have.property('referenceId', referenceId);
  } else if(data.referenceId) {
    shouldUseUrnUuidReferenceId(data.referenceId);
  }
}

export function shouldUseUrnUuidReferenceId(referenceId) {
  referenceId.should.match(
    /^urn:uuid:[0-9a-f-]{36}$/i,
    'Expected referenceId to be a urn:uuid value.'
  );
}

export function shouldAllowServerReferenceId(message) {
  if(message?.referenceId === undefined) {
    return;
  }
  message.referenceId.should.be.a('string').and.not.be.empty;
}
