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
  section: '3.2.2 Get a Specific Credential',
  match,
  columnLabel: 'Issuer',
  statements: [{
    statement: NORMATIVE['3-2-2-get-a-specific-credential-1'],
    link: `${TR}#get-a-specific-credential`,
    subtests({endpoints}) {
      return [{
        name: 'positive: GET of an issued credential does not return 418',
        run: async () => {
          const issuedVc = await endpoints.issue();
          should.exist(issuedVc, 'Expected the issuer to issue a VC.');
          const {result} = await endpoints.getCredential(issuedVc.id);
          should.exist(result, 'Expected an HTTP response.');
          result.status.should.not.equal(
            418, 'Expected a credential GET to be answered normally.');
        }
      }];
    }
  }]
});
