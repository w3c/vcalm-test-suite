/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

describeSkippedSection({
  section: 'Service client',
  link: `${TR}#conformance`,
  statements: [NORMATIVE.conformance.serviceClient]
});
