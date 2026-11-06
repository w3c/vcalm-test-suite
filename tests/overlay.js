/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Constraints the published OpenAPI schema does not express, taken from the
// prose of the spec. They are checked in test code, not in the schema, so the
// spec is unchanged. Remove an entry here once the schema expresses it.

/**
 * Lists the items of a credential array field (such as `@context` or `type`)
 * that are not strings.
 *
 * @param {object} credential - A Verifiable Credential object.
 * @param {string} field - The field name, `@context` or `type`.
 * @returns {Array<string>} One message per problem.
 */
export function findNonStringItems(credential, field) {
  const value = credential?.[field];
  if(value === undefined) {
    return [`"${field}" is missing`];
  }
  // the item rule only applies when the field is an array
  if(!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item, index) => typeof item === 'string' ?
      null : `"${field}" item ${index} is not a string`)
    .filter(Boolean);
}
