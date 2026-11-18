/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {hasTaggedEndpoint, VCALM_TAG} from '../helpers.js';
import {
  shouldRejectMalformedStatusRequest,
  shouldReturnHttpResult,
  shouldUpdateCredentialStatus
} from '../assertions.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {randomUUID} from 'node:crypto';

const tag = VCALM_TAG;
const {match: issuers} = filterByTag({property: 'issuers', tags: [tag]});
const {match: statusServices} = filterByTag({property: 'status', tags: [tag]});
const match = new Map([...statusServices].filter(([name, implementation]) =>
  issuers.has(name) && hasTaggedEndpoint(implementation, 'issuers', tag)));
const link = 'https://www.w3.org/TR/vcalm-1.0/#conformance';

describeNormativeStatement({
  section: 'Conformance',
  statement: NORMATIVE['1-3-conformance-7'],
  link,
  match,
  columnLabel: 'Status',
  subtests({endpoints}) {
    return [
      {
        name: 'positive: POST /credentials/status updates an issued ' +
          'credential',
        run: async () => {
          // The status purpose comes from the issuer's status list options.
          // The VCALM issue options do not define one. The credential is
          // referred to by the `credentialId` the issue request sets.
          const credentialId = `urn:uuid:${randomUUID()}`;
          const issued = await endpoints.issueCredential(undefined, {
            credentialId
          });
          shouldReturnHttpResult(issued);
          issued.result.status.should.equal(201, 'Expected status code 201.');
          const credential = issued.issuedVc;
          const credentialStatus = Array.isArray(credential?.credentialStatus) ?
            credential.credentialStatus[0] :
            credential?.credentialStatus;
          const {result} = await endpoints.updateCredentialStatus({
            credentialId,
            credentialStatus,
            status: false
          });
          shouldUpdateCredentialStatus({result});
        }
      },
      {
        name: 'negative: POST /credentials/status with an empty body is ' +
          'rejected',
        run: async () => {
          const {result, error} = await endpoints.updateCredentialStatus({});
          shouldRejectMalformedStatusRequest({
            result: result ?? error?.response
          });
        }
      }
    ];
  }
});
