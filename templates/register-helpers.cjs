/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

const Handlebars = require('handlebars');

Handlebars.registerHelper('matrixByTitle', (title, options) => {
  const matrices = options.data.root.matrices || [];
  const matches = matrices.filter(item => item.title === title);
  if(matches.length === 0) {
    return '';
  }
  return matches.map(matrix => options.fn(matrix)).join('');
});
