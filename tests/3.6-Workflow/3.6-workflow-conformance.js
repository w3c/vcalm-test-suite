/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {VCALM_TAG} from '../helpers.js';

const tag = VCALM_TAG;
const {match} = filterByTag({property: 'workflows', tags: [tag]});
const link = 'https://www.w3.org/TR/vcalm-1.0/#conformance';

describeNormativeStatement({
  section: 'Workflow',
  statement: NORMATIVE.conformance.workflow,
  link,
  match,
  columnLabel: 'Workflow',
  unimplemented: true
});
