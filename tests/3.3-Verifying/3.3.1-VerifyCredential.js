/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  createVerifyCredentialWithoutProof,
  createVerifyPresentationWithoutProof
} from '../negative-fixtures.js';
import {
  implementationsWithPresentationFlow,
  implementationsWithVerifier,
  VCALM_TAG
} from '../helpers.js';
import {
  shouldBeCreatedPresentation,
  shouldNotReportVerifiedTrue,
  shouldVerifyCredential,
  shouldVerifyPresentation
} from '../assertions.js';
import chai from 'chai';
import {DERIVED} from '../derived-statements.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {issueTestCredential} from '../test-issuer.js';

const should = chai.should();
const tag = VCALM_TAG;
const {match} = filterByTag({tags: [tag]});
const paired = implementationsWithPresentationFlow(match, tag);
const verifiers = implementationsWithVerifier(match, tag);
const link = 'https://www.w3.org/TR/vcalm-1.0/#conformance';

describeNormativeStatement({
  section: 'Conformance',
  match: verifiers,
  columnLabel: 'Verifier',
  statements: [
    {
      statement: DERIVED.verifyCredential,
      link,
      subtests({endpoints}) {
        return [
          {
            name: 'positive: POST /credentials/verify accepts an issued ' +
              'credential',
            run: async () => {
              // The test issuer signs the credential, so the verifier is the
              // only endpoint under test.
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
      statement: DERIVED.verifyPresentation,
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
