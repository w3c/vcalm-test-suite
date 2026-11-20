/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.4.2 (n): what it does`.
//
// As in 3.4.1, the workflow service is the verifier that serves the request:
// a valid step gives a request of the required form, and a malformed one is
// refused when the workflow is created or when the exchange starts.

import {
  QUERY_BY_EXAMPLE, servedRequest, shouldRefuseRequest
} from '../presentation-request.js';
import {setupStatementMatrix, statementTest} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const {match: implementations} = filterByTag(
  {property: 'workflows', tags: [VCALM_TAG]});

const withIssuers = acceptedIssuers => ({query: [{
  ...QUERY_BY_EXAMPLE,
  credentialQuery: {...QUERY_BY_EXAMPLE.credentialQuery, acceptedIssuers}
}]});

// The three item forms 3.4.2 (5) allows.
const ACCEPTED_ISSUERS = [
  'https://issuer.example/',
  {id: 'https://issuer.example/other'},
  {recognizedIn: {
    type: 'RecognizedEntityCredential',
    id: 'https://anchor.example/recognized-issuers.json'
  }}
];

const isUrl = value => {
  try {
    return typeof value === 'string' && Boolean(new URL(value));
  } catch{
    return false;
  }
};

function isAcceptedIssuer(item) {
  return isUrl(item) || isUrl(item?.id) ||
    (item?.recognizedIn?.type === 'RecognizedEntityCredential' &&
      isUrl(item.recognizedIn.id));
}

describe('Query By Example', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-2-query-by-example-5'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.2 (5): acceptedIssuers in each allowed form',
          async () => {
            const {served} = await servedRequest(
              {endpoints, request: withIssuers(ACCEPTED_ISSUERS)});
            const items = served.query?.[0]?.credentialQuery
              ?.acceptedIssuers;
            expect(items).to.deep.equal(ACCEPTED_ISSUERS);
            for(const item of items) {
              expect(isAcceptedIssuer(item), JSON.stringify(item))
                .to.equal(true);
            }
          });
        const broken = {
          'a number': 5,
          'a string that is not a URL': 'not a url',
          'an object without id or recognizedIn': {name: 'Issuer'}
        };
        for(const [what, item] of Object.entries(broken)) {
          await refuses(`3.4.2 (5): an acceptedIssuers item that is ${what}`,
            async () => shouldRefuseRequest(
              {endpoints, request: withIssuers([item])}));
        }
      });
    });
  }
});
