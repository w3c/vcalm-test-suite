/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

const Handlebars = require('handlebars');

Handlebars.registerHelper('matrixByTitle', (title, options) => {
  const matrices = options.data.root.matrices || [];
  const matrix = matrices.find(item => item.title === title);
  if(!matrix) {
    return '';
  }
  return options.fn(matrix);
});
