/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const {interactions} = NORMATIVE;

describeSkippedSection({
  section: 'Interaction URL Format',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-url-format`,
  statements: [
    interactions.interactionUrl,
    interactions.interactionUrlVersion
  ]
});

describeSkippedSection({
  section: 'Interaction QR Code Format',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-qr-code-format`,
  statements: [
    interactions.qrCode,
    interactions.qrCodeMaxLength
  ]
});

describeSkippedSection({
  section: 'Interaction Scheme Format',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-scheme-format`,
  statements: [interactions.scheme]
});

describeSkippedSection({
  section: 'Interaction Protocols Response',
  columnLabel: 'Interactions',
  link: `${TR}#interaction-protocols-response`,
  statements: [
    interactions.protocolsJson,
    interactions.protocolsHtml
  ]
});

describeSkippedSection({
  section: 'vcapi Interaction Protocol',
  columnLabel: 'Interactions',
  link: `${TR}#vcapi-interaction-protocol`,
  statements: [
    interactions.digitalCredentialsRequest,
    interactions.digitalCredentialsFetch
  ]
});
