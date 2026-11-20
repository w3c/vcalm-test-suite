/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.4.1 (n): what it does`.
//
// In an exchange, the workflow service is the verifier: it provides the
// verifiable presentation request to the holder (POST {} returns it), adding
// its own challenge. The form statements therefore bind the request it
// serves. The suite checks that a valid step gives a request of that form,
// and that a malformed step is never served: the service refuses it when the
// workflow is created or when the exchange starts (shouldRefuseRequest).
//
// `acceptedEncryption` keys are made by the service. Requesting encryption is
// not a VCALM step field, so a workflows entry gives the step fields that do
// it in `encryptionStep` (README, "Workflow entries"); without it the
// acceptedEncryption rows are skipped.

import {
  DID_AUTHENTICATION_QUERY, encryptPresentation, requestDomain,
  servedRequest, shouldRefuseRequest
} from '../presentation-request.js';
import {
  NotApplicable, setupStatementMatrix, statementTest
} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {shouldBeListedRefusal} from '../openapi.js';
import {testDidAuthenticationResponse} from '../signing.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const {match: implementations} = filterByTag(
  {property: 'workflows', tags: [VCALM_TAG]});

// JWK members that hold private key material (RFC 7518 section 6).
const PRIVATE_JWK_MEMBERS = ['d', 'p', 'q', 'dp', 'dq', 'qi', 'oth', 'k'];

const request = {query: [DID_AUTHENTICATION_QUERY]};

function encryptionStepOf(implementation) {
  return implementation.workflows?.find(
    workflow => workflow.tags.has(VCALM_TAG))?.settings.encryptionStep;
}

describe('Verifiable Presentation Request', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      const encryptionStep = encryptionStepOf(implementation);
      const noEncryption = encryptionStep ? undefined :
        'no workflows entry tagged VCALM sets encryptionStep';

      // The request of a step that asks the holder to encrypt.
      const encrypted = async endpoints => {
        const {served} = await servedRequest(
          {endpoints, request, step: encryptionStep});
        return served.acceptedEncryption;
      };

      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-1-verifiable-presentation-request-1'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.1 (1): the request has the step\'s query',
          async () => {
            const {served, sent} = await servedRequest({endpoints, request});
            expect(served.query).to.deep.equal(sent.query);
          });
        await refuses('3.4.1 (1): a step request without query', async () =>
          shouldRefuseRequest({endpoints, request: {}}));
      });

      statementTest({
        name, implementation, role: 'workflow',
        rowId: '3-4-1-verifiable-presentation-request-2'
      }, async ({endpoints, accepts, refuses}) => {
        await accepts('3.4.1 (2): each query has a string type', async () => {
          const {served} = await servedRequest({endpoints, request});
          const queries = [served.query].flat();
          expect(queries).to.have.length.of.at.least(1);
          for(const query of queries) {
            expect(query).to.be.an('object');
            expect(query.type).to.be.a('string');
          }
        });
        const broken = {
          'an empty query array': {query: []},
          'a query that is a string': {query: 'DIDAuthentication'},
          'a query without type': {query: [{acceptedMethods: [
            {method: 'key'}]}]},
          'a query whose type is a number': {query: [{
            ...DID_AUTHENTICATION_QUERY, type: 5}]}
        };
        for(const [what, request] of Object.entries(broken)) {
          await refuses(`3.4.1 (2): a step request with ${what}`, async () =>
            shouldRefuseRequest({endpoints, request}));
        }
      });

      statementTest({
        name, implementation, role: 'workflow', skip: noEncryption,
        rowId: '3-4-1-verifiable-presentation-request-5'
      }, async ({endpoints, responds}) => {
        await responds('3.4.1 (5): acceptedEncryption is a map', async () => {
          const acceptedEncryption = await encrypted(endpoints);
          expect(acceptedEncryption).to.be.an('object');
          expect(Array.isArray(acceptedEncryption)).to.equal(false);
        });
      });

      statementTest({
        name, implementation, role: 'workflow', skip: noEncryption,
        rowId: '3-4-1-verifiable-presentation-request-6'
      }, async ({endpoints, responds}) => {
        await responds('3.4.1 (6): acceptedEncryption has required and jwks',
          async () => {
            const acceptedEncryption = await encrypted(endpoints);
            expect(acceptedEncryption).to.include.keys('required', 'jwks');
          });
      });

      statementTest({
        name, implementation, role: 'workflow', skip: noEncryption,
        rowId: '3-4-1-verifiable-presentation-request-7'
      }, async ({endpoints, responds}) => {
        await responds('3.4.1 (7): required is a boolean', async () => {
          const acceptedEncryption = await encrypted(endpoints);
          expect(acceptedEncryption?.required).to.be.a('boolean');
        });
      });

      // The sentence says the response is acceptable only if encrypted, so
      // the exchange must refuse an unencrypted one when `required` is true.
      statementTest({
        name, implementation, role: 'workflow', skip: noEncryption,
        rowId: '3-4-1-verifiable-presentation-request-8'
      }, async ({endpoints, accepts, refuses}) => {
        // Answers a fresh request with the test holder's DID Authentication
        // response, encrypted to the request's first key or not.
        const answer = async ({encrypt}) => {
          const {workflowId, exchangeId, served} = await servedRequest(
            {endpoints, request, step: encryptionStep});
          if(served.acceptedEncryption?.required !== true) {
            throw new NotApplicable('the encryptionStep request does not ' +
              'set acceptedEncryption.required to true');
          }
          let verifiablePresentation = await testDidAuthenticationResponse({
            challenge: served.challenge, domain: requestDomain(endpoints)
          });
          if(encrypt) {
            verifiablePresentation = await encryptPresentation({
              presentation: verifiablePresentation,
              jwk: served.acceptedEncryption.jwks[0]
            });
          }
          const {result} = await endpoints.participateInExchange(
            workflowId, exchangeId, {verifiablePresentation});
          return result;
        };
        await accepts('3.4.1 (8): an encrypted response when required',
          async () => {
            const result = await answer({encrypt: true});
            expect(result?.status).to.equal(200);
          });
        await refuses('3.4.1 (8): an unencrypted response when required',
          async () => {
            const result = await answer({encrypt: false});
            shouldBeListedRefusal(
              {result, operation: 'participateInExchange'});
          });
      });

      statementTest({
        name, implementation, role: 'workflow', skip: noEncryption,
        rowId: '3-4-1-verifiable-presentation-request-10'
      }, async ({endpoints, responds}) => {
        await responds('3.4.1 (10): jwks is an array of one or more JWKs',
          async () => {
            const {jwks} = await encrypted(endpoints) ?? {};
            expect(jwks).to.be.an('array').with.length.of.at.least(1);
            for(const jwk of jwks) {
              expect(jwk).to.be.an('object');
              expect(jwk.kty, 'a JWK has kty').to.be.a('string');
            }
          });
      });

      statementTest({
        name, implementation, role: 'workflow', skip: noEncryption,
        rowId: '3-4-1-verifiable-presentation-request-11'
      }, async ({endpoints, responds}) => {
        await responds('3.4.1 (11): no JWK has private key members',
          async () => {
            const {jwks = []} = await encrypted(endpoints) ?? {};
            for(const jwk of jwks) {
              const found = PRIVATE_JWK_MEMBERS.filter(member =>
                Object.hasOwn(jwk, member));
              expect(found, `private members in JWK ${jwk.kid ?? ''}`)
                .to.deep.equal([]);
            }
          });
      });
    });
  }
});
