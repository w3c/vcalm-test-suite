/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// The one statement binds software that builds an `interaction:` or
// `web+interaction:` URL. Implementations supply the interaction URL, and a
// scheme URL the suite builds would only test the suite, so the row is
// skipped (see statementTest in ../statement-test.js).

import {setupStatementMatrix, statementTest} from '../statement-test.js';
import {describe} from 'mocha';
import {interactionImplementations} from '../interactions.js';

const implementations = interactionImplementations();

describe('Interaction Scheme Format', function() {
  setupStatementMatrix({suite: this, names: [...implementations.keys()]});

  for(const [name, implementation] of implementations) {
    describe(name, function() {
      statementTest({
        name, implementation, rowId: '3-7-3-interaction-scheme-format-1',
        skip: 'not tested: the statement binds the software that builds the ' +
          'interaction: or web+interaction: URL; implementations supply the ' +
          'interaction URL'
      });
    });
  }
});
