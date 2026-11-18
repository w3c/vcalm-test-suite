/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  shouldCreateWorkflow,
  shouldGetWorkflowConfiguration
} from '../assertions.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'workflows', tags: [VCALM_TAG]});

describeNormativeStatement({
  section: 'Conformance',
  match,
  columnLabel: 'Workflow',
  statements: [{
    statement: NORMATIVE['1-3-conformance-8'],
    link: `${TR}#get-workflow-configuration`,
    subtests({endpoints}) {
      return [{
        name: 'positive: GET of a created workflow returns its ' +
          'configuration',
        run: async () => {
          const created = await endpoints.createWorkflow();
          shouldCreateWorkflow(created);
          // GetWorkflowResponse has no required properties, so initialStep
          // and steps are checked only when present
          shouldGetWorkflowConfiguration(
            await endpoints.getWorkflowConfiguration(created.workflowId));
        }
      }];
    }
  }]
});
