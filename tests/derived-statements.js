/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Statements this suite derives from the spec. They are NOT spec text: the
// TR states both interfaces in one sentence (NORMATIVE['1-3-conformance-3']),
// which stays in tests/normative-statements.js unchanged. The two entries
// below split that sentence so each verifier endpoint has its own row.
export const DERIVED = {
  verifyCredential:
    'A conforming verifier service implementation MUST provide the interface ' +
    'described in Section 3.3.1 Verify Credential',
  verifyPresentation:
    'A conforming verifier service implementation MUST provide the interface ' +
    'described in Section 3.3.2 Verify Presentation'
};
