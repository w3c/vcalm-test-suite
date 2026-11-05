/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {NORMATIVE} from './normative-statements.js';

const KEY_BY_TEXT = new Map(
  Object.entries(NORMATIVE).map(([key, text]) => [text, key]));

/**
 * Keys of the statements that already have a results-matrix row, live or
 * skipped. Filled as the test modules load.
 */
export const covered = new Set();

/**
 * Record that a matrix row exists for this statement text.
 *
 * @param {string} text - Statement text as passed to a row.
 */
export function recordRow(text) {
  const key = KEY_BY_TEXT.get(text);
  if(key) {
    covered.add(key);
  }
}
