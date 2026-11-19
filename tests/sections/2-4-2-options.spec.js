/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `2.4.2 (n): what it does`.
// The issuer and the verifier both take an `options` object, so each gets
// the same request with and without an option no implementation knows. The
// issuer also gets a body that is not JSON.

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import {shouldBeIssuedVc, shouldReturnHttpResult} from '../assertions.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {shouldBeListedRefusal} from '../openapi.js';
import {testCredential} from '../signing.js';
import {UNKNOWN_OPTION_PROBE_KEY} from '../mock.data.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const implementations = new Map();
for(const property of ['issuers', 'verifiers']) {
  const {match} = filterByTag({property, tags: [VCALM_TAG]});
  for(const [name, implementation] of match) {
    implementations.set(name, implementation);
  }
}

const UNKNOWN_OPTION = {[UNKNOWN_OPTION_PROBE_KEY]: true};

describe('Options', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: 'options-5'
      }, async ({endpoints, accepts, refuses}) => {
        if(endpoints.issuer) {
          await accepts('2.4.2 (5): issue with known options', async () => {
            const {data, result, error} = await endpoints.issueCredential();
            shouldReturnHttpResult({result, error});
            expect(result.status).to.equal(201);
            shouldBeIssuedVc({data, result});
          });
          await refuses('2.4.2 (5): issue with an unknown option', async () => {
            const {result} = await endpoints.issueWithUnknownOption();
            shouldBeListedRefusal({result, operation: 'issueCredential'});
          });
          // A body that does not parse is data the endpoint cannot process.
          await refuses('2.4.2 (5): issue with a body that is not JSON',
            async () => {
              const {result} = await endpoints.issueWithRawBody(
                '{"credential":');
              shouldBeListedRefusal({result, operation: 'issueCredential'});
            });
        }
        if(endpoints.verifier) {
          // The test issuer (../signing.js) signs the credential, so only
          // the verifier is under test.
          await accepts('2.4.2 (5): verify with known options', async () => {
            const {data, result} = await endpoints.verifyCredential(
              await testCredential());
            expect(result?.status).to.equal(200);
            expect(data?.verified).to.equal(true);
          });
          await refuses('2.4.2 (5): verify with an unknown option',
            async () => {
              const {result} = await endpoints.verifyCredential(
                await testCredential(), UNKNOWN_OPTION);
              shouldBeListedRefusal({result, operation: 'verifyCredential'});
            });
        }
      });
    });
  }
});
