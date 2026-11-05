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
  section: 'Options',
  match,
  columnLabel: 'Issuer',
  statements: [{
    statement: NORMATIVE['options-5'],
    link: `${TR}#options`,
    subtests({endpoints}) {
      return [{
        name: 'negative: an issue request with an unknown option is rejected',
        run: async () => {
          const {result} = await endpoints.issueWithUnknownOption();
          should.exist(result, 'Expected an HTTP response.');
          result.status.should.be.within(
            400, 499, 'Expected a client error for an unknown option.');
        }
      }];
    }
  }]
});
