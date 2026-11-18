/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// The DID Authentication query, checked in the verifier's presentation request.
// A workflow asks for a DID Authentication query, then the test reads the
// current exchange presentation request and checks the query that comes back.
// acceptedMethods and acceptedCryptosuites are optional in the spec, so they
// are checked only when present. The holder's choice of cryptosuite is not
// tested here, since it needs a holder implementation.
//
// Negatives: the spec states no behavior for a party that receives a
// malformed query, so each negative is a self-test of the checker on a
// known-bad query (see the w3c-vc-test-suite rules, section 3 rule 7).

import * as notApplicable from '../not-applicable.js';
import {
  createDidAuthenticationQuery,
  createWorkflowRequest
} from '../mock.data.js';
import {
  shouldBeAcceptedCryptosuites,
  shouldBeAcceptedMethods,
  shouldBeDidAuthenticationQuery,
  shouldCreateExchange,
  shouldCreateWorkflow,
  shouldGetCurrentExchangeVpr,
} from '../assertions.js';
import chai from 'chai';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

// No refusal is defined for the sentence, so there is no implementation
// negative.
const NO_REFUSAL =
  'no refusal is defined by this sentence; no implementation negative yet';

const should = chai.should();
const {match} = filterByTag({property: 'workflows', tags: [VCALM_TAG]});
const link = `${TR}#did-authentication`;

// Create a workflow that asks for a DID Authentication query, open an
// exchange, and return the DID Authentication query from the current VPR.
async function didAuthenticationQuery(endpoints) {
  const body = createWorkflowRequest();
  body.steps.start.verifiablePresentationRequest.query =
    [createDidAuthenticationQuery()];
  const created = await endpoints.createWorkflow(body);
  shouldCreateWorkflow(created);
  const exchange = await endpoints.createExchange(created.workflowId);
  shouldCreateExchange(exchange);
  const current = await endpoints.getCurrentExchangeVpr(
    created.workflowId, exchange.exchangeId);
  shouldGetCurrentExchangeVpr(current);
  const queries = current.data.verifiablePresentationRequest.query ?? [];
  const query = queries.find(item => item?.type === 'DIDAuthentication');
  should.exist(query, 'Expected a DIDAuthentication query in the request.');
  return query;
}

// No refusal is defined for these sentences, so there is no implementation
// negative. The subtest is not applicable: the cell is skipped with the reason.
function rejects(check, value, label) {
  return {
    name: `negative: ${label}`,
    run: async () => {
      throw new notApplicable.NotApplicable(NO_REFUSAL);
    }
  };
}

const validQuery = () => ({type: 'DIDAuthentication'});

describeNormativeStatement({
  section: '3.4.3.1 The DID Authentication Query Format',
  match,
  columnLabel: 'Workflow',
  statements: [{
    statement: NORMATIVE['3-4-3-1-the-did-authentication-query-format-1'],
    link,
    subtests({endpoints}) {
      return [{
        name: 'positive: the DID Authentication query has the form of the ' +
          'query table',
        run: async () => {
          shouldBeDidAuthenticationQuery(
            await didAuthenticationQuery(endpoints));
        }
      },
      rejects(shouldBeDidAuthenticationQuery, 'DIDAuthentication',
        'a query that is not an object'),
      rejects(shouldBeDidAuthenticationQuery,
        {...validQuery(), acceptedMethods: {method: 'key'}},
        'a query whose acceptedMethods is not an array')];
    }
  }, {
    statement: NORMATIVE['3-4-3-1-the-did-authentication-query-format-2'],
    link,
    subtests({endpoints}) {
      return [{
        name: 'positive: the query type is the string DIDAuthentication',
        run: async () => {
          const query = await didAuthenticationQuery(endpoints);
          query.type.should.equal('DIDAuthentication');
        }
      },
      rejects(shouldBeDidAuthenticationQuery, {},
        'a query without type'),
      rejects(shouldBeDidAuthenticationQuery, {type: 'DIDAuth'},
        'a query whose type is not DIDAuthentication')];
    }
  }, {
    statement: NORMATIVE['3-4-3-1-the-did-authentication-query-format-3'],
    link,
    subtests({endpoints}) {
      return [{
        name: 'positive: each acceptedMethods object, when present, has a ' +
          'method string',
        run: async () => {
          const query = await didAuthenticationQuery(endpoints);
          if(query.acceptedMethods !== undefined) {
            shouldBeAcceptedMethods(query.acceptedMethods);
          }
        }
      },
      rejects(shouldBeAcceptedMethods, [{did: 'key'}],
        'an acceptedMethods object without method')];
    }
  }, {
    statement: NORMATIVE['3-4-3-1-the-did-authentication-query-format-4'],
    link,
    subtests({endpoints}) {
      // The MUST in this sentence binds the holder, which is not tested
      // here. The checks cover the shape of the array the sentence defines.
      return [{
        name: 'positive: acceptedCryptosuites, when present, is an array of ' +
          'objects',
        run: async () => {
          const query = await didAuthenticationQuery(endpoints);
          if(query.acceptedCryptosuites !== undefined) {
            query.acceptedCryptosuites.should.be.an('array');
            for(const item of query.acceptedCryptosuites) {
              item.should.be.an('object');
            }
          }
        }
      },
      rejects(shouldBeAcceptedCryptosuites, ['eddsa-rdfc-2022'],
        'an acceptedCryptosuites item that is not an object')];
    }
  }, {
    statement: NORMATIVE['3-4-3-1-the-did-authentication-query-format-5'],
    link,
    subtests({endpoints}) {
      return [{
        name: 'positive: each acceptedCryptosuites object, when present, ' +
          'has a cryptosuite string',
        run: async () => {
          const query = await didAuthenticationQuery(endpoints);
          if(query.acceptedCryptosuites !== undefined) {
            shouldBeAcceptedCryptosuites(query.acceptedCryptosuites);
          }
        }
      },
      rejects(shouldBeAcceptedCryptosuites, [{suite: 'eddsa-rdfc-2022'}],
        'an acceptedCryptosuites object without cryptosuite')];
    }
  }]
});
