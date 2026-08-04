<!--
SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
-->

# w3c/vcalm-test-suite ChangeLog

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
