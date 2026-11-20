/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). The statement is about the interaction URL the
// implementation supplies, so it has one responds check per `interactionUrl`
// (../interactions.js), labelled `3.7.1 (1): the <role> interactionUrl`.

import {
  eachInteractionUrl, interactionImplementations
} from '../interactions.js';
import {setupStatementMatrix, statementTest} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';

const {expect} = chai;
const implementations = interactionImplementations();

describe('Interaction URL Format', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: '3-7-1-interaction-url-format-1'
      }, async ({responds}) => {
        await eachInteractionUrl(
          {implementation, responds, prefix: '3.7.1 (1)'}, async url => {
            expect(url, 'Expected the interaction URL to be a string.')
              .to.be.a('string');
            expect(URL.canParse(url),
              `Expected "${url}" to parse as a URL.`).to.equal(true);
            const iuv = new URL(url).searchParams.getAll('iuv');
            expect(iuv, 'Expected one iuv query parameter with value 1.')
              .to.deep.equal(['1']);
          });
      });
    });
  }
});
