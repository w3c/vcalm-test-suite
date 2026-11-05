/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

describeSkippedSection({
  section: 'Verifiable Presentation Request',
  columnLabel: 'Requesting a Presentation',
  link: `${TR}#verifiable-presentation-request`,
  statements: [
    NORMATIVE['3-4-1-verifiable-presentation-request-1'],
    NORMATIVE['3-4-1-verifiable-presentation-request-2']
  ]
});
