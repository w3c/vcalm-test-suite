/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {VCALM_TAG} from '../helpers.js';

const tag = VCALM_TAG;
const {match} = filterByTag({property: 'workflows', tags: [tag]});
const tr = 'https://www.w3.org/TR/vcalm-1.0/';

describeNormativeStatement({
  section: 'Workflow',
  match,
  columnLabel: 'Workflow',
  statements: [
    {
      statement: NORMATIVE.conformance.workflow,
      link: `${tr}#conformance`,
      skip: true,
      skipMessage: 'Skipped.'
    },
    {
      statement: NORMATIVE.workflows.issueRequestResult,
      link: `${tr}#create-workflow`,
      skip: true,
      skipMessage: 'Skipped.'
    },
    {
      statement: NORMATIVE.workflows.getCurrentVpr,
      link: `${tr}#get-current-exchange-vpr`,
      skip: true,
      skipMessage: 'Skipped.'
    },
    {
      statement: NORMATIVE.workflows.getCurrentVprEmpty,
      link: `${tr}#get-current-exchange-vpr`,
      skip: true,
      skipMessage: 'Skipped.'
    }
  ]
});
