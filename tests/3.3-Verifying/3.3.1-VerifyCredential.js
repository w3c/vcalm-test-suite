/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  createVerifyCredentialWithoutProof,
  createVerifyPresentationWithoutProof
} from '../negative-fixtures.js';
import {
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
  section: 'Verifier',
  match: paired,
  columnLabel: 'Verifier',
  statements: [
    {
      statement: NORMATIVE.conformance.verifyCredential,
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
    },
    {
      statement: NORMATIVE.conformance.verifyPresentation,
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
