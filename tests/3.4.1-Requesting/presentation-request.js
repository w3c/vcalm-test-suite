/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const {requestingPresentation: query} = NORMATIVE;

describeSkippedSection({
  section: 'Requesting a Presentation',
  link: `${TR}#verifiable-presentation-request`,
  statements: [
    query.queryRequired,
    query.queryValue,
    query.queryMapType
  ]
});
