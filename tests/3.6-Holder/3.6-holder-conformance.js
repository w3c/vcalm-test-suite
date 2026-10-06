/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const link = `${TR}#conformance`;

describeSkippedSection({
  section: 'Get Exchange Protocols',
  columnLabel: 'Holder',
  property: 'holders',
  link,
  statements: [NORMATIVE.conformance.getExchangeProtocols]
});

describeSkippedSection({
  section: 'Participate in an Exchange',
  columnLabel: 'Holder',
  property: 'holders',
  link,
  statements: [NORMATIVE.conformance.participateInExchange]
});
