/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {createRequire} from 'node:module';
import {klona} from 'klona';
import {NORMATIVE} from './normative-statements.js';

const require = createRequire(import.meta.url);
const referenceForeignVc = require('./fixtures/reference-foreign-vc.json');
const referenceForeignVp = require('./fixtures/reference-foreign-vp.json');

export function loadReferenceForeignVc() {
  return klona(referenceForeignVc);
}

export function loadReferenceForeignVp() {
  return klona(referenceForeignVp);
}

export function createIssueBodyMissingCredential() {
  return {options: {}};
}

export function createIssueBodyEmpty() {
  return {};
}

export function createIssueBodyCredentialWithoutType() {
  return {
    credential: {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      credentialSubject: {id: 'did:example:negative-test'}
    }
  };
}

export function createVerifyCredentialWithoutProof() {
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: ['VerifiableCredential'],
    issuer: 'did:example:negative-test-issuer',
    credentialSubject: {id: 'did:example:negative-test-subject'}
  };
}

export function createVerifyCredentialEmptyObject() {
  return {};
}

export function createVerifyCredentialWrongType() {
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: ['NotAVerifiableCredential'],
    proof: {type: 'DataIntegrityProof', proofValue: 'zExample'}
  };
}

export function createVerifyPresentationWithoutProof() {
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2'],
    type: ['VerifiablePresentation'],
    holder: 'did:example:negative-test-holder'
  };
}

export function createConformanceProbeIssueBody() {
  return createIssueBodyMissingCredential();
}

export function createConformanceProbeVerifyCredentialBody() {
  return {
    verifiableCredential: createVerifyCredentialWithoutProof(),
    options: {}
  };
}

export function createConformanceProbeVerifyPresentationBody() {
  return {
    verifiablePresentation: createVerifyPresentationWithoutProof(),
    options: {}
  };
}

const verifyOptions = {returnProblemDetails: true};

export const ISSUE_NEGATIVE_CASES = [
  {
    id: 'missingCredential',
    title: NORMATIVE.negative.issueMissingCredential,
    link: 'https://www.w3.org/TR/vcalm-1.0/#issue-credential',
    body: createIssueBodyMissingCredential()
  },
  {
    id: 'emptyBody',
    title: NORMATIVE.negative.issueEmptyBody,
    link: 'https://www.w3.org/TR/vcalm-1.0/#issue-credential',
    body: createIssueBodyEmpty()
  },
  {
    id: 'credentialWithoutType',
    title: NORMATIVE.negative.issueCredentialWithoutType,
    link: 'https://www.w3.org/TR/vcalm-1.0/#issue-credential',
    body: createIssueBodyCredentialWithoutType()
  }
];

export const VERIFY_CREDENTIAL_NEGATIVE_CASES = [
  {
    id: 'foreignReference',
    title: NORMATIVE.negative.verifyForeignCredential,
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: loadReferenceForeignVc,
    options: verifyOptions
  },
  {
    id: 'withoutProof',
    title: NORMATIVE.negative.verifyCredentialWithoutProof,
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: createVerifyCredentialWithoutProof,
    options: verifyOptions
  },
  {
    id: 'emptyObject',
    title: NORMATIVE.negative.verifyCredentialEmpty,
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: createVerifyCredentialEmptyObject,
    options: verifyOptions
  },
  {
    id: 'wrongType',
    title: NORMATIVE.negative.verifyCredentialInvalidType,
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: createVerifyCredentialWrongType,
    options: verifyOptions
  }
];

export const VERIFY_PRESENTATION_NEGATIVE_CASES = [
  {
    id: 'foreignReference',
    title: NORMATIVE.negative.verifyForeignPresentation,
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-presentation',
    presentation: loadReferenceForeignVp,
    options: verifyOptions
  },
  {
    id: 'withoutProof',
    title: NORMATIVE.negative.verifyPresentationWithoutProof,
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-presentation',
    presentation: createVerifyPresentationWithoutProof,
    options: verifyOptions
  }
];

export function createWorkflowBodyStepsNotObject() {
  return {
    id: 'urn:uuid:00000000-0000-4000-8000-000000000001',
    initialStep: 'start',
    steps: 'not-a-steps-object'
  };
}

export function createWorkflowBodyMissingSteps() {
  return {
    id: 'urn:uuid:00000000-0000-4000-8000-000000000002',
    initialStep: 'start'
  };
}

export const WORKFLOW_NEGATIVE_CASES = [
  {
    id: 'stepsNotObject',
    title: NORMATIVE.negative.workflowStepsNotObject,
    link: 'https://www.w3.org/TR/vcalm-1.0/#create-workflow',
    body: createWorkflowBodyStepsNotObject()
  },
  {
    id: 'missingSteps',
    title: NORMATIVE.negative.workflowMissingSteps,
    link: 'https://www.w3.org/TR/vcalm-1.0/#create-workflow',
    body: createWorkflowBodyMissingSteps()
  }
];

export const WORKFLOW_EXCHANGE_NEGATIVE_CASES = [
  {
    id: 'unknownWorkflow',
    title: NORMATIVE.negative.workflowExchangeUnknownWorkflow,
    link: 'https://www.w3.org/TR/vcalm-1.0/#create-exchange',
    workflowId: 'urn:uuid:00000000-0000-4000-8000-000000009999'
  }
];
