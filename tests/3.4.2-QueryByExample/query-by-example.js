/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const {requestingPresentation: query} = NORMATIVE;

describeSkippedSection({
  section: 'Query By Example',
  link: `${TR}#query-by-example`,
  statements: [
    query.acceptedIssuerItem,
    query.matchAlgorithm,
    query.acceptedIssuerMatch,
    query.emptyStringExists,
    query.emptyMapExists,
    query.emptyListExists,
    query.listElementMap,
    query.listElementMatch,
    query.primitiveMatch,
    query.noPartialNumericCoercion,
    {
      statement: query.selectiveDisclosureAlgorithm,
      link: `${TR}#converting-querybyexample-to-json-pointers`
    }
  ]
});
