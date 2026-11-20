/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {createRequire} from 'node:module';
import {klona} from 'klona';
import {v4 as uuidv4} from 'uuid';
const require = createRequire(import.meta.url);
const validVc = require('./validVc.json');

// Option name sent to probe how an endpoint handles unknown options. It is a
// test input, not a spec statement.
export const UNKNOWN_OPTION_PROBE_KEY = 'vcalmInteropUnknownOptionProbe';

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
  const suites = normalized.cryptosuite.filter(
    suite => typeof suite === 'string');
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

export function createRequestBody({
  issuer, vc = validVc, options: optionsOverride
}) {
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
 * Merge implementation-supplied create options into a workflow request, as
 * issuer options are merged into issue requests. Options take precedence, and
 * a `null` value removes that key, so `id: null` lets the server generate the
 * workflow ID. Options are implementation-specific, not part of the spec.
 *
 * @param {object} options - Options.
 * @param {object} options.body - The create workflow request body.
 * @param {object} [options.options] - Implementation-supplied options.
 * @returns {object} The request body to send.
 */
export function applyWorkflowOptions({body, options = {}} = {}) {
  const merged = {...body, ...options};
  for(const key of Object.keys(merged)) {
    if(merged[key] === null) {
      delete merged[key];
    }
  }
  return merged;
}

/**
 * §3.6.3 minimal create-exchange request fixture.
 *
 * @returns {object} Create exchange request body.
 */
export function createExchangeRequest() {
  return {variables: {}};
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

export {
  problemDetailFixture,
  unknownOptionProblemDetailFixture,
  warningFixture
};
