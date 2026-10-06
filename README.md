# VCALM Interoperability Test Suite

Interoperability tests for implementations of
[VCALM](https://www.w3.org/TR/vcalm-1.0/) (Verifiable Credential API for
Lifecycle Management).

## Branches

| Branch | Contents |
|--------|----------|
| `feature/vcalm-required-endpoints` | Required issuer and verifier POSTs, plus Chai OpenAPI checks |
| `feature/vcalm-docs` | Coverage matrix, normative traceability, stats (`docs/` tree) |

## Strategy

| Layer | Tool | Where |
|-------|------|--------|
| Normative statements | Mocha | `tests/3.2-Issuing`, `tests/3.3-Verifying` |
| Response shape | Chai OpenAPI | `docs/openapi/oas.bundled.json` via `tests/openapi.js` |

Mocha tests are adapted from the CCG
[vc-api-issuer-test-suite](https://github.com/w3c-ccg/vc-api-issuer-test-suite)
and
[vc-api-verifier-test-suite](https://github.com/w3c-ccg/vc-api-verifier-test-suite),
extended with **negative fixtures** (malformed issue requests, foreign
credentials/presentations) to catch stub implementations. Successful responses
for the three required POSTs are also checked against the bundled VCALM OpenAPI
document. This suite does
**not** run VCDM or crypto interop suites — it uses minimal fixture credentials
sufficient to exercise the API.

Mocha tests under `tests/<section>/` mirror the VCALM TOC (helpers live at
`tests/*.js` and are excluded from the `tests/*/**/*.js` glob). Per-file
coverage matrix: branch `feature/vcalm-docs` → `docs/test-coverage.md`.

## Install

```sh
npm install --legacy-peer-deps
```

`--legacy-peer-deps` avoids peer-resolution conflicts between Mocha 11 and older
devDependency trees (Chai OpenAPI).

## Setup

Endpoints must follow the VCALM / VC-API shape:

- `POST /credentials/issue`
- `POST /credentials/verify`
- `POST /presentations/verify`

### Local testing

```sh
cp localConfig.example.cjs localConfig.cjs
# edit endpoints, then:
npm test
```

Override the API base URL:

```sh
BASE_URL=https://localhost:8000 npm test
```

### VC Dojo (localhost)

Terminal 1 — start the server:

```sh
cd vc-dojo && ./scripts/dev-server.sh
```

Terminal 2 — run the suite (point `localConfig.cjs` at `https://localhost:8000`):

```sh
cd test-suites/vcalm-test-suite
NODE_TLS_REJECT_UNAUTHORIZED=0 npm test
```

| Variable | Default | Meaning |
|----------|---------|---------|
| `NODE_TLS_REJECT_UNAUTHORIZED=0` | — | Allow self-signed HTTPS for local dev |
| `VCALM_OPENAPI=0` | validation on | Skip OpenAPI response checks |

### Role registration

Tag each registered endpoint with `VCALM`. Register only roles your deployment
implements — tests skip missing pairings (e.g. no VP path without `holders` +
`verifiers`).

| Profile | Register | Enables |
|---------|----------|---------|
| Issuer only | `issuers` | §1.3 issuer, §2.4.1/2.4.2, §3.2.1, §3.2.6 |
| Verifier only | `verifiers` | §1.3 verifier smoke, §3.3.4–5 |
| Issuer + verifier | `issuers`, `verifiers` | + §3.3.1, §3.3.4, §3.8.1 (VC) |
| Full §1.3 core | above + `holders` | + §3.3.2, §3.3.5, §3.5.2, §3.8.1 (VP) |

**Verifier — one entry, two operations.** There is no separate `vpVerifiers` key.
A single `verifiers` entry satisfies §1.3 (verify credential and verify
presentation). The suite derives the sibling path from `endpoint`:

- `…/credentials/verify` → VP at `…/presentations/verify` (path swap)
- Gateway root → both paths appended under the root

| Role key | Typical `endpoint` |
|----------|-------------------|
| `issuers` | `…/credentials/issue` or gateway root |
| `verifiers` | `…/credentials/verify` or gateway root |
| `holders` | `…/presentations` or gateway root |
| `workflows` | `…/workflows` or gateway root (optional) |
| `interactions` | gateway root or `…/interactions` (optional) |

Optional endpoints that return **404** or **501** are skipped. See
`localConfig.example.cjs` for unified-gateway vs explicit-path templates.

### Optional profiles

| Tag / env | Enables |
|-----------|---------|
| `VCALM_FIXTURE=1` | Fixture-only §3.4 VPR shape tests and workflow config fixtures |

Default `npm test` skips fixture suites unless `VCALM_FIXTURE=1`.

Explicit paths:

```js
issuers: [{ endpoint: `${baseUrl}/credentials/issue`, tags: ['VCALM'] }],
holders: [{ endpoint: `${baseUrl}/presentations`, tags: ['VCALM'] }],
verifiers: [{ endpoint: `${baseUrl}/credentials/verify`, tags: ['VCALM'] }],
```

Unified gateways may use one `baseUrl` for all roles (see `localConfig.example.cjs`).

## Implementation registration

Register implementations in
[`w3c/vc-test-suite-implementations`](https://github.com/w3c/vc-test-suite-implementations)
with tag `VCALM` on issuer, verifier, and holder endpoints (and
`workflows` / `VCALM:status` for optional profiles).

## OpenAPI response checks

`npm test` checks successful responses for:

- `POST /credentials/issue` (201, `verifiableCredential`)
- `POST /credentials/verify` (200)
- `POST /presentations/verify` (200)

against `docs/openapi/oas.bundled.json`, bundled from
`https://w3c.github.io/vcalm/oas.yaml` (version `0.9-unstable`). One `$ref`
in that file points at `../components/ExchangeVerifiablePresentation.yml`;
the bundle resolves it to
`https://w3c.github.io/vcalm/components/ExchangeVerifiablePresentation.yml`.
The published `servers` entry is one example host, so the bundle uses `/`
as the service root. The test HTTP client unwraps `verifiableCredential`
before assertions run; the checker puts that property back before comparing
the issue response to the schema.

Set `VCALM_OPENAPI=0` to skip these checks.

## Report

`npm test` writes:

- W3C interoperability matrix — `reports/index.html` and `reports/index.json`
- Mocha suite log — `suite.log`

`reports/` is gitignored except `.gitkeep`; regenerate locally after each run.

## License

See [LICENSE.md](LICENSE.md).
