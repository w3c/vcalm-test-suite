/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  implementationsWithIssuerAndVerifier,
  VCALM_TAG
} from '../helpers.js';
import chai from 'chai';
import {createVerifyCredentialWithoutProof} from '../negative-fixtures.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {TR} from '../skipped-section.js';

const should = chai.should();
const {match} = filterByTag({tags: [VCALM_TAG]});
const verifiers = filterByTag({property: 'verifiers', tags: [VCALM_TAG]}).match;
const pairs = implementationsWithIssuerAndVerifier(match, VCALM_TAG);

describeNormativeStatement({
  section: 'Error Handling',
  match: verifiers,
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['3-8-error-handling-1'],
    link: `${TR}#error-handling`,
    subtests({endpoints}) {
      return [{
        name: 'negative: a problem detail has a type URL',
        run: async () => {
          const {data} = await endpoints.verifyCredential(
            createVerifyCredentialWithoutProof());
          should.exist(data, 'Expected a verify response.');
          const [problem] = data.problemDetails ?? [];
          should.exist(problem, 'Expected problemDetails for an invalid VC.');
          problem.type.should.match(/^https?:\/\//);
        }
      }];
    }
  }]
});

describeNormativeStatement({
  section: 'Verification Errors vs. Warnings',
  match: pairs,
  columnLabel: 'Error Handling',
  statements: [{
    statement: NORMATIVE['3-8-1-verification-errors-vs-warnings-1'],
    link: `${TR}#verification-errors-vs-warnings`,
    subtests({endpoints}) {
      return [{
        name: 'negative: verified is false when an error is included',
        run: async () => {
          const {data} = await endpoints.verifyCredential(
            createVerifyCredentialWithoutProof());
          should.exist(data, 'Expected a verify response.');
          (data.problemDetails?.length > 0).should.equal(
            true, 'Expected an error for an invalid VC.');
          data.verified.should.equal(false);
        }
      }];
    }
  }, {
    statement: NORMATIVE['3-8-1-verification-errors-vs-warnings-2'],
    link: `${TR}#verification-errors-vs-warnings`,
    subtests({endpoints}) {
      return [{
        name: 'positive: verified is true when no error is included',
        run: async () => {
          const issuedVc = await endpoints.issue();
          should.exist(issuedVc, 'Expected the issuer to issue a VC.');
          const {data} = await endpoints.verifyCredential(issuedVc);
          should.exist(data, 'Expected a verify response.');
          (data.problemDetails?.length ?? 0).should.equal(
            0, 'Expected no errors for a valid VC.');
          data.verified.should.equal(true);
        }
      }];
    }
  }]
});
