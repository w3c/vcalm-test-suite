/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeNormativeStatement} from './statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from './helpers.js';

export const TR = 'https://www.w3.org/TR/vcalm-1.0/';

/**
 * One skipped row per statement, kept in its own report section.
 *
 * @param {object} options - Options.
 * @param {string} options.section - Report section heading.
 * @param {string} [options.columnLabel] - Matrix column heading.
 * @param {string} [options.property] - Implementation endpoint list to match.
 * @param {string} [options.link] - Default spec URL.
 * @param {Array<string|object>} options.statements - Statement text, or
 *   `{statement, link}` when a row points at its own section.
 */
export function describeSkippedSection({
  section,
  columnLabel = section,
  property = 'issuers',
  link = `${TR}#conformance`,
  statements
}) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  describeNormativeStatement({
    section,
    match,
    columnLabel,
    statements: statements.map(item => {
      const statement = typeof item === 'string' ? item : item.statement;
      const itemLink = typeof item === 'string' ? link : (item.link || link);
      return {statement, link: itemLink, skip: true, skipMessage: 'Skipped.'};
    })
  });
}
