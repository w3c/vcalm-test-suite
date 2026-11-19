/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.4.3.1 (n): what it does`.
//
// As in 3.4.1, the suite checks the DID Authentication query the workflow
// service sends, and that the service refuses to create a workflow whose step
// query breaks the form (the suite's reading; the spec does not say so in
// words).

import {
  DID_AUTHENTICATION_QUERY, servedRequest, shouldRefuseRequest
} from '../presentation-request.js';
import {setupStatementMatrix, statementTest} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const {match: implementations} = filterByTag(
  {property: 'workflows', tags: [VCALM_TAG]});

const withQuery = query => ({query: [query]});

// The DID Authentication query the exchange sends for the suite's query.
async function servedQuery(endpoints) {
  const {served} = await servedRequest(
    {endpoints, request: withQuery(DID_AUTHENTICATION_QUERY)});
  return [served.query].flat()[0];
}

async function refusesEach({refuses, endpoints, n, cases}) {
  for(const [what, query] of Object.entries(cases)) {
    await refuses(`3.4.3.1 (${n}): a query with ${what}`, async () =>
      shouldRefuseRequest({endpoints, request: withQuery(query)}));
  }
}

describe('The DID Authentication Query Format', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      const row = n => `3-4-3-1-the-did-authentication-query-format-${n}`;

      statementTest({
        name, implementation, role: 'workflow', rowId: row(1)
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.1 (1): the query has the required form',
          async () => {
            expect(await servedQuery(endpoints))
              .to.deep.equal(DID_AUTHENTICATION_QUERY);
          });
        await refusesEach({refuses, endpoints, n: 1, cases: {
          'acceptedMethods that is a string': {
            ...DID_AUTHENTICATION_QUERY, acceptedMethods: 'key'}
        }});
      });

      statementTest({
        name, implementation, role: 'workflow', rowId: row(2)
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.1 (2): type is DIDAuthentication', async () => {
          expect((await servedQuery(endpoints)).type)
            .to.equal('DIDAuthentication');
        });
        await refusesEach({refuses, endpoints, n: 2, cases: {
          'type DidAuthentication': {
            ...DID_AUTHENTICATION_QUERY, type: 'DidAuthentication'}
        }});
      });

      statementTest({
        name, implementation, role: 'workflow', rowId: row(3)
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.1 (3): each acceptedMethods item has a method',
          async () => {
            const {acceptedMethods} = await servedQuery(endpoints);
            expect(acceptedMethods).to.be.an('array');
            for(const item of acceptedMethods) {
              expect(item.method).to.be.a('string');
            }
          });
        await refusesEach({refuses, endpoints, n: 3, cases: {
          'an acceptedMethods item without method': {
            ...DID_AUTHENTICATION_QUERY, acceptedMethods: [{name: 'key'}]},
          'an acceptedMethods method that is a number': {
            ...DID_AUTHENTICATION_QUERY, acceptedMethods: [{method: 5}]}
        }});
      });

      statementTest({
        name, implementation, role: 'workflow', rowId: row(4)
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.1 (4): acceptedCryptosuites is an array',
          async () => {
            expect((await servedQuery(endpoints)).acceptedCryptosuites)
              .to.be.an('array');
          });
        await refusesEach({refuses, endpoints, n: 4, cases: {
          'acceptedCryptosuites that is an object': {
            ...DID_AUTHENTICATION_QUERY,
            acceptedCryptosuites: {cryptosuite: 'eddsa-rdfc-2022'}}
        }});
      });

      statementTest({
        name, implementation, role: 'workflow', rowId: row(5)
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.3.1 (5): each acceptedCryptosuites item has a ' +
          'cryptosuite', async () => {
          const {acceptedCryptosuites} = await servedQuery(endpoints);
          for(const item of acceptedCryptosuites) {
            expect(item.cryptosuite).to.be.a('string');
          }
        });
        await refusesEach({refuses, endpoints, n: 5, cases: {
          'an acceptedCryptosuites item without cryptosuite': {
            ...DID_AUTHENTICATION_QUERY,
            acceptedCryptosuites: [{name: 'eddsa-rdfc-2022'}]}
        }});
      });
    });
  }
});
