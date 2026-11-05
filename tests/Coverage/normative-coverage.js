/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Results matrix rows for every MUST and REQUIRED statement in the spec.
// A statement with a live test in another file is listed in LIVE and gets no
// extra row here. Add a key to LIVE when a test starts covering it.
import {describeSkippedSection} from '../skipped-section.js';
import {NORMATIVE, REQUIRED, SECTION} from '../normative-statements.js';

const LIVE = new Set([
  '1-3-conformance-1',
  '1-3-conformance-3',
  '1-3-conformance-5',
  '1-3-conformance-7',
  '1-3-conformance-8',
  '1-3-conformance-9',
  'forbidden-authorization-1',
  'options-5',
  'content-serialization-1',
  '3-2-1-issue-credential-9',
  '3-4-1-verifiable-presentation-request-1',
  '3-4-1-verifiable-presentation-request-2',
  '3-6-1-create-workflow-22',
  '3-6-5-get-current-exchange-vpr-1',
  '3-6-5-get-current-exchange-vpr-3',
  '3-6-5-get-current-exchange-vpr-4',
  '3-6-5-get-current-exchange-vpr-5',
  '3-7-1-interaction-url-format-1',
  '3-7-2-interaction-qr-code-format-1',
  '3-7-2-interaction-qr-code-format-2',
  '3-7-3-interaction-scheme-format-1',
  '3-7-4-interaction-protocols-response-1',
  '3-7-4-interaction-protocols-response-2',
  '3-8-error-handling-1',
  '3-8-1-verification-errors-vs-warnings-1',
  '3-8-1-verification-errors-vs-warnings-2',
]);

const bySection = new Map();
for(const key of REQUIRED) {
  if(LIVE.has(key)) {
    continue;
  }
  if(!bySection.has(SECTION[key])) {
    bySection.set(SECTION[key], []);
  }
  bySection.get(SECTION[key]).push(NORMATIVE[key]);
}
for(const [section, statements] of bySection) {
  describeSkippedSection({section, statements});
}
