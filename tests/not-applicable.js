/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

/**
 * Thrown by a check whose condition the implementation's response does not
 * let the suite observe (for example, a status the OpenAPI lists that carries
 * no body). The statement's cell is then recorded as skipped with this
 * reason, not passed.
 */
export class NotApplicable extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotApplicable';
  }
}

/**
 * Require an id the suite needs to address a resource.
 *
 * @param {string|undefined} id - The id.
 * @param {string} what - What the id names, for the message.
 * @returns {string} The id.
 */
export function requireResourceId(id, what) {
  if(id === undefined || id === null || id === '') {
    throw new NotApplicable(
      `No ${what} id: the create response had no Location header, which ` +
      'the OpenAPI does not mark required, so the suite cannot address ' +
      `the ${what}.`);
  }
  return id;
}
