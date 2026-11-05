/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  createVerifyCredentialWithoutProof,
  createVerifyPresentationWithoutProof
} from '../negative-fixtures.js';
import {
  implementationsWithIssuerAndVerifier,
  implementationsWithPresentationFlow,
  VCALM_TAG
} from '../helpers.js';
import {
  shouldBeCreatedPresentation,
  shouldNotReportVerifiedTrue,
  shouldVerifyCredential,
  shouldVerifyPresentation
} from '../assertions.js';
import chai from 'chai';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';

const should = chai.should();
const tag = VCALM_TAG;
const {match} = filterByTag({tags: [tag]});
const paired = implementationsWithPresentationFlow(match, tag);
const link = 'https://www.w3.org/TR/vcalm-1.0/#conformance';

describeNormativeStatement({
  section: 'Conformance',
  match: paired,
  columnLabel: 'Verifier',
  statements: [
    {
      statement: NORMATIVE['1-3-conformance-3'],
      link,
      subtests({name, endpoints}) {
        return [
          {
            name: 'positive: POST /credentials/verify accepts an issued ' +
              'credential',
            run: async () => {
              const issuedVc = await endpoints.issue();
              should.exist(
                issuedVc,
                `Expected ${name} to issue a VC first.`
              );
              const verifiedVc = await endpoints.verifyCredential(issuedVc);
              shouldVerifyCredential({
                data: verifiedVc.data,
                result: verifiedVc.result
              });
            }
          },
          {
            name: 'negative: POST /credentials/verify rejects a credential ' +
              'without proof',
            run: async () => {
              const {data, result, error} = await endpoints.verifyCredential(
                createVerifyCredentialWithoutProof()
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
  section: 'Conformance',
  match: paired,
  columnLabel: 'Verifier',
  statements: [
    {
      statement: NORMATIVE['1-3-conformance-3'],
      link,
      subtests({name, endpoints}) {
        return [
          {
            name: 'positive: POST /presentations/verify accepts a created ' +
              'presentation',
            run: async () => {
              const issuedVc = await endpoints.issue();
              should.exist(
                issuedVc,
                `Expected ${name} to issue a VC first.`
              );
              const created = await endpoints.createPresentation({issuedVc});
              shouldBeCreatedPresentation({
                data: created.data,
                result: created.result,
                error: created.error
              });
              const verifiedVp = await endpoints.verifyPresentation(
                created.verifiablePresentation
              );
              shouldVerifyPresentation({
                data: verifiedVp.data,
                result: verifiedVp.result
              });
            }
          },
          {
            name: 'negative: an unsigned presentation is not verified',
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
