/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

const Handlebars = require('handlebars');

// Test suites title matrices with their spec section number ("3.3.3 Create
// Challenge"); template headings do not, so compare without the number.
function stripSectionNumber(title) {
  return title.replace(/^\d+(\.\d+)*\s+/, '');
}

// Matrices rendered by a slot, so the fallback can list the rest.
function placedSet(root) {
  root.placedMatrices = root.placedMatrices || new Set();
  return root.placedMatrices;
}

Handlebars.registerHelper('matrixByTitle', (title, options) => {
  const root = options.data.root;
  const placed = placedSet(root);
  const matches = (root.matrices || []).filter(item =>
    stripSectionNumber(item.title) === stripSectionNumber(title) &&
    item.rows?.length > 0);
  if(matches.length === 0) {
    return '';
  }
  for(const matrix of matches) {
    placed.add(matrix);
  }
  return matches.map(matrix => options.fn(matrix)).join('');
});

// Matrices with results that no slot rendered.
Handlebars.registerHelper('unplacedMatrices', function(options) {
  const root = options.data.root;
  const placed = placedSet(root);
  return (root.matrices || []).filter(item =>
    item.rows?.length > 0 && !placed.has(item) && item.title !== 'At Risk');
});
