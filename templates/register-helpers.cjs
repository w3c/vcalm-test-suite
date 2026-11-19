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

// The text of a matrix row. Rows from tests/sections/ use the statement key as
// their id and carry the spec sentence in each cell as `statement`. Rows the
// reporter marks at risk lose their cells, so their text comes from the
// registry the tests fill (row key -> statement text). Older rows use the
// sentence itself as their id.
Handlebars.registerHelper('rowStatement', row => {
  const cell = (row?.cells ?? []).find(c => c?.cell?.statement);
  if(cell) {
    return cell.cell.statement;
  }
  return globalThis.interopRowText?.[row?.id] ?? (row?.id ?? '');
});
