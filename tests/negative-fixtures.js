/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {createRequire} from 'node:module';
import {klona} from 'klona';

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
    title:
      'POST /credentials/issue with a missing credential property returns a ' +
      'client error.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#issue-credential',
    body: createIssueBodyMissingCredential()
  },
  {
    id: 'emptyBody',
    title:
      'POST /credentials/issue with an empty request body returns a client ' +
      'error.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#issue-credential',
    body: createIssueBodyEmpty()
  },
  {
    id: 'credentialWithoutType',
    title:
      'POST /credentials/issue with a credential missing type returns a ' +
      'client error.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#issue-credential',
    body: createIssueBodyCredentialWithoutType()
  }
];

export const VERIFY_CREDENTIAL_NEGATIVE_CASES = [
  {
    id: 'foreignReference',
    title:
      'POST /credentials/verify returns verified:false for a reference ' +
      'credential not issued by this service.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: loadReferenceForeignVc,
    options: verifyOptions
  },
  {
    id: 'withoutProof',
    title:
      'POST /credentials/verify returns verified:false for a credential ' +
      'without proof.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: createVerifyCredentialWithoutProof,
    options: verifyOptions
  },
  {
    id: 'emptyObject',
    title:
      'POST /credentials/verify returns verified:false for an empty ' +
      'verifiable credential object.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: createVerifyCredentialEmptyObject,
    options: verifyOptions
  },
  {
    id: 'wrongType',
    title:
      'POST /credentials/verify returns verified:false for a credential with ' +
      'an invalid type.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-credential',
    credential: createVerifyCredentialWrongType,
    options: verifyOptions
  }
];

export const VERIFY_PRESENTATION_NEGATIVE_CASES = [
  {
    id: 'foreignReference',
    title:
      'POST /presentations/verify returns verified:false for a reference ' +
      'presentation not created by this service.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#verify-presentation',
    presentation: loadReferenceForeignVp,
    options: verifyOptions
  },
  {
    id: 'withoutProof',
    title:
      'POST /presentations/verify returns verified:false for a presentation ' +
      'without proof.',
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
    title:
      'POST /workflows with invalid steps returns a client error.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#create-workflow',
    body: createWorkflowBodyStepsNotObject()
  },
  {
    id: 'missingSteps',
    title:
      'POST /workflows without steps returns a client error.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#create-workflow',
    body: createWorkflowBodyMissingSteps()
  }
];

export const WORKFLOW_EXCHANGE_NEGATIVE_CASES = [
  {
    id: 'unknownWorkflow',
    title:
      'POST exchanges for an unknown workflow returns a client error.',
    link: 'https://www.w3.org/TR/vcalm-1.0/#create-exchange',
    workflowId: 'urn:uuid:00000000-0000-4000-8000-000000009999'
  }
];
