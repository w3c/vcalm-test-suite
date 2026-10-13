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
  statements: [NORMATIVE.conformance.workflow]
});

describeSkippedSection({
  section: 'Create Workflow',
  columnLabel: 'Workflow',
  property: 'workflows',
  link: `${TR}#create-workflow`,
  statements: [NORMATIVE.workflows.issueRequestResult]
});

describeSkippedSection({
  section: 'Get Current Exchange VPR',
  columnLabel: 'Workflow',
  property: 'workflows',
  link: `${TR}#get-current-exchange-vpr`,
  statements: [
    NORMATIVE.workflows.getCurrentVpr,
    NORMATIVE.workflows.getCurrentVprEmpty
  ]
});
