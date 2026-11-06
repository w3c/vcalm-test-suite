/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// REQUIRED fields of a create-workflow request. The OpenAPI schema has no
// `required` list, so this checks the server rejects a request that omits
// each field. See ../overlay.js.

import {createWorkflowRequest} from '../mock.data.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {shouldRejectMalformedWorkflowRequest} from '../assertions.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'workflows', tags: [VCALM_TAG]});

function withoutField(field) {
  const body = {...createWorkflowRequest()};
  delete body[field];
  return body;
}

function rejectsRequestWithout(field) {
  return {
    name: `negative: a create request without "${field}" is rejected`,
    run: async ({endpoints}) => {
      const created = await endpoints.createWorkflowWithBody(
        withoutField(field));
      shouldRejectMalformedWorkflowRequest({
        result: created.result ?? created.error?.response
      });
    }
  };
}

describeNormativeStatement({
  section: '3.6.1 Create Workflow',
  match,
  columnLabel: 'Workflow',
  statements: [{
    statement: NORMATIVE['3-6-1-create-workflow-2'],
    link: `${TR}#create-workflow`,
    subtests({endpoints}) {
      return [rejectsRequestWithout('initialStep')].map(item => ({
        ...item,
        run: () => item.run({endpoints})
      }));
    }
  }, {
    statement: NORMATIVE['3-6-1-create-workflow-6'],
    link: `${TR}#create-workflow`,
    subtests({endpoints}) {
      return [rejectsRequestWithout('steps')].map(item => ({
        ...item,
        run: () => item.run({endpoints})
      }));
    }
  }]
});
