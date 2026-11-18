/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Create-workflow requirements, checked as part of the workflow service's
// interface conformance. Each check sends a valid workflow with a required
// field removed, or with one item replaced by a string, and expects the server
// to reject it. The OpenAPI schema defines the shapes.

import {createWorkflowRequest} from '../mock.data.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {shouldRejectMalformedWorkflowRequest} from '../assertions.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'workflows', tags: [VCALM_TAG]});

// A valid workflow, changed by `mutate`, must be rejected.
function rejectsWith(endpoints, label, mutate) {
  return {
    name: `negative: ${label}`,
    run: async () => {
      const body = mutate(createWorkflowRequest());
      const created = await endpoints.createWorkflowWithBody(body);
      shouldRejectMalformedWorkflowRequest({
        result: created.result ?? created.error?.response
      });
    }
  };
}

const presentationRequest = body =>
  body.steps.start.verifiablePresentationRequest;

describeNormativeStatement({
  section: 'Conformance',
  match,
  columnLabel: 'Workflow',
  statements: [{
    statement: NORMATIVE['1-3-conformance-8'],
    link: `${TR}#conformance`,
    subtests({endpoints}) {
      return [
        rejectsWith(endpoints, 'a create request without initialStep', body => {
          delete body.initialStep;
          return body;
        }),
        rejectsWith(endpoints, 'a create request without steps', body => {
          delete body.steps;
          return body;
        }),
        rejectsWith(endpoints,
          'a credentialTemplates item that is not an object',
          body => ({...body, credentialTemplates: ['x']})),
        rejectsWith(endpoints, 'a query item that is not an object', body => {
          presentationRequest(body).query = ['x'];
          return body;
        }),
        rejectsWith(endpoints,
          'an acceptedIssuers item that is not an object',
          body => {
            presentationRequest(body).query[0].credentialQuery
              .acceptedIssuers = ['x'];
            return body;
          }),
        rejectsWith(endpoints,
          'an interact item that is not an object',
          body => {
            presentationRequest(body).interact = ['x'];
            return body;
          }),
        rejectsWith(endpoints,
          'an issueRequests item that is not an object',
          body => {
            body.steps.start.issueRequests = ['x'];
            return body;
          })
      ];
    }
  }]
});
