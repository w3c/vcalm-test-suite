/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {createRequire} from 'node:module';
import {klona} from 'klona';
import {resolveInteractionStartUrl} from './helpers.js';
import {UNKNOWN_OPTION_PROBE_KEY} from './normative-statements.js';
import {v4 as uuidv4} from 'uuid';
const require = createRequire(import.meta.url);
const validVc = require('./validVc.json');

/**
 * @param {string|string[]|undefined} cryptosuite - Issuer options.cryptosuite.
 * @returns {boolean} True when config requests a proof set (≥2 suites).
 */
export function isProofSetCryptosuite(cryptosuite) {
  return Array.isArray(cryptosuite) && cryptosuite.length >= 2;
}

/**
 * Map localConfig issue options to the VCALM request shape.
 * `cryptosuite` may be a string or string[]; an array means proof set
 * (first suite primary, remainder as additionalCryptosuites).
 *
 * @param {object} [options] - Raw issuer options from localConfig.
 * @returns {object|undefined} Options for POST /credentials/issue.
 */
export function normalizeIssueOptions(options) {
  if(!options || typeof options !== 'object') {
    return options;
  }
  const normalized = {...options};
  if(!Array.isArray(normalized.cryptosuite)) {
    return normalized;
  }
  const suites = normalized.cryptosuite.filter(suite => typeof suite === 'string');
  delete normalized.cryptosuite;
  if(suites.length === 0) {
    return normalized;
  }
  normalized.cryptosuite = suites[0];
  if(suites.length > 1) {
    normalized.additionalCryptosuites = suites.slice(1);
  }
  return normalized;
}

export function createRequestBody({issuer, vc = validVc, options: optionsOverride}) {
  const {settings: {id, options: issuerOptions} = {}} = issuer;
  const credential = klona(vc);
  credential.id = credential.id || `urn:uuid:${uuidv4()}`;
  if(credential.issuer !== null && typeof credential.issuer === 'object') {
    if(!('id' in credential.issuer && credential.issuer.id === null)) {
      credential.issuer.id = credential.issuer?.id || id;
    }
  } else if(!('issuer' in credential && credential.issuer === null)) {
    credential.issuer = credential?.issuer || id;
  }
  const rawOptions = optionsOverride ?
    {...issuerOptions, ...optionsOverride} :
    issuerOptions;
  const options = normalizeIssueOptions(rawOptions);
  return {credential, options};
}

export function createVerifyRequestBody({verifier, vc, options = {}}) {
  const {settings: {options: instanceOptions} = {}} = verifier;
  return {
    verifiableCredential: vc,
    options: {...instanceOptions, ...options}
  };
}

export function createPresentationRequestBody({
  holder, vcs, presentation, options = {}
}) {
  const {settings: {options: instanceOptions} = {}} = holder;
  const unsignedPresentation = presentation ?? {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: ['VerifiablePresentation'],
    verifiableCredential: vcs
  };
  return {
    presentation: unsignedPresentation,
    options: {...instanceOptions, ...options}
  };
}

/**
 * §3.5.1 derive credential request body.
 *
 * @param {object} options - Options.
 * @param {object} options.holder - Holder endpoint.
 * @param {object} options.vc - Source verifiable credential.
 * @param {object} [options.options] - Derive options.
 * @returns {object} Derive credential request.
 */
export function createDeriveRequestBody({holder, vc, options = {}}) {
  const {settings: {options: instanceOptions} = {}} = holder;
  return {
    verifiableCredential: vc,
    options: {...instanceOptions, ...options}
  };
}

export function createVerifyVpRequestBody({verifier, vp, options = {}}) {
  const {settings: {options: instanceOptions} = {}} = verifier;
  return {
    verifiablePresentation: vp,
    options: {...instanceOptions, ...options}
  };
}

/**
 * §3.4.2 QueryByExample entry for a Verifiable Presentation Request.
 *
 * @returns {object} Query map for a VPR.
 */
export function createQueryByExampleEntry() {
  return {
    type: 'QueryByExample',
    credentialQuery: {
      reason: 'Interop test credential request.',
      example: {
        '@context': ['https://www.w3.org/ns/credentials/v2'],
        type: 'VerifiableCredential'
      },
      acceptedCryptosuites: [
        {cryptosuite: 'bbs-2023'},
        {cryptosuite: 'ecdsa-sd-2023'},
        {cryptosuite: 'eddsa-rdfc-2022'}
      ]
    }
  };
}

/**
 * §3.4.1 Verifiable Presentation Request fixture.
 *
 * @param {object} [options] - Options.
 * @param {object[]} [options.queries] - Query entries.
 * @returns {object} Verifiable Presentation Request object.
 */
export function createVerifiablePresentationRequest({queries} = {}) {
  return {
    query: queries ?? [createQueryByExampleEntry()],
    challenge: `urn:uuid:${uuidv4()}`,
    domain: 'vcalm.test'
  };
}

/**
 * §3.4.3 DID Authentication query fixture.
 *
 * @param {object} [options] - Options.
 * @param {string} [options.challenge] - Challenge string.
 * @param {string} [options.domain] - Domain string.
 * @returns {object} DID Authentication query map.
 */
export function createDidAuthenticationQuery({
  challenge = `urn:uuid:${uuidv4()}`,
  domain = 'vcalm.test'
} = {}) {
  return {
    type: 'DIDAuthentication',
    acceptedMethods: [{method: 'web'}],
    acceptedCryptosuites: [{cryptosuite: 'eddsa-rdfc-2022'}],
    challenge,
    domain
  };
}

/**
 * §3.4.3 DID Authentication response fixture (unsigned VP shell).
 *
 * @param {object} options - Options.
 * @param {string} options.holderDid - Holder DID.
 * @param {string} options.challenge - Challenge from the query.
 * @param {string} options.domain - Domain from the query.
 * @returns {object} Verifiable presentation object.
 */
export function createDidAuthenticationPresentation({
  holderDid,
  challenge,
  domain
}) {
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: ['VerifiablePresentation'],
    holder: holderDid,
    proof: {
      type: 'DataIntegrityProof',
      cryptosuite: 'eddsa-rdfc-2022',
      challenge,
      domain,
      proofPurpose: 'authentication',
      verificationMethod: `${holderDid}#key-1`,
      proofValue: 'z3FXQjecWufY46InteropFixtureProofValue'
    }
  };
}

/**
 * §3.4.5 VPR with grouped queries for AND/OR semantics.
 *
 * @returns {object} Verifiable Presentation Request object.
 */
export function createGroupedQueryPresentationRequest() {
  return createVerifiablePresentationRequest({
    queries: [
      {
        type: 'QueryByExample',
        group: 'credentials',
        credentialQuery: {example: {type: 'VerifiableCredential'}}
      },
      {
        type: 'DIDAuthentication',
        group: 'credentials',
        acceptedMethods: [{method: 'key'}]
      },
      {
        type: 'QueryByExample',
        credentialQuery: {example: {type: 'VerifiableCredential'}}
      }
    ]
  });
}

/**
 * Request body probe for §2.4 unknown-options interop testing.
 *
 * @param {object} issuer - Issuer endpoint.
 * @returns {object} Issue credential request with unknown option.
 */
export function createUnknownOptionIssueBody(issuer) {
  const body = createRequestBody({issuer});
  body.options = {
    ...body.options,
    [UNKNOWN_OPTION_PROBE_KEY]: true
  };
  return body;
}

/**
 * §3.6.1 minimal create-workflow request fixture.
 *
 * @param {object} [options] - Options.
 * @param {string} [options.id] - Workflow id.
 * @param {string} [options.initialStep] - Initial step name.
 * @returns {object} Create workflow request body.
 */
export function createWorkflowRequest({id, initialStep = 'start'} = {}) {
  return {
    id: id ?? `urn:uuid:${uuidv4()}`,
    initialStep,
    steps: {
      start: {
        verifiablePresentationRequest: createVerifiablePresentationRequest()
      }
    }
  };
}

/**
 * §3.6.1 workflow step with issue-request `variables`.
 *
 * @returns {object} Create workflow request body.
 */
export function createWorkflowWithIssueRequestVariables() {
  return {
    id: `urn:uuid:${uuidv4()}`,
    initialStep: 'issue',
    credentialTemplates: [{
      id: 'template-1',
      template: '{"credential":{"type":"VerifiableCredential"}}'
    }],
    steps: {
      issue: {
        issueRequests: [{
          credentialTemplateId: 'template-1',
          variables: {holderName: 'Example Holder'}
        }]
      }
    }
  };
}

/**
 * §3.6.1 workflow step with issue-request `result` JSON pointer.
 *
 * @returns {object} Create workflow request body.
 */
export function createWorkflowWithIssueRequestResult() {
  return {
    id: `urn:uuid:${uuidv4()}`,
    initialStep: 'issue',
    credentialTemplates: [{
      id: 'template-1',
      template: '{"credential":{"type":"VerifiableCredential"}}'
    }],
    steps: {
      issue: {
        issueRequests: [{
          credentialTemplateId: 'template-1',
          result: '/variables/issuedCredential'
        }]
      }
    }
  };
}

/**
 * First issue request object from a workflow configuration fixture.
 *
 * @param {object} workflow - Workflow configuration.
 * @returns {object|undefined} Issue request map.
 */
export function extractIssueRequest(workflow) {
  for(const step of Object.values(workflow.steps ?? {})) {
    if(step?.issueRequests?.[0]) {
      return step.issueRequests[0];
    }
  }
  return undefined;
}

/**
 * §3.2.1 issue request where the credential already contains a proof.
 *
 * @param {object} issuer - Issuer endpoint.
 * @returns {object} Issue credential request body.
 */
export function createIssueRequestWithExistingProof(issuer) {
  const credential = klona(validVc);
  credential.id = credential.id || `urn:uuid:${uuidv4()}`;
  credential.proof = {
    type: 'DataIntegrityProof',
    cryptosuite: 'eddsa-rdfc-2022',
    proofPurpose: 'assertionMethod',
    verificationMethod: 'did:example:holder#key-1',
    proofValue: 'zExistingHolderProofValue'
  };
  return createRequestBody({issuer, vc: credential});
}

/**
 * §3.6.3 minimal create-exchange request fixture.
 *
 * @returns {object} Create exchange request body.
 */
export function createExchangeRequest() {
  return {variables: {}};
}

/**
 * §3.7.1 interaction URL fixture.
 *
 * @param {object} [options] - Options.
 * @param {string} [options.baseUrl] - Instance root URL.
 * @param {string} [options.interactionId] - Interaction id.
 * @returns {string} Interaction start URL.
 */
export function createInteractionUrl({
  baseUrl = 'https://vcalm.example',
  interactionId = 'urn:uuid:interaction-fixture'
} = {}) {
  return resolveInteractionStartUrl(baseUrl, interactionId);
}

/**
 * §3.7.4 protocols object fixture (`inviteRequest` and/or `vcapi`).
 *
 * @returns {object} Protocols response body.
 */
export function createInteractionProtocolsFixture() {
  return {
    inviteRequest:
      'https://website.example/invitation/87654321/invite-request/response',
    vcapi:
      'https://vcapi.example/workflows/z1A1FjMfnG/exchanges/z19mxakBFecZ'
  };
}

/**
 * §3.7.5 inviteResponse fixture.
 *
 * @returns {object} Invite response request body.
 */
export function createInviteResponseFixture() {
  return {
    url: 'https://website.example/checkout/8372974',
    purpose: 'VCALM interop test interaction',
    referenceId: `urn:uuid:${uuidv4()}`
  };
}

const problemDetailFixture = {
  type: 'https://www.w3.org/TR/vc-data-model-2.0/#CRYPTOGRAPHIC_SECURITY_ERROR',
  title: 'CRYPTOGRAPHIC_SECURITY_ERROR',
  detail: 'Proof verification failed.'
};

const unknownOptionProblemDetailFixture = {
  type: 'https://www.w3.org/TR/vcalm#UNKNOWN_OPTION_PROVIDED',
  title: 'UNKNOWN_OPTION_PROVIDED',
  detail: 'An unknown option was provided to the API call.'
};

const warningFixture = {
  type: 'https://www.w3.org/TR/vc-data-model-2.0/#VALID_UNTIL_WARNING',
  title: 'VALID_UNTIL_WARNING',
  detail: 'Credential is past validUntil.'
};

/**
 * §3.8.1 verification result fixture.
 *
 * @param {object} [options] - Options.
 * @param {boolean} [options.verified] - Overall verification assertion.
 * @param {object[]} [options.errors] - Verification errors.
 * @param {object[]} [options.warnings] - Verification warnings.
 * @returns {object} Verification result object.
 */
export function createVerificationResultFixture({
  verified = true,
  errors = [],
  warnings = []
} = {}) {
  return {verified, errors, warnings};
}

export {
  problemDetailFixture,
  unknownOptionProblemDetailFixture,
  warningFixture
};

/**
 * Tamper an issued credential so verification should fail.
 *
 * @param {object} issuedVc - Issued verifiable credential.
 * @returns {object} Tampered verifiable credential.
 */
export function createTamperedVerifiableCredential(issuedVc) {
  const tampered = klona(issuedVc);
  if(tampered.proof?.proofValue) {
    tampered.proof.proofValue = `${tampered.proof.proofValue}x`;
  } else if(tampered.proof) {
    delete tampered.proof.proofValue;
  }
  return tampered;
}

/**
 * Credential with understood and unrecognized proof types (Appendix B).
 *
 * @returns {object} Verifiable credential fixture.
 */
export function createCredentialWithMixedProofTypes() {
  const credential = klona(validVc);
  credential.proof = [
    {
      type: 'DataIntegrityProof',
      cryptosuite: 'eddsa-rdfc-2022',
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:example:holder#key-1',
      proofValue: 'zUnderstoodProofValue'
    },
    {
      type: 'UnknownInteropProof2026',
      proofValue: 'zUnknownProofValue'
    }
  ];
  return credential;
}
