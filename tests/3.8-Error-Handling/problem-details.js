/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

describeSkippedSection({
  section: 'Error Handling',
  link: `${TR}#error-handling`,
  statements: [
    NORMATIVE['3-8-error-handling-1'],
    NORMATIVE['3-8-error-handling-1']
  ]
});

describeSkippedSection({
  section: 'Verification Errors vs. Warnings',
  columnLabel: 'Error Handling',
  link: `${TR}#verification-errors-vs-warnings`,
  statements: [
    NORMATIVE['3-8-1-verification-errors-vs-warnings-1'],
    NORMATIVE['3-8-1-verification-errors-vs-warnings-2']
  ]
});
