/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js).
//
// The sentence constrains the requests clients send, and states no server
// behavior for a request that breaks it, so there is no refusal to observe.
// The suite sends its requests as the implementation's entries configure
// them, so the row checks that configuration: every entry tagged VCALM that
// uses authorization uses `zcap` (a capability invocation signed per request)
// or `oauth2` (short-lived access tokens; the client secret goes only to the
// token endpoint), and no entry puts a credential in `headers`, which is
// static by nature. An implementation whose entries use no authorization has
// no request to judge, so its cell is skipped.

import {
  NotApplicable, setupStatementMatrix, statementTest
} from '../statement-test.js';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from '../helpers.js';

// Implementations with any endpoint tagged VCALM.
const ROLE_KEYS = ['issuers', 'verifiers', 'holders', 'workflows', 'status'];
const implementations = new Map();
for(const property of ROLE_KEYS) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  for(const [name, implementation] of match) {
    implementations.set(name, implementation);
  }
}

// Header names that carry credentials.
const CREDENTIAL_HEADER = new RegExp(
  '^(authorization|proxy-authorization|cookie)$|' +
  'api[-_]?key|token|secret|passw', 'i');

// Each VCALM entry of an implementation, labelled with its role.
function vcalmEntries(implementation) {
  return ROLE_KEYS.flatMap(key => {
    const entries = (implementation[key] ?? []).filter(entry =>
      entry.tags.has(VCALM_TAG));
    return entries.map((entry, index) => ({
      label: entries.length > 1 ? `${key} ${index + 1}` : key,
      settings: entry.settings
    }));
  });
}

describe('Authorization', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: 'forbidden-authorization-1'
      }, async ({responds}) => {
        await responds('2.4.1 (1): every VCALM entry authorizes with zcap ' +
          'or oauth2, and no headers hold credentials', async () => {
          const entries = vcalmEntries(implementation);
          const credentials = entries.flatMap(({label, settings}) =>
            Object.keys(settings.headers ?? {})
              .filter(header => CREDENTIAL_HEADER.test(header))
              .map(header => `the ${label} entry sends ${header} in headers`));
          if(credentials.length > 0) {
            throw new Error('Long-lived static credentials in requests: ' +
              credentials.join('; '));
          }
          const authorized = entries.some(({settings}) =>
            settings.zcap || settings.oauth2);
          if(!authorized) {
            throw new NotApplicable('no VCALM entry uses authorization, so ' +
              'there is no request to judge');
          }
        });
      });
    });
  }
});
