/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Response codes: the OpenAPI lists 200 and 400 for verifyCredential. A 200
// carries a VerificationResult body; a 400 has no body in the OpenAPI, so
// none is required, and a 400 for invalid input counts as a refusal. When no
// ProblemDetails is returned at all, 3-8-error-handling-1 cannot be observed
// and its cell is recorded as not applicable (skipped), not passed.

import {
  implementationsWithIssuerAndVerifier,
  VCALM_TAG
} from '../helpers.js';
import chai from 'chai';
import {createVerifyCredentialWithoutProof} from '../negative-fixtures.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {NotApplicable} from '../not-applicable.js';
import {shouldBeListedStatus} from '../openapi.js';
import {shouldBeProblemDetails} from '../assertions.js';
import {TR} from '../skipped-section.js';

// No refusal is defined for the sentence, so there is no implementation
// negative.
const NO_REFUSAL =
  'no refusal is defined by this sentence; no implementation negative yet';

const should = chai.should();
const {match} = filterByTag({tags: [VCALM_TAG]});
const verifiers = filterByTag({property: 'verifiers', tags: [VCALM_TAG]}).match;
const pairs = implementationsWithIssuerAndVerifier(match, VCALM_TAG);

// ProblemDetails objects in a verify response: the problemDetails array of a
// 200 VerificationResult, or an RFC 9457 body on an error status.
function problemDetailsIn({data, result}) {
  if(!data || typeof data !== 'object') {
    return [];
  }
  if(result.status === 200) {
    return Array.isArray(data.problemDetails) ? data.problemDetails : [];
  }
  return data.type !== undefined ? [data] : [];
}

describeNormativeStatement({
  section: 'Error Handling',
  match: verifiers,
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['3-8-error-handling-1'],
    link: `${TR}#error-handling`,
    subtests({endpoints}) {
      return [{
        name: 'positive: each problem detail reported for an invalid VC ' +
          'has a type that is a URL',
        run: async () => {
          const {data, result, error} = await endpoints.verifyCredential(
            createVerifyCredentialWithoutProof(),
            {returnProblemDetails: true});
          should.exist(result, `Expected an HTTP response: ${error?.message}`);
          shouldBeListedStatus(result.status, 'verifyCredential');
          const problems = problemDetailsIn({data, result});
          if(problems.length === 0) {
            throw new NotApplicable(`HTTP ${result.status} carried no ` +
              'ProblemDetails, so the type key could not be checked.');
          }
          for(const problem of problems) {
            shouldBeProblemDetails(problem);
          }
        }
      }, {
        name: 'negative: a problem detail without type',
        run: async () => {
          throw new NotApplicable(NO_REFUSAL);
        }
      }];
    }
  }]
});

// Both 3.8.1 statements share the same pair of checks: a VC the
// implementation issued (no error, so verified is true) and the same VC with
// its proof removed (an error, so verified is false). The second is a control
// pair with the first: only the proof differs.
function verificationPair(endpoints) {
  return [{
    name: 'positive: verified is true for a VC with no error',
    run: async () => {
      const issuedVc = await endpoints.issue();
      should.exist(issuedVc, 'Expected the issuer to issue a VC.');
      const {data, result, error} = await endpoints.verifyCredential(
        issuedVc);
      should.exist(result, `Expected an HTTP response: ${error?.message}`);
      result.status.should.equal(200,
        'Expected 200 for a VC the implementation issued.');
      should.exist(data, 'Expected a VerificationResult body.');
      // problemDetails may hold warnings, which do not change verified.
      data.verified.should.equal(true);
    }
  }, {
    name: 'negative: verified is false when an error is reported (the ' +
      'issued VC with its proof removed)',
    run: async () => {
      const issuedVc = await endpoints.issue();
      should.exist(issuedVc, 'Expected the issuer to issue a VC.');
      const withoutProof = {...issuedVc};
      delete withoutProof.proof;
      const {data, result, error} = await endpoints.verifyCredential(
        withoutProof, {returnProblemDetails: true});
      should.exist(result, `Expected an HTTP response: ${error?.message}`);
      shouldBeListedStatus(result.status, 'verifyCredential');
      // 400 is a listed refusal with no body in the OpenAPI, so no
      // VerificationResult is required with it
      if(result.status === 400) {
        return;
      }
      should.exist(data, 'Expected a VerificationResult body with 200.');
      data.verified.should.equal(false,
        'Expected verified false for a VC without a proof.');
    }
  }];
}

describeNormativeStatement({
  section: 'Verification Errors vs. Warnings',
  match: pairs,
  columnLabel: 'Error Handling',
  statements: [{
    statement: NORMATIVE['3-8-1-verification-errors-vs-warnings-1'],
    link: `${TR}#verification-errors-vs-warnings`,
    subtests: ({endpoints}) => verificationPair(endpoints)
  }, {
    statement: NORMATIVE['3-8-1-verification-errors-vs-warnings-2'],
    link: `${TR}#verification-errors-vs-warnings`,
    subtests: ({endpoints}) => verificationPair(endpoints)
  }]
});
