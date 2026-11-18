/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import chai from 'chai';

import {
  expectSatisfiesOpenApi,
  isOpenApiValidationEnabled
} from './openapi.js';
import {
  parseInteractionSchemeUrl,
  PROOF_HANDLING_MODES,
  RECOMMENDED_VC_PAYLOAD_BYTES
} from './helpers.js';
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

// The OpenAPI defines the 200 response of the status update with no body, so
// only the status code is checked.
export function shouldUpdateCredentialStatus({result}) {
  shouldReturnHttpResult({result});
  result.status.should.equal(200, 'Expected status code 200.');
}

export function shouldRejectMalformedStatusRequest({result}) {
  should.exist(result, 'Expected an HTTP result.');
  result.status.should.be.at.least(
    400,
    'Expected client error for malformed status request.'
  );
  result.status.should.be.below(
    500,
    'Expected client error for malformed status request.'
  );
}

export function shouldRejectMalformedIssueRequest({result}) {
  should.exist(result, 'Expected an HTTP result.');
  result.status.should.be.at.least(
    400,
    'Expected client error for malformed issue request.'
  );
  result.status.should.be.below(
    500,
    'Expected client error for malformed issue request.'
  );
}

export function shouldRejectMalformedWorkflowRequest({result}) {
  should.exist(result, 'Expected an HTTP result.');
  result.status.should.be.at.least(
    400,
    'Expected client error for malformed workflow request.'
  );
  result.status.should.be.below(
    500,
    'Expected client error for malformed workflow request.'
  );
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

export function verificationWarningsIn(data) {
  if(Array.isArray(data?.warnings)) {
    return data.warnings;
  }
  return [];
}

// The spec sets verified to true when no errors were detected, and false
// otherwise. problemDetails holds errors and warnings together, and the spec
// does not mark which is which, so a problemDetails item cannot contradict
// verified. Only an explicit errors list can.
export function shouldReflectVerificationErrorsVsWarnings(data) {
  data.should.have.property('verified');
  data.verified.should.be.a('boolean');
  if(Array.isArray(data.errors)) {
    data.verified.should.equal(
      data.errors.length === 0,
      'Expected verified to be true exactly when no errors are included.'
    );
  }
}

export function shouldNotReportVerifiedTrue({data, result}) {
  should.exist(result, 'Expected an HTTP result.');
  if(result.status >= 400 && result.status < 500) {
    if(data && Object.hasOwn(data, 'verified')) {
      data.verified.should.equal(
        false,
        'Expected verified:false when a verification error is reported.'
      );
    }
    return;
  }
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object');
  data.verified.should.equal(
    false,
    'Expected verification of invalid input to report verified:false.'
  );
}

export function shouldVerifyPresentation({data, result}) {
  shouldVerifyCredential({data, result, operation: 'verifyPresentation'});
}

export function shouldCreateChallenge({data, result}) {
  shouldReturnHttpResult({result});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object', 'Expected a challenge result object.');
  data.should.have.property('challenge');
  data.challenge.should.be.a('string').and.not.be.empty;
  shouldSatisfyOpenApi({result, data, operation: 'challenge'});
}

export function shouldSatisfyVprQueryRequirements(vpr) {
  vpr.should.have.property('query');
  vpr.query.should.be.an('array').that.is.not.empty;
  for(const entry of vpr.query) {
    entry.should.have.property('type');
    entry.type.should.be.a('string').and.not.be.empty;
  }
}

// The OpenAPI lists 201 and 204 and describes a Location header for both,
// but does not mark the header required, so it is checked only when present.
export function shouldCreateWorkflow({result, error}) {
  shouldReturnHttpResult({result, error});
  [201, 204].should.include(
    result.status,
    'Expected status code 201 or 204.'
  );
  const location = result.headers?.get?.('location');
  if(location !== null && location !== undefined) {
    location.should.be.a('string').and.not.be.empty;
  }
}

export function shouldCreateExchange({result, error}) {
  shouldCreateWorkflow({result, error});
}

// GetWorkflowResponse has no required properties, and the spec does not say
// the configuration echoes what was sent, so fields are checked only when
// present.
export function shouldGetWorkflowConfiguration({data, result, error}) {
  shouldReturnHttpResult({result, error});
  result.status.should.equal(200, 'Expected status code 200.');
  data.should.be.an('object');
  if(data.steps !== undefined) {
    data.steps.should.be.an('object');
  }
  if(data.initialStep !== undefined) {
    data.initialStep.should.be.a('string');
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

export function shouldSatisfyInteractionUrlFormat(interactionUrl) {
  const url = new URL(interactionUrl);
  url.searchParams.get('iuv').should.equal('1', 'Expected iuv=1.');
}

export function shouldFitInteractionQrCodeLimits(interactionUrl) {
  interactionUrl.length.should.be.at.most(
    4296,
    'Interaction URL MUST NOT exceed 4,296 characters.'
  );
}

export function shouldConformToInteractionScheme(schemeUrl, interactionUrl) {
  const parsed = parseInteractionSchemeUrl(schemeUrl);
  parsed.href.should.equal(new URL(interactionUrl).href);
}

export function shouldAdvertiseInteractionProtocols(protocols) {
  protocols.should.be.an('object');
  const hasInvite = typeof protocols.inviteRequest === 'string';
  const hasVcapi = typeof protocols.vcapi === 'string';
  (hasInvite || hasVcapi).should.equal(
    true,
    'Expected inviteRequest and/or vcapi protocol URL.'
  );
}

export function shouldBeCreatedPresentation({data, result, error}) {
  should.not.exist(
    error,
    `Expected no error creating presentation: ${error?.message}`
  );
  shouldReturnHttpResult({result});
  result.status.should.equal(201, 'Expected status code 201.');
  should.exist(data, 'Expected a response body.');
  data.should.be.an('object', 'Expected the response body to be an object.');
  data.should.have.property('verifiablePresentation');
  const vp = data.verifiablePresentation;
  should.exist(vp, 'Expected a verifiablePresentation.');
  vp.should.have.property('type');
  vp.type.should.include('VerifiablePresentation');
  vp.should.have.property('proof');
  shouldSatisfyOpenApi({
    result,
    data,
    operation: 'createPresentation'
  });
}

export function shouldUseJsonContentType(result) {
  should.exist(result, 'Expected an HTTP result.');
  const contentType = result.headers?.get?.('content-type') ??
    result.headers?.get?.('Content-Type');
  should.exist(contentType, 'Expected Content-Type response header.');
  contentType.toLowerCase().should.include(
    'application/json',
    'Expected application/json Content-Type.'
  );
}

// 3-8-error-handling-1: type is present and is a URL. The spec says only
// "a URL", so any absolute URL is accepted.
export function shouldBeProblemDetails(problem) {
  problem.should.be.an('object');
  problem.should.have.property('type');
  problem.type.should.be.a('string');
  (() => new URL(problem.type)).should.not.throw(
    TypeError, undefined, 'Expected ProblemDetails.type to be a URL.');
}

export function shouldHaveReadableProblemDetails(problem) {
  shouldBeProblemDetails(problem);
  if(problem.title !== undefined) {
    problem.title.should.be.a('string').and.not.be.empty;
  }
  if(problem.detail !== undefined) {
    problem.detail.should.be.a('string').and.not.be.empty;
  }
}

// 3.4.3.1: type is DIDAuthentication. acceptedMethods and
// acceptedCryptosuites are optional; when present, each is an array of
// objects with a method or cryptosuite name.
export function shouldBeDidAuthenticationQuery(query) {
  query.should.be.an('object', 'Expected the query to be an object.');
  should.exist(query.type, 'Expected a type.');
  query.type.should.equal('DIDAuthentication');
  if(query.acceptedMethods !== undefined) {
    shouldBeAcceptedMethods(query.acceptedMethods);
  }
  if(query.acceptedCryptosuites !== undefined) {
    shouldBeAcceptedCryptosuites(query.acceptedCryptosuites);
  }
}

export function shouldBeAcceptedMethods(acceptedMethods) {
  acceptedMethods.should.be.an('array', 'Expected acceptedMethods array.');
  for(const item of acceptedMethods) {
    item.should.be.an('object', 'Expected each acceptedMethods item ' +
      'to be an object.');
    should.exist(item.method, 'Expected each acceptedMethods item to ' +
      'have a method.');
    item.method.should.be.a('string').and.not.be.empty;
  }
}

export function shouldBeAcceptedCryptosuites(acceptedCryptosuites) {
  acceptedCryptosuites.should.be.an('array',
    'Expected acceptedCryptosuites array.');
  for(const item of acceptedCryptosuites) {
    item.should.be.an('object', 'Expected each acceptedCryptosuites item ' +
      'to be an object.');
    should.exist(item.cryptosuite, 'Expected each acceptedCryptosuites ' +
      'item to have a cryptosuite.');
    item.cryptosuite.should.be.a('string').and.not.be.empty;
  }
}

/**
 * Self-test of a checker: it must reject a known-bad value.
 *
 * @param {Function} check - The assertion to test.
 * @param {*} value - A value that violates the statement.
 * @param {string} label - What is wrong with the value.
 */
export function shouldRejectKnownBad(check, value, label) {
  let rejected = false;
  try {
    check(value);
  } catch{
    rejected = true;
  }
  rejected.should.equal(true, `Expected the checker to reject ${label}.`);
}

export function shouldBeDidAuthenticationPresentation({
  presentation,
  challenge,
  domain,
  holderDid
}) {
  presentation.should.be.an('object');
  presentation.type.should.include('VerifiablePresentation');
  presentation.holder.should.equal(holderDid);
  const proofs = Array.isArray(presentation.proof) ?
    presentation.proof :
    [presentation.proof];
  proofs.should.not.be.empty;
  for(const proof of proofs) {
    proof.challenge.should.equal(challenge);
    proof.domain.should.equal(domain);
  }
}

export function shouldDescribeLogicalQueryGroups(vpr) {
  vpr.should.have.property('query');
  const groups = new Map();
  for(const [index, entry] of vpr.query.entries()) {
    const key = entry.group ?? `__ungrouped_${index}`;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  groups.size.should.be.above(1, 'Expected multiple query groups.');
  [...groups.values()].some(entries => entries.length > 1).should.equal(
    true,
    'Expected at least one AND group with multiple queries.'
  );
}

export function shouldPreferHttpsInteractionUrl(interactionUrl) {
  const url = new URL(interactionUrl);
  url.protocol.should.equal('https:', 'Interaction URL SHOULD be HTTPS.');
}

export function shouldUseOnlyIuvQueryParameter(interactionUrl) {
  const url = new URL(interactionUrl);
  [...url.searchParams.keys()].should.deep.equal(
    ['iuv'],
    'Interaction URL SHOULD NOT include extra query parameters.'
  );
}

export function shouldReturnInteractionHtml({result}) {
  shouldReturnHttpResult({result});
  result.status.should.equal(200, 'Expected status code 200.');
  const contentType = result.headers?.get?.('content-type') ??
    result.headers?.get?.('Content-Type') ??
    '';
  contentType.toLowerCase().should.include(
    'text/html',
    'Expected text/html Content-Type.'
  );
}

export function shouldEchoReferenceId({serverMessage, clientMessage}) {
  should.exist(
    serverMessage.referenceId,
    'Expected server message to include referenceId.'
  );
  clientMessage.referenceId.should.equal(
    serverMessage.referenceId,
    'Expected client to echo referenceId.'
  );
}

export function shouldUseUrnUuidReferenceId(referenceId) {
  referenceId.should.match(
    /^urn:uuid:[0-9a-f-]{36}$/i,
    'Expected referenceId to be a urn:uuid value.'
  );
}

export function shouldAttachMultipleProofsInSingleResponse(credential) {
  const proofs = Array.isArray(credential.proof) ?
    credential.proof :
    credential.proof ? [credential.proof] : [];
  proofs.length.should.be.at.least(
    2,
    'Expected multiple proofs in a single issue response.'
  );
}

export function shouldNotUseLongLivedStaticCredentials(endpoints) {
  for(const endpoint of endpoints) {
    const authorization = endpoint.settings?.headers?.Authorization ??
      endpoint.settings?.headers?.authorization;
    if(typeof authorization === 'string') {
      authorization.should.not.match(
        /^Basic /i,
        'Requests MUST NOT use HTTP Basic Authentication.'
      );
    }
  }
}

export function shouldStripUnrecognizedProofs({
  credential,
  acceptedProofTypes
}) {
  const proofs = Array.isArray(credential.proof) ?
    credential.proof :
    credential.proof ? [credential.proof] : [];
  for(const proof of proofs) {
    acceptedProofTypes.should.include(
      proof.type,
      'Expected only understood proof types after stripping.'
    );
  }
}

export function shouldDocumentProofHandlingModes(modes) {
  modes.should.be.an('array').that.is.not.empty;
  for(const mode of modes) {
    PROOF_HANDLING_MODES.should.include(mode);
  }
}

export function shouldRecommendVcPayloadBaseline(bytes) {
  bytes.should.equal(
    RECOMMENDED_VC_PAYLOAD_BYTES,
    'Expected 10 MiB interoperability baseline.'
  );
}

export function shouldDeclareVcPayloadLimit(settings) {
  should.exist(
    settings.vcPayloadLimitBytes,
    'Expected vcPayloadLimitBytes in endpoint settings.'
  );
  settings.vcPayloadLimitBytes.should.be.at.least(
    RECOMMENDED_VC_PAYLOAD_BYTES,
    'Configured VC payload limit SHOULD be at least the 10 MiB baseline.'
  );
}

export function shouldDeclareInstancePayloadLimit(settings) {
  should.exist(
    settings.instancePayloadLimitBytes,
    'Expected instancePayloadLimitBytes in endpoint settings.'
  );
  settings.instancePayloadLimitBytes.should.be.above(
    0,
    'Instance payload limit SHOULD be a positive byte count.'
  );
}

export function shouldAllowIssueRequestVariables(issueRequest) {
  issueRequest.should.be.an('object');
  issueRequest.should.have.property('variables');
  issueRequest.variables.should.be.an('object');
}

export function shouldSatisfyIssueRequestResult(issueRequest) {
  issueRequest.should.be.an('object');
  issueRequest.should.have.property('result');
  const {result} = issueRequest;
  const isTopLevelVariable = /^[A-Za-z_][\w]*$/.test(result);
  const isJsonPointer = result.startsWith('/variables/');
  (isTopLevelVariable || isJsonPointer).should.equal(
    true,
    'Expected result to name a top-level variable or be a JSON pointer.'
  );
}

export function shouldAllowServerReferenceId(message) {
  if(message?.referenceId === undefined) {
    return;
  }
  message.referenceId.should.be.a('string').and.not.be.empty;
}

export function shouldHandlePreProofedCredentialIssue({
  data,
  issuedVc,
  result
}) {
  should.exist(result, 'Expected an HTTP result.');
  if(result.status < 400) {
    should.exist(data, 'Expected a response body.');
    data.should.have.property('verifiableCredential');
    issuedVc.should.equal(data.verifiableCredential);
  }
  if(result.status >= 400) {
    return;
  }
  result.status.should.equal(201);
  should.exist(issuedVc?.proof, 'Expected a proof on the issued VC.');
  const proofs = Array.isArray(issuedVc.proof) ?
    issuedVc.proof :
    issuedVc.proof ? [issuedVc.proof] : [];
  const hasProofChain = proofs.some(
    proof => proof?.previousProof !== undefined && proof?.previousProof !== null
  );
  const hasProofSet = proofs.length >= 2;
  (hasProofChain || hasProofSet).should.equal(
    true,
    'Expected proof sets (multiple proofs) or proof chains (previousProof) ' +
    'when existing proofs are accepted.'
  );
}
