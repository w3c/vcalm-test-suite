/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

// Every normative statement in section 3.4.3 of the spec, in document order.
// Statements under 3.4.3.1 link to the query format, 3.4.3.2 to the response.
const statements = Object.keys(NORMATIVE)
  .filter(key => key.startsWith('3-4-3-'))
  .map(key => ({
    statement: NORMATIVE[key],
    link: key.startsWith('3-4-3-1-')
      ? `${TR}#the-did-authentication-query-format`
      : `${TR}#the-did-authentication-response-format`
  }));

describeSkippedSection({
  section: 'DID Authentication',
  statements
});
