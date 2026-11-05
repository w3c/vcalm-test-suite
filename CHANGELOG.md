<!--
SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
-->

# w3c/vcalm-test-suite ChangeLog

## 0.2.0 - 2026-11-dd

### Added

- `tests/normative-statements.js` holds every VCALM TR sentence with an RFC
  2119 keyword (138), keyed by section. It is generated from the spec.
- `tests/Coverage/normative-coverage.js` adds a skipped results-matrix row for
  each MUST and REQUIRED statement that no live test covers.

### Changed

- Statement text matches the TR word for word, including section numbers.
- The results matrix shows MUST and REQUIRED statements only.
- Negative test titles moved from `tests/normative-statements.js` into
  `tests/negative-fixtures.js`.
- Query by example and DID Authentication rows come from the TR statements in
  those sections, replacing the hand-picked statements that the TR does not
  contain.
- Statements that the TR does not state are removed.

## 0.1.0 - 2026-07-07

### Added

- Initial npm project scaffold (`package.json`, `package-lock.json`).
- `README.md` with install, planned test layout, `localConfig` guidance, `VCALM`
  tag, and Mocha / OpenAPI notes.
- `tests/normative-statements.js` — 23 curated MUST, MUST NOT, and REQUIRED
  strings (one sentence per entry) for future Mocha `it()` titles.
- `tests/scaffold/pending.js` — skipped placeholder so `npm test` can run the
  interop reporter before behavioral tests land.
- ESLint config (`.eslintrc.cjs`, `.eslintignore`) and `.gitignore`.
- `abstract.hbs`, `respecConfig.json`, and `reports/.gitkeep` for W3C interop
  report output.
