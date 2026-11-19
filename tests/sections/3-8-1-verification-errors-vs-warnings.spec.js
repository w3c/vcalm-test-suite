/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `3.8.1 (n): what it does`.
//
// Both statements are about the verifier's own VerificationResponse, so they
// have responds checks. (1) verifies a credential and a presentation changed
// after signing, which must include errors; a response that includes none is
// not applicable. (2) verifies valid ones. Which entries count as errors is
// read as in includedErrors (../problem-details.js).

import {
  includedErrors, presentationToVerify, tamperedCredential
} from '../problem-details.js';
import {NotApplicable, setupStatementMatrix, statementTest} from
  '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {testCredential} from '../signing.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const {match: implementations} = filterByTag(
  {property: 'verifiers', tags: [VCALM_TAG]});

function shouldBeVerifiedFalseWithErrors({data} = {}) {
  if(!data || typeof data !== 'object' || includedErrors(data).length === 0) {
    throw new NotApplicable('the response includes no errors');
  }
  expect(data.verified, 'verified').to.equal(false);
}

function shouldBeVerifiedTrueWithoutErrors({data} = {}) {
  expect(data, 'Expected a VerificationResponse.').to.be.an('object');
  const errors = includedErrors(data);
  if(errors.length > 0) {
    throw new NotApplicable('the response includes errors (' +
      errors.map(({path}) => path).join(', ') + ')');
  }
  expect(data.verified, 'verified').to.equal(true);
}

async function verifyPresentation(endpoints, {tampered}) {
  const {presentation, challenge, domain} =
    await presentationToVerify({tampered});
  return endpoints.verifyPresentation(presentation, {challenge, domain});
}

describe('Verification Errors vs. Warnings', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, role: 'verifier',
        rowId: '3-8-1-verification-errors-vs-warnings-1'
      }, async ({endpoints, responds}) => {
        await responds('3.8.1 (1): a credential that fails verification',
          async () => shouldBeVerifiedFalseWithErrors(
            await endpoints.verifyCredential(await tamperedCredential())));
        await responds('3.8.1 (1): a presentation that fails verification',
          async () => shouldBeVerifiedFalseWithErrors(
            await verifyPresentation(endpoints, {tampered: true})));
      });

      statementTest({
        name, implementation, role: 'verifier',
        rowId: '3-8-1-verification-errors-vs-warnings-2'
      }, async ({endpoints, responds}) => {
        await responds('3.8.1 (2): a valid credential', async () =>
          shouldBeVerifiedTrueWithoutErrors(
            await endpoints.verifyCredential(await testCredential())));
        await responds('3.8.1 (2): a valid presentation', async () =>
          shouldBeVerifiedTrueWithoutErrors(
            await verifyPresentation(endpoints, {tampered: false})));
      });
    });
  }
});
