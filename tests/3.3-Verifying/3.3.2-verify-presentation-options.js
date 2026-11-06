/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Statements about the verify presentation result. The presentation is signed
// by the suite's test holder (../test-holder.js), so no holder implementation
// is needed. The two enveloped rules need an enveloped presentation flow,
// which is not configured, so they stay skipped.

import chai from 'chai';
import {createTestPresentation} from '../test-holder.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {issueTestCredential} from '../test-issuer.js';
import {NORMATIVE} from '../normative-statements.js';
import {randomUUID} from 'node:crypto';
import {shouldVerifyPresentation} from '../assertions.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const should = chai.should();
const {match} = filterByTag({property: 'verifiers', tags: [VCALM_TAG]});
const DOMAIN = 'https://vcalm-test-suite.example/verify';

const ENVELOPED_SKIP = 'Not exercised: needs an enveloped presentation ' +
  'flow, which is not configured.';

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
  return response;
}

describeNormativeStatement({
  section: '3.3.2 Verify Presentation',
  match,
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['3-3-2-verify-presentation-2'],
    link: `${TR}#verify-presentation`,
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
      }];
    }
  }, {
    statement: NORMATIVE['3-3-2-verify-presentation-3'],
    link: `${TR}#verify-presentation`,
    subtests({endpoints}) {
      return [{
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
      }];
    }
  }, {
    statement: NORMATIVE['3-3-2-verify-presentation-4'],
    link: `${TR}#verify-presentation`,
    skip: true,
    skipMessage: ENVELOPED_SKIP
  }, {
    statement: NORMATIVE['3-3-2-verify-presentation-5'],
    link: `${TR}#verify-presentation`,
    skip: true,
    skipMessage: ENVELOPED_SKIP
  }, {
    statement: NORMATIVE['3-3-2-verify-presentation-6'],
    link: `${TR}#verify-presentation`,
    subtests({endpoints}) {
      return [{
        name: 'positive: each item in results.credentials is an object ' +
          'with a verification result',
        run: async () => {
          const {data, result} = await verifySignedPresentation(endpoints);
          shouldVerifyPresentation({data, result});
          const credentials = data.results?.credentials;
          should.exist(credentials, 'Expected results.credentials.');
          credentials.should.be.an('array').that.is.not.empty;
          for(const item of credentials) {
            item.should.be.an('object');
          }
        }
      }];
    }
  }]
});
