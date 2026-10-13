/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

/**
 * @param {object} value - Candidate credential.
 * @returns {boolean} Whether value is a verifiable credential object.
 */
function isVerifiableCredential(value) {
  if(value == null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const types = Array.isArray(value.type) ? value.type : [value.type];
  return types.includes('VerifiableCredential');
}

/**
 * Read the issued credential from a VCALM response body.
 *
 * @param {object} data - Parsed JSON response body.
 * @returns {object|undefined} The issued verifiable credential.
 */
export function extractIssuedCredential(data) {
  if(data == null || typeof data !== 'object' || Array.isArray(data)) {
    return undefined;
  }
  if(isVerifiableCredential(data.verifiableCredential)) {
    return data.verifiableCredential;
  }
  // vc-test-suite-implementations unwraps `verifiableCredential` before
  // the suite sees the body. The credential itself is then the payload.
  if(isVerifiableCredential(data)) {
    return data;
  }
  return undefined;
}

/**
 * Read the created presentation from a VCALM response body.
 *
 * @param {object} data - Parsed JSON response body.
 * @returns {object|undefined} The `verifiablePresentation` value when present.
 */
export function extractCreatedPresentation(data) {
  if(data == null || typeof data !== 'object') {
    return undefined;
  }
  return data.verifiablePresentation;
}

/**
 * Read the last path segment from a `Location` response header.
 *
 * @param {object} result - Sanitized HTTP response.
 * @returns {string|undefined} Resource id from the header.
 */
export function extractLocationResourceId(result) {
  const location = result?.headers?.get?.('location') ??
    result?.headers?.get?.('Location');
  if(!location) {
    return undefined;
  }
  const pathname = location.startsWith('http') ?
    new URL(location).pathname :
    location;
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1];
}
