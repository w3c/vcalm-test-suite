/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const {interactions} = NORMATIVE;

describeSkippedSection({
  section: 'Interactions',
  statements: [
    {
      statement: interactions.interactionUrl,
      link: `${TR}#interaction-url-format`
    },
    {
      statement: interactions.interactionUrlVersion,
      link: `${TR}#interaction-url-format`
    },
    {
      statement: interactions.qrCode,
      link: `${TR}#interaction-qr-code-format`
    },
    {
      statement: interactions.qrCodeMaxLength,
      link: `${TR}#interaction-qr-code-format`
    },
    {
      statement: interactions.scheme,
      link: `${TR}#interaction-scheme-format`
    },
    {
      statement: interactions.protocolsJson,
      link: `${TR}#interaction-protocols-response`
    },
    {
      statement: interactions.protocolsHtml,
      link: `${TR}#interaction-protocols-response`
    },
    {
      statement: interactions.digitalCredentialsRequest,
      link: `${TR}#initiating-interactions`
    },
    {
      statement: interactions.digitalCredentialsFetch,
      link: `${TR}#initiating-interactions`
    }
  ]
});
