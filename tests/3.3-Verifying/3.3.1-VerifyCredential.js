/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  createVerifyCredentialWithoutProof,
  createVerifyPresentationWithoutProof
} from '../negative-fixtures.js';
import {implementationsWithVerifier, VCALM_TAG} from '../helpers.js';
import {
  shouldNotReportVerifiedTrue,
  shouldVerifyCredential,
  shouldVerifyPresentation
} from '../assertions.js';
import chai from 'chai';
import {createTestPresentation} from '../test-holder.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {issueTestCredential} from '../test-issuer.js';
import {NORMATIVE} from '../normative-statements.js';
import {randomUUID} from 'node:crypto';

const should = chai.should();
const tag = VCALM_TAG;
const {match} = filterByTag({tags: [tag]});
const verifiers = implementationsWithVerifier(match, tag);
const link = 'https://www.w3.org/TR/vcalm-1.0/#conformance';
const DOMAIN = 'https://vcalm-test-suite.example/verify';

// The TR states both verifier interfaces in one sentence, so there is one row.
// Each interface is a subtest of it. The test issuer and test holder sign the
// credential and presentation, so the verifier is the only endpoint under test.
describeNormativeStatement({
  section: 'Conformance',
  match: verifiers,
  columnLabel: 'Verifier',
  statements: [
    {
      statement: NORMATIVE['1-3-conformance-3'],
      link,
      subtests({endpoints}) {
        return [
          {
            name: 'positive: 3.3.1 Verify Credential accepts a signed ' +
              'credential',
            run: async () => {
              const issuedVc = await issueTestCredential();
              should.exist(issuedVc, 'Expected the test issuer to sign a VC.');
              const verifiedVc = await endpoints.verifyCredential(issuedVc);
              shouldVerifyCredential({
                data: verifiedVc.data,
                result: verifiedVc.result
              });
            }
          },
          {
            name: 'negative: 3.3.1 Verify Credential does not verify a ' +
              'credential without proof',
            run: async () => {
              const {data, result, error} = await endpoints.verifyCredential(
                createVerifyCredentialWithoutProof()
              );
              shouldNotReportVerifiedTrue({
                data,
                result: result ?? error?.response
              });
            }
          },
          {
            name: 'positive: 3.3.2 Verify Presentation accepts a signed ' +
              'presentation',
            run: async () => {
              const challenge = `urn:uuid:${randomUUID()}`;
              const credential = await issueTestCredential();
              const vp = await createTestPresentation({
                credentials: [credential], challenge, domain: DOMAIN
              });
              const verifiedVp = await endpoints.verifyPresentation(vp, {
                challenge, domain: DOMAIN
              });
              shouldVerifyPresentation({
                data: verifiedVp.data,
                result: verifiedVp.result
              });
            }
          },
          {
            name: 'negative: 3.3.2 Verify Presentation does not verify an ' +
              'unsigned presentation',
            run: async () => {
              const {data, result, error} = await endpoints.verifyPresentation(
                createVerifyPresentationWithoutProof()
              );
              shouldNotReportVerifiedTrue({
                data,
                result: result ?? error?.response
              });
            }
          }
        ];
      }
    }
  ]
});
