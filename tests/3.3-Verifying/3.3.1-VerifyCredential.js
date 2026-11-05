/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  createVerifyCredentialWithoutProof,
  createVerifyPresentationWithoutProof
} from '../negative-fixtures.js';
import {
  implementationsWithIssuerAndVerifier,
  implementationsWithVerifier,
  VCALM_TAG
} from '../helpers.js';
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

describeNormativeStatement({
  section: '3.3.1 Verify Credential',
  match: implementationsWithIssuerAndVerifier(match, tag),
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['3-3-1-verify-credential-2'],
    link,
    subtests({endpoints}) {
      return [{
        name: 'negative: a problem detail has a type and a title',
        run: async () => {
          const {data} = await endpoints.verifyCredential(
            createVerifyCredentialWithoutProof());
          should.exist(data, 'Expected a verify response.');
          const [problem] = data.problemDetails ?? [];
          should.exist(problem, 'Expected problemDetails for an invalid VC.');
          problem.type.should.be.a('string');
          problem.title.should.be.a('string');
        }
      }];
    }
  }, {
    statement: NORMATIVE['3-3-1-verify-credential-5'],
    link,
    subtests({endpoints}) {
      return [{
        name: 'positive: each proof result is a verification result',
        run: async () => {
          const issuedVc = await endpoints.issue();
          should.exist(issuedVc, 'Expected the issuer to issue a VC.');
          const {data} = await endpoints.verifyCredential(issuedVc);
          should.exist(data.results, 'Expected verification results.');
          data.results.proof.should.be.an('array').that.is.not.empty;
          for(const item of data.results.proof) {
            item.verified.should.be.a('boolean');
          }
        }
      }];
    }
  }]
});
