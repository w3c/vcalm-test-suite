/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import chai from 'chai';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
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
      }];
    }
  }]
});
