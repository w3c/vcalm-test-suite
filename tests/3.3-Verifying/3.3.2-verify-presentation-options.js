/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// The verify presentation result is checked as part of the verifier's
// interface conformance. The presentation is signed by the suite's test holder
// (../test-holder.js), so no holder implementation is needed. The enveloped
// presentation rules are in the OpenAPI description, and need an enveloped
// presentation flow that is not configured, so they are not exercised here.

import chai from 'chai';
import {createTestPresentation} from '../test-holder.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {issueTestCredential} from '../test-issuer.js';
import {NORMATIVE} from '../normative-statements.js';
import {NotApplicable} from '../not-applicable.js';
import {randomUUID} from 'node:crypto';
import {shouldVerifyPresentation} from '../assertions.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const should = chai.should();
const {match} = filterByTag({property: 'verifiers', tags: [VCALM_TAG]});
const DOMAIN = 'https://vcalm-test-suite.example/verify';

// Verify a presentation signed by the test holder. The options add the
// challenge and domain the proof is bound to, plus any extra options.
async function verifySignedPresentation(endpoints, options = {}) {
  const challenge = `urn:uuid:${randomUUID()}`;
  const credential = await issueTestCredential();
  const vp = await createTestPresentation({
    credentials: [credential], challenge, domain: DOMAIN
  });
  const response = await endpoints.verifyPresentation(vp, {
    challenge, domain: DOMAIN, ...options
  });
  if(!response.result) {
    // report why the request failed, not just that there is no result
    throw new Error('verify presentation request failed: ' +
      (response.error?.message ?? JSON.stringify(response.error)));
  }
  // The spec does not say which DID methods or cryptosuites a verifier
  // supports, so a verifier may refuse the test holder's did:key and
  // eddsa-rdfc-2022 data with a listed 400. The options checks then cannot
  // be observed. A 200 is checked whatever verified says, so these checks
  // never require the verifier to accept the suite's method or cryptosuite.
  if(response.result.status === 400) {
    throw new NotApplicable('The verifier refused the suite\'s did:key ' +
      'and eddsa-rdfc-2022 presentation with HTTP 400; the spec does not ' +
      'require support for either.');
  }
  return response;
}

describeNormativeStatement({
  section: 'Conformance',
  match,
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['1-3-conformance-3'],
    link: `${TR}#conformance`,
    subtests({endpoints}) {
      return [{
        name: 'positive: returnPresentation true returns the presentation',
        run: async () => {
          const {data, result} = await verifySignedPresentation(
            endpoints, {returnPresentation: true});
          shouldVerifyPresentation({data, result});
          should.exist(data.verifiablePresentation,
            'Expected the verified presentation in the response.');
        }
      }, {
        name: 'positive: returnPresentation false does not return the ' +
          'presentation',
        run: async () => {
          const {data, result} = await verifySignedPresentation(
            endpoints, {returnPresentation: false});
          shouldVerifyPresentation({data, result});
          should.not.exist(data.verifiablePresentation,
            'Expected no presentation when returnPresentation is false.');
        }
      }, {
        name: 'positive: an omitted returnPresentation does not return the ' +
          'presentation',
        run: async () => {
          const {data, result} = await verifySignedPresentation(endpoints);
          shouldVerifyPresentation({data, result});
          should.not.exist(data.verifiablePresentation,
            'Expected no presentation when returnPresentation is omitted.');
        }
      }, {
        name: 'positive: each item in results.credentials is an object ' +
          'with a verification result',
        run: async () => {
          const {data, result} = await verifySignedPresentation(endpoints);
          shouldVerifyPresentation({data, result});
          // results.credentials is not required by the schema. When the
          // implementation returns it, each item must be an object.
          const credentials = data.results?.credentials;
          if(credentials !== undefined) {
            credentials.should.be.an('array');
            for(const item of credentials) {
              item.should.be.an('object');
            }
          }
        }
      }];
    }
  }]
});
