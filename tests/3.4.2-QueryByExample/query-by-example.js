/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

// Every normative statement in section 3.4.2 of the spec, in document order.
const statements = Object.keys(NORMATIVE)
  .filter(key => key.startsWith('3-4-2-'))
  .map(key => NORMATIVE[key]);

describeSkippedSection({
  section: 'Query By Example',
  link: `${TR}#query-by-example`,
  statements
});
