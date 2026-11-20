/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). (2) has one responds check per `interactionUrl`
// (../interactions.js). It checks only the MUST NOT part; "SHOULD NOT exceed
// 400" is not tested. (1) binds whoever renders the QR code.

import {
  eachInteractionUrl, interactionImplementations
} from '../interactions.js';
import {setupStatementMatrix, statementTest} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';

const {expect} = chai;
const implementations = interactionImplementations();
const MAX_LENGTH = 4296;

describe('Interaction QR Code Format', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: '3-7-2-interaction-qr-code-format-1',
        skip: 'not tested: the statement binds the software that renders ' +
          'the QR code; implementations supply an interaction URL, not an ' +
          'image'
      });

      statementTest({
        name, implementation, rowId: '3-7-2-interaction-qr-code-format-2'
      }, async ({responds}) => {
        await eachInteractionUrl(
          {implementation, responds, prefix: '3.7.2 (2)'}, async url => {
            expect(url.length,
              `Expected at most ${MAX_LENGTH} characters.`)
              .to.be.at.most(MAX_LENGTH);
          });
      });
    });
  }
});
