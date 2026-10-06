/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const {errorHandling} = NORMATIVE;

describeSkippedSection({
  section: 'Error Handling',
  link: `${TR}#error-handling`,
  statements: [
    errorHandling.problemDetailsTypePresent,
    errorHandling.problemDetailsType
  ]
});

describeSkippedSection({
  section: 'Verification Errors vs. Warnings',
  columnLabel: 'Error Handling',
  link: `${TR}#verification-errors-vs-warnings`,
  statements: [
    errorHandling.verifiedFalse,
    errorHandling.verifiedTrue
  ]
});
