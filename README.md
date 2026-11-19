# VCALM Interoperability Test Suite

Interoperability tests for implementations of
[VCALM](https://www.w3.org/TR/vcalm-1.0/) (Verifiable Credential API for
Lifecycle Management).

## Strategy

| Layer | Tool | Where |
|-------|------|--------|
| Normative statements | Mocha | `tests/<section>/` (one folder per VCALM section), plus `tests/Coverage/` for untested MUST and REQUIRED statements |
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
`tests/*.js` and are excluded from the `tests/*/**/*.js` glob).

## Normative statements and the results matrix

`tests/normative-statements.js` holds every sentence in the
[VCALM TR](https://www.w3.org/TR/vcalm-1.0/) that contains an RFC 2119 keyword
(MUST, MUST NOT, SHOULD, MAY, REQUIRED, and so on). Each value is the spec's own
text, and the file is generated from the spec. Do not edit it by hand.

It exports three things:

- `NORMATIVE`: key to sentence. Keys are `<section>-<n>`, for example
  `3-2-1-issue-credential-1`.
- `SECTION`: key to the spec section heading.
- `REQUIRED`: the keys whose sentence contains MUST or REQUIRED. The results
  matrix shows only these.

Each matrix row is one of two kinds:

- **Live rows.** A test refers to a statement with `NORMATIVE['<key>']` and
  checks it.
- **Skipped rows.** `tests/Coverage/normative-coverage.js` adds a skipped row for
  each MUST or REQUIRED statement that no other test file has a row for. Every
  row is recorded as the test files load (see `tests/coverage-registry.js`), so
  adding a live test needs no change to the coverage file.

When the spec changes, regenerate `tests/normative-statements.js` from the TR
and check that every key a test uses still exists. Statement text must match the
spec exactly, so a changed spec sentence changes the matrix row.

## Install

```sh
npm install --legacy-peer-deps
```

`--legacy-peer-deps` avoids peer-resolution conflicts between Mocha 11 and older
devDependency trees (Chai OpenAPI).

## Instructions for implementers

To add your implementation, add endpoints tagged `VCALM` to it in
[vc-test-suite-implementations](https://github.com/w3c/vc-test-suite-implementations),
or locally in `localConfig.cjs` at the root of this suite
(`localConfig.example.cjs` is a template):

```js
module.exports = {
  settings: {},
  implementations: [{
    name: 'My implementation',
    issuers: [{
      id: 'did:web:vcalm.example',
      endpoint: 'https://vcalm.example',
      tags: ['VCALM']
    }],
    verifiers: [{
      endpoint: 'https://vcalm.example',
      tags: ['VCALM']
    }]
  }]
};
```

Register only the roles your implementation has. Tests that need a role you
did not register are not run for your implementation.

Each `endpoint` is the root of your VCALM service, and the suite adds the
paths from the specification. A role whose operations live under a different
root gets its own `endpoint`.

| Role key | Paths the suite adds | Used by |
|----------|----------------------|---------|
| `issuers` | `/credentials/issue`, `/credentials/{id}` | issuing, and the credentials other tests verify |
| `verifiers` | `/credentials/verify`, `/presentations/verify`, `/challenges` | verifying credentials and presentations |
| `holders` | `/presentations`, `/presentations/{id}`, `/credentials/derive` | creating the presentations that verifier tests send |
| `workflows` | `/workflows`, `/workflows/{id}/...` | workflows and exchanges |
| `interactions` | `/interactions/{id}` | interaction URLs and protocols |
| `status` | `/credentials/status` | status updates |

An `endpoint` that already ends with one of these operation paths, such as
`https://vcalm.example/credentials/issue`, also works, so entries written for
the other VC test suites can be reused.

An `issuers` or `holders` entry may also carry `headers` and `oauth2`
settings, which the suite uses for its requests to that endpoint.

### Running locally

```sh
cp localConfig.example.cjs localConfig.cjs
# edit the endpoints, then:
npm test
```

To test an implementation that runs locally with a self-signed certificate,
allow self-signed certificates:

```sh
NODE_TLS_REJECT_UNAUTHORIZED=0 npm test
```

| Variable | Effect |
|----------|--------|
| `NODE_TLS_REJECT_UNAUTHORIZED=0` | Accept self-signed HTTPS certificates |
| `VCALM_OPENAPI=0` | Skip the OpenAPI response checks |
| `VCALM_FIXTURE=1` | Also run the fixture-only tests (§3.4 presentation request shapes, workflow configuration fixtures) |

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
