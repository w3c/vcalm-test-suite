/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

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
