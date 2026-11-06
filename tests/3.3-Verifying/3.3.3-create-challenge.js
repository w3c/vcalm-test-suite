/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {shouldCreateChallenge} from '../assertions.js';
import {TR} from '../skipped-section.js';
import {VCALM_TAG} from '../helpers.js';

const {match} = filterByTag({property: 'verifiers', tags: [VCALM_TAG]});

describeNormativeStatement({
  section: '3.3.3 Create Challenge',
  match,
  columnLabel: 'Verifier',
  statements: [{
    statement: NORMATIVE['3-3-3-create-challenge-1'],
    link: `${TR}#create-challenge`,
    subtests({endpoints}) {
      return [{
        name: 'positive: POST /challenges returns a challenge object',
        run: async () => {
          const {data, result, error} = await endpoints.createChallenge();
          shouldCreateChallenge({data, result, error});
        }
      }];
    }
  }]
});
