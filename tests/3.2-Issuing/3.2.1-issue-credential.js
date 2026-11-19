/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {VCALM_TAG} from '../helpers.js';

const tag = VCALM_TAG;
const {match} = filterByTag({property: 'issuers', tags: [tag]});

describeNormativeStatement({
  section: 'Issue Credential',
  match,
  columnLabel: 'Issuer',
  statements: [
    {
      statement: NORMATIVE['3-2-1-issue-credential-1'],
      link: 'https://www.w3.org/TR/vcalm-1.0/#issue-credential',
      skip: true,
      skipMessage: 'Skipped.'
    }
  ]
});
