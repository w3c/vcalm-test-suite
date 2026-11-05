/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const link = `${TR}#conformance`;

describeSkippedSection({
  section: 'Conformance',
  columnLabel: 'Holder',
  property: 'holders',
  link,
  statements: [NORMATIVE['1-3-conformance-5']]
});

describeSkippedSection({
  section: 'Conformance',
  columnLabel: 'Holder',
  property: 'holders',
  link,
  statements: [NORMATIVE['1-3-conformance-5']]
});
