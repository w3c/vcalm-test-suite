<!--
SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
-->

# w3c/vcalm-test-suite ChangeLog

## 0.2.0 - 2026-11-dd

### Added

- `tests/normative-statements.js` holds every sentence the VCALM TR marks as
  normative, keyed by section. It is generated from the spec.
- `tests/Coverage/normative-coverage.js` adds a skipped results-matrix row for
  each MUST and REQUIRED statement that no live test covers.
- `tests/sections/1-3-conformance.spec.js`: the 1.3 Conformance rows in the
  Recognized Entities test pattern (`tests/statement-test.js`), with labelled
  accepts and refuses checks. Verifier checks use a test issuer and test
  holder (`tests/signing.js`, `eddsa-rdfc-2022`).
- `tests/normative-links.js` and `scripts/build-links.mjs`: a link to each
  statement's sentence in the TR.
- `tests/sections/3-6-1-create-workflow.spec.js` and
  `tests/sections/3-6-5-get-current-exchange-vpr.spec.js`: the 3.6 rows in the
  new pattern. 3.6.5 (1) and (3) check the current exchange request of a step
  with and without a verifiable presentation request.
- Workflow entries can set `options`, merged into create workflow requests,
  and a `zcap`, with which the suite signs requests to the workflows it
  creates.
- `tests/sections/2-4-1-authorization.spec.js`,
  `tests/sections/2-4-2-options.spec.js` and
  `tests/sections/2-4-3-content-serialization.spec.js`: the 2.4 rows in the
  new pattern. 2.4.2 (5) sends issuers and verifiers the same request with and
  without an unknown option. 2.4.3 (1) checks that issue and verify responses
  are JSON, and that an issuer refuses a body that is not JSON (skipped for an
  issuer entry with a `zcap`). 2.4.1 (1) is skipped: it binds clients.

### Changed

- Statement text matches the TR word for word, including section numbers.
- The results matrix shows MUST and REQUIRED statements only.
- Negative test titles moved from `tests/normative-statements.js` into
  `tests/negative-fixtures.js`.
- Query by example and DID Authentication rows come from the TR statements in
  those sections, replacing the hand-picked statements that the TR does not
  contain.
- Statements that the TR does not state are removed.
- Statements are regenerated from the current TR, keeping only sentences the
  TR marks as normative (89, of which 45 are MUST or REQUIRED). Keywords in
  OpenAPI descriptions are checked by OpenAPI response validation instead.
- Refusals in the new section files must use a status the OpenAPI lists.
- The workflow conformance check no longer posts an exchange step callback,
  which the specification describes as optional.
- The status conformance check issues with `credentialId` instead of a
  `statusPurpose` option, which VCALM does not define. Status updates merge the
  status entry's `options` (for example `indexAllocator`), and their 200 is not
  required to have a body, which the OpenAPI does not define.

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
