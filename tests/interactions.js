/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Shared by the 3.7 files in tests/sections/. An implementation supplies
// interaction URLs by setting `interactionUrl` on any role entry (README,
// "Interaction URLs"). The spec hosts the interaction URL on a coordinator,
// so it belongs to whichever entry stands for the coordinator.

import {filterByTag} from 'vc-test-suite-implementations';
import {NotApplicable} from './statement-test.js';
import {VCALM_TAG} from './helpers.js';

const ROLE_KEYS = ['issuers', 'verifiers', 'holders', 'workflows', 'status'];

/**
 * Implementations with any endpoint tagged VCALM. The filterByTag function
 * matches one property at a time, so this is the union over the role keys.
 *
 * @returns {Map<string, object>} Implementations by name.
 */
export function interactionImplementations() {
  const implementations = new Map();
  for(const property of ROLE_KEYS) {
    const {match} = filterByTag({property, tags: [VCALM_TAG]});
    for(const [name, implementation] of match) {
      implementations.set(name, implementation);
    }
  }
  return implementations;
}

/**
 * The interaction URLs an implementation supplies, each with a label naming
 * the entry it came from, for example `the verifiers interactionUrl`. With
 * more than one entry in a role, the label adds the entry's position.
 *
 * @param {object} implementation - The implementation.
 * @returns {Array<{label: string, url: string}>} The interaction URLs.
 */
export function interactionUrls(implementation) {
  const urls = [];
  for(const key of ROLE_KEYS) {
    const entries = (implementation[key] ?? []).filter(entry =>
      entry.tags.has(VCALM_TAG) &&
      entry.settings.interactionUrl !== undefined);
    entries.forEach((entry, index) => {
      const position = entries.length > 1 ? ` ${index + 1}` : '';
      urls.push({
        label: `the ${key}${position} interactionUrl`,
        url: entry.settings.interactionUrl
      });
    });
  }
  return urls;
}

/**
 * Runs `run(url)` as one responds check per interaction URL, labelled
 * `<prefix>: <entry>`. Without interaction URLs the cell is skipped.
 *
 * @param {object} options - Options.
 * @param {object} options.implementation - The implementation.
 * @param {Function} options.responds - The statementTest responds check.
 * @param {string} options.prefix - The label prefix, such as `3.7.1 (1)`.
 * @param {Function} run - The check for one URL.
 */
export async function eachInteractionUrl(
  {implementation, responds, prefix}, run) {
  const urls = interactionUrls(implementation);
  if(urls.length === 0) {
    await responds(prefix, async () => {
      throw new NotApplicable(`no ${VCALM_TAG} entry sets interactionUrl`);
    });
    return;
  }
  for(const {label, url} of urls) {
    await responds(`${prefix}: ${label}`, () => run(url));
  }
}

/**
 * Fetches an interaction URL with a plain GET (interaction URLs need no
 * authorization) and reads the body as text, so HTML and JSON bodies are
 * both available.
 *
 * @param {object} options - Options.
 * @param {string} options.url - The interaction URL.
 * @param {string} options.accept - The Accept header value.
 * @returns {Promise<{status: number, contentType: string, body: string}>}
 *   The response.
 */
export async function fetchInteraction({url, accept}) {
  const response = await fetch(url, {
    headers: {Accept: accept},
    signal: AbortSignal.timeout(10000)
  });
  return {
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    body: await response.text()
  };
}
