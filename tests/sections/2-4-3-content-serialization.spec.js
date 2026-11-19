/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `2.4.3 (n): what it does`.

import {
  NotApplicable, setupStatementMatrix, statementTest
} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {shouldBeListedRefusal} from '../openapi.js';
import {shouldReturnHttpResult} from '../assertions.js';
import {testCredential} from '../signing.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const implementations = new Map();
for(const property of ['issuers', 'verifiers']) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  for(const [name, implementation] of match) {
    implementations.set(name, implementation);
  }
}

function shouldBeJsonResponse(result) {
  expect(result, 'Expected an HTTP response.').to.exist;
  const contentType = result.headers?.get('content-type') ?? '';
  expect(contentType).to.match(/^application\/json\b/,
    `Expected a Content-Type of application/json, got "${contentType}".`);
}

describe('Content Serialization', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: 'content-serialization-1'
      }, async ({endpoints, responds, refuses}) => {
        if(endpoints.issuer) {
          await responds('2.4.3 (1): the issue response is JSON', async () => {
            const {result, error} = await endpoints.issueCredential();
            shouldReturnHttpResult({result, error});
            shouldBeJsonResponse(result);
          });
          await refuses('2.4.3 (1): issue with a body that is not JSON',
            async () => {
              const settled = await endpoints.issueWithRawBody(
                '{"credential":');
              if(!settled) {
                throw new NotApplicable('the issuer entry has a zcap, and a ' +
                  'signed request always carries a JSON body');
              }
              shouldBeListedRefusal(
                {result: settled.result, operation: 'issueCredential'});
            });
        }
        if(endpoints.verifier) {
          await responds('2.4.3 (1): the verify response is JSON', async () => {
            const {result} = await endpoints.verifyCredential(
              await testCredential());
            shouldBeJsonResponse(result);
          });
        }
      });
    });
  }
});
