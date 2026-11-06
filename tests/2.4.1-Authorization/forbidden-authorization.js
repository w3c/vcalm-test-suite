/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// This is a configuration check, not a wire check. It reads the request
// settings each implementation declares for its endpoints and fails if they
// send a Basic Authorization header or a username or password on requests.
// It cannot see what an implementation actually sends. OAuth2 client secrets
// are not checked, because they are exchanged for short-lived tokens and are
// not sent with each API request.

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

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
    return ENDPOINT_KINDS
      .filter(kind => endpoints[kind])
      .map(kind => ({
        name: `config: ${kind} endpoint declares no long-lived static ` +
          'credentials',
        run: async () => {
          const problems = findStaticCredentials(endpoints[kind].settings);
          if(problems.length > 0) {
            throw new Error(problems.join('; '));
          }
        }
      }));
  }
});
