/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  createIssueBodyCredentialWithoutType,
  createIssueBodyEmpty,
  createIssueBodyMissingCredential
} from '../negative-fixtures.js';
import {
  shouldBeIssuedVc,
  shouldRejectMalformedIssueRequest,
  shouldReturnHttpResult
} from '../assertions.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {VCALM_TAG} from '../helpers.js';

const tag = VCALM_TAG;
const {match} = filterByTag({property: 'issuers', tags: [tag]});
const link = 'https://www.w3.org/TR/vcalm-1.0/#conformance';

function rejectIssue(endpoints, body) {
  return async function() {
    const {result, error} = await endpoints.issueCredentialWithBody(body);
    shouldRejectMalformedIssueRequest({
      result: result ?? error?.response
    });
  };
}

describeNormativeStatement({
  section: 'Issuer',
  statement: NORMATIVE.conformance.issuer,
  link,
  match,
  columnLabel: 'Issuer',
  subtests({endpoints}) {
    return [
      {
        name: 'positive: POST /credentials/issue returns a verifiable ' +
          'credential',
        run: async () => {
          const {data, result, error} = await endpoints.issueCredential();
          shouldReturnHttpResult({result, error});
          result.status.should.equal(201, 'Expected status code 201.');
          shouldBeIssuedVc({data, result});
        }
      },
      {
        name: 'negative: POST /credentials/issue with no credential is ' +
          'rejected',
        run: rejectIssue(endpoints, createIssueBodyMissingCredential())
      },
      {
        name: 'negative: POST /credentials/issue with an empty body is ' +
          'rejected',
        run: rejectIssue(endpoints, createIssueBodyEmpty())
      },
      {
        name: 'negative: POST /credentials/issue without credential.type ' +
          'is rejected',
        run: rejectIssue(endpoints, createIssueBodyCredentialWithoutType())
      }
    ];
  }
});
