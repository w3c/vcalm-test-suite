/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

describeSkippedSection({
  section: 'Conformance',
  columnLabel: 'Workflow',
  property: 'workflows',
  link: `${TR}#conformance`,
  statements: [NORMATIVE['1-3-conformance-8']]
});

describeSkippedSection({
  section: 'Create Workflow',
  columnLabel: 'Workflow',
  property: 'workflows',
  link: `${TR}#create-workflow`,
  statements: [NORMATIVE['3-6-1-create-workflow-22']]
});

describeSkippedSection({
  section: 'Get Current Exchange VPR',
  columnLabel: 'Workflow',
  property: 'workflows',
  link: `${TR}#get-current-exchange-vpr`,
  statements: [
    NORMATIVE['3-6-5-get-current-exchange-vpr-1'],
    NORMATIVE['3-6-5-get-current-exchange-vpr-3']
  ]
});
