/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import chai from 'chai';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {NotApplicable} from '../not-applicable.js';
import {shouldBeListedStatus} from '../openapi.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const should = chai.should();
const {match} = filterByTag({property: 'issuers', tags: [VCALM_TAG]});

describeNormativeStatement({
  section: 'Content Serialization',
  match,
  columnLabel: 'Issuer',
  statements: [{
    statement: NORMATIVE['content-serialization-1'],
    link: `${TR}#content-serialization`,
    subtests({endpoints}) {
      return [{
        name: 'positive: an issue response is application/json',
        run: async () => {
          const {result} = await endpoints.issueCredential();
          should.exist(result, 'Expected an HTTP response.');
          const contentType = result.headers.get('content-type') ?? '';
          contentType.should.match(/^application\/json/);
        }
      }, {
        // The sentence requires request bodies to be JSON, and options-5
        // requires an error for data an endpoint cannot process. The control
        // is the positive above: the same endpoint accepts a JSON body.
        name: 'negative: a request body that is not valid JSON is refused',
        run: async () => {
          const settled = await endpoints.issueWithRawBody('{"credential":');
          if(!settled) {
            throw new NotApplicable('The issuer is reached through a zcap, ' +
              'which signs a JSON body, so a non-JSON body cannot be sent.');
          }
          should.exist(settled.result, 'Expected an HTTP response.');
          shouldBeListedStatus(settled.result.status, 'issueCredential');
          settled.result.status.should.not.equal(201,
            'Expected a body that is not JSON to be refused.');
        }
      }];
    }
  }]
});
