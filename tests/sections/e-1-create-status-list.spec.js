/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Each check is labelled `E.1 (n): what it does`.
//
// (1) is a MAY statement and has no row. (2) says status updates that depend
// on an allocation state reuse its indexAllocator. The suite does not create
// status lists, so the allocation state is the one the status entry names in
// `options.indexAllocator`: the issuer assigns the credential's index, and the
// status update must then reuse that value. The suite reads the statement as
// binding what the status service accepts: an update with that value is
// accepted, and one with another value is refused. An entry without
// `options.indexAllocator` has a single default allocator, so the row does
// not apply. Omitting the value is not checked: the spec allows it when the
// implementation can infer the allocator, and does not require it otherwise.

import {
  NotApplicable, setupStatementMatrix, statementTest
} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';
import {filterByTag} from 'vc-test-suite-implementations';
import {randomUUID} from 'node:crypto';
import {shouldBeListedRefusal} from '../openapi.js';
import {shouldUpdateCredentialStatus} from '../assertions.js';
import {VCALM_TAG} from '../helpers.js';

const {expect} = chai;

const {match: implementations} = filterByTag(
  {property: 'status', tags: [VCALM_TAG]});

// Issues a credential with a status entry and returns the update body for
// it, without an indexAllocator.
async function issuedStatusUpdate(endpoints) {
  if(!endpoints.issuer) {
    throw new NotApplicable(
      'needs an issuers entry to issue a credential with a status');
  }
  const credentialId = `urn:uuid:${randomUUID()}`;
  const issued = await endpoints.issueCredential(undefined, {credentialId});
  expect(issued.result?.status, 'issue').to.equal(201);
  const credentialStatus = [issued.issuedVc?.credentialStatus].flat()[0];
  expect(credentialStatus, 'the issued credentialStatus').to.be.an('object');
  return {credentialId, credentialStatus, status: true};
}

describe('Create Status List', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, role: 'status',
        rowId: 'e-1-create-status-list-2'
      }, async ({endpoints, accepts, refuses}) => {
        const indexAllocator =
          endpoints.status?.settings.options?.indexAllocator;
        const allocated = async () => {
          if(indexAllocator === undefined) {
            throw new NotApplicable('the status entry names no ' +
              'indexAllocator, so the service has a single default');
          }
          return issuedStatusUpdate(endpoints);
        };
        await accepts('E.1 (2): an update with the same indexAllocator',
          async () => {
            const body = await allocated();
            const {result} = await endpoints.updateCredentialStatus(
              {...body, indexAllocator});
            shouldUpdateCredentialStatus({result});
          });
        await refuses('E.1 (2): an update with another indexAllocator',
          async () => {
            const body = await allocated();
            const {result, error} = await endpoints.updateCredentialStatus(
              {...body, indexAllocator: `urn:uuid:${randomUUID()}`});
            shouldBeListedRefusal({
              result: result ?? error?.response, operation: 'updateStatus'
            });
          });
      });
    });
  }
});
