/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Each statement is one test per implementation (see statementTest in
// ../statement-test.js). Both are about the response to a GET of the
// interaction URL, so each has one responds check per `interactionUrl`
// (../interactions.js). The URL must be live for the run.

import {
  eachInteractionUrl, fetchInteraction, interactionImplementations
} from '../interactions.js';
import {setupStatementMatrix, statementTest} from '../statement-test.js';
import chai from 'chai';
import {describe} from 'mocha';

const {expect} = chai;
const implementations = interactionImplementations();

// An Accept value no implementation is expected to recognize.
const UNRECOGNIZED_ACCEPT = 'application/x-vcalm-test-unrecognized';

describe('Interaction Protocols Response', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: '3-7-4-interaction-protocols-response-1'
      }, async ({responds}) => {
        await eachInteractionUrl(
          {implementation, responds, prefix: '3.7.4 (1)'}, async url => {
            const {status, body} = await fetchInteraction(
              {url, accept: 'application/json'});
            expect(status, 'Expected status 200.').to.equal(200);
            let data;
            try {
              data = JSON.parse(body);
            } catch(e) {
              throw new Error(`Expected a JSON body: ${e.message}`);
            }
            expect(data, 'Expected a JSON object.').to.be.an('object')
              .that.is.not.an('array');
            const {protocols} = data;
            expect(protocols, 'Expected protocols to be an object.')
              .to.be.an('object').that.is.not.an('array');
            const entries = Object.entries(protocols);
            expect(entries, 'Expected at least one protocol.')
              .to.not.be.empty;
            for(const [id, value] of entries) {
              expect(typeof value === 'string' && URL.canParse(value),
                `Expected protocols.${id} to be a URL.`).to.equal(true);
            }
          });
      });

      statementTest({
        name, implementation, rowId: '3-7-4-interaction-protocols-response-2'
      }, async ({responds}) => {
        await eachInteractionUrl(
          {implementation, responds, prefix: '3.7.4 (2)'}, async url => {
            const {status, contentType} = await fetchInteraction(
              {url, accept: UNRECOGNIZED_ACCEPT});
            expect(status, 'Expected status 200.').to.equal(200);
            expect(contentType.split(';')[0].trim().toLowerCase(),
              'Expected a text/html document.').to.equal('text/html');
          });
      });
    });
  }
});
