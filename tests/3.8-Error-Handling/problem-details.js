/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const {errorHandling} = NORMATIVE;

describeSkippedSection({
  section: 'Error Handling',
  statements: [
    {
      statement: errorHandling.problemDetailsTypePresent,
      link: `${TR}#error-handling`
    },
    {
      statement: errorHandling.problemDetailsType,
      link: `${TR}#error-handling`
    },
    {
      statement: errorHandling.verifiedFalse,
      link: `${TR}#verification-errors-vs-warnings`
    },
    {
      statement: errorHandling.verifiedTrue,
      link: `${TR}#verification-errors-vs-warnings`
    }
  ]
});
