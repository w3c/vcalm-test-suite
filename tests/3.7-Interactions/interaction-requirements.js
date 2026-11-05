/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

describeSkippedSection({
  section: 'Interaction URL Format',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-url-format`,
  statements: [
    NORMATIVE['3-7-1-interaction-url-format-1'],
    NORMATIVE['3-7-1-interaction-url-format-1']
  ]
});

describeSkippedSection({
  section: 'Interaction QR Code Format',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-qr-code-format`,
  statements: [
    NORMATIVE['3-7-2-interaction-qr-code-format-1'],
    NORMATIVE['3-7-2-interaction-qr-code-format-2']
  ]
});

describeSkippedSection({
  section: 'Interaction Scheme Format',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-scheme-format`,
  statements: [NORMATIVE['3-7-3-interaction-scheme-format-1']]
});

describeSkippedSection({
  section: 'Interaction Protocols Response',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-protocols-response`,
  statements: [
    NORMATIVE['3-7-4-interaction-protocols-response-1'],
    NORMATIVE['3-7-4-interaction-protocols-response-2']
  ]
});

describeSkippedSection({
  section: 'vcapi Interaction Protocol',
  columnLabel: 'Interactions',
  link: `${TR}#vcapi-interaction-protocol`,
  statements: [
    NORMATIVE['3-6-5-get-current-exchange-vpr-4'],
    NORMATIVE['3-6-5-get-current-exchange-vpr-5']
  ]
});
