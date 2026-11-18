/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// This is a configuration check, not a wire check. It reads the request
// settings each implementation declares for its endpoints and fails if they
// send a Basic Authorization header or a username or password on requests.
// It cannot see what an implementation actually sends. OAuth2 client secrets
// are not checked, because they are exchanged for short-lived tokens and are
// not sent with each API request.
//
// The sentence constrains requests, and states no server behavior for a
// request that uses a forbidden protocol, so there is no refusal to test on
// the wire. The settings check reads the suite's own configuration, not the
// implementation, so the implementation's cell is not applicable.

import * as notApplicable from '../not-applicable.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

// No refusal is defined for the sentence, so there is no implementation
// negative.
const NO_REFUSAL =
  'no refusal is defined by this sentence; no implementation negative yet';

const ENDPOINT_KINDS = ['issuer', 'verifier', 'workflow'];
const STATIC_FIELD = /^(username|password|passwd)$/i;

/**
 * Lists the static credentials in an endpoint's request settings.
 *
 * @param {object} settings - The endpoint's settings from the config.
 * @returns {Array<string>} One message per static credential found.
 */
export function findStaticCredentials(settings = {}) {
  const headers = settings.headers ?? {};
  const problems = [];
  for(const [name, value] of Object.entries(headers)) {
    if(name.toLowerCase() === 'authorization' &&
      /^basic\s/i.test(String(value))) {
      problems.push(`header "${name}" uses Basic authentication`);
    }
  }
  for(const source of [settings, headers]) {
    for(const key of Object.keys(source)) {
      if(STATIC_FIELD.test(key)) {
        problems.push(`"${key}" is a static credential`);
      }
    }
  }
  return problems;
}

const {match} = filterByTag({tags: [VCALM_TAG]});

describeNormativeStatement({
  section: 'Authorization',
  statement: NORMATIVE['forbidden-authorization-1'],
  link: `${TR}#authorization`,
  match,
  columnLabel: 'Implementation',
  subtests({endpoints}) {
    const positives = ENDPOINT_KINDS
      .filter(kind => endpoints[kind])
      .map(kind => ({
        name: `positive: the ${kind} endpoint settings declare no ` +
          'long-lived static credentials',
        run: async () => {
          const problems = findStaticCredentials(endpoints[kind].settings);
          if(problems.length > 0) {
            throw new Error(problems.join('; '));
          }
        }
      }));
    // No refusal is defined for this sentence, so there is no implementation
    // negative. The subtest is not applicable: the cell is skipped.
    const negatives = [{
      name: 'negative: no refusal is defined by this sentence',
      run: async () => {
        throw new notApplicable.NotApplicable(NO_REFUSAL);
      }
    }];
    return [...positives, ...negatives];
  }
});
