/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import chai from 'chai';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {shouldCreateWorkflow} from '../assertions.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const should = chai.should();
const {match} = filterByTag({property: 'workflows', tags: [VCALM_TAG]});

describeNormativeStatement({
  section: '3.6.2 Get Workflow Configuration',
  match,
  columnLabel: 'Workflow',
  statements: [{
    statement: NORMATIVE['3-6-2-get-workflow-configuration-1'],
    link: `${TR}#get-workflow-configuration`,
    subtests({endpoints}) {
      return [{
        name: 'positive: a workflow configuration has an initialStep',
        run: async () => {
          const created = await endpoints.createWorkflow();
          shouldCreateWorkflow(created);
          const {data} = await endpoints.getWorkflowConfiguration(
            created.workflowId);
          should.exist(data, 'Expected a workflow configuration.');
          data.initialStep.should.be.a('string').and.not.be.empty;
        }
      }];
    }
  }]
});
