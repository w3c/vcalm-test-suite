# VCALM Interoperability Test Suite

Tests for implementations of
[VCALM](https://www.w3.org/TR/vcalm-1.0/) (Verifiable Credential API for
Lifecycle Management). The suite sends HTTP requests to your service and
checks the responses against every MUST and REQUIRED statement in the spec.
The result is a report with one row per statement and one column per
implementation.

## Quick start

You need Node.js 18.17 or later and a running VCALM service.

1. Install:

   ```sh
   git clone https://github.com/w3c/vcalm-test-suite.git
   cd vcalm-test-suite
   npm install --legacy-peer-deps
   ```

   `--legacy-peer-deps` is needed because one dev dependency (the Chai
   OpenAPI plugin) declares an older peer range.

2. Create your config and point it at your service:

   ```sh
   cp localConfig.example.cjs localConfig.cjs
   ```

   ```js
   // localConfig.cjs
   module.exports = {
     implementations: [{
       name: 'My implementation',
       issuers: [{
         id: 'did:example:issuer',
         endpoint: 'https://localhost:8443',
         tags: ['VCALM']
       }],
       verifiers: [{
         endpoint: 'https://localhost:8443',
         tags: ['VCALM']
       }]
     }]
   };
   ```

   `localConfig.cjs` is gitignored, so it stays on your machine.

3. Run the tests:

   ```sh
   npm test
   ```

   If your service uses a self-signed certificate:

   ```sh
   NODE_TLS_REJECT_UNAUTHORIZED=0 npm test
   ```

4. Open `reports/index.html` to see the results.

Start with the roles your service has. Rows for roles you leave out are
skipped, not failed, so you can add roles one at a time.

## Configuring your implementation

### Roles

Each role is a list of entries. The suite uses the first entry in each list
that has the tag `VCALM`.

| Role | Paths the suite adds to `endpoint` | Rows that use it |
|------|------------------------------------|------------------|
| `issuers` | `/credentials/issue`, `/credentials/{id}` | 1.3, 2.4, 3.2.1; status rows issue a credential first |
| `verifiers` | `/credentials/verify`, `/presentations/verify` | 1.3, 2.4, 3.8, 3.8.1 |
| `workflows` | `/workflows`, `/workflows/{id}/exchanges/...` | 1.3, 2.4.3, 3.4, 3.6, 3.8 |
| `status` | `/credentials/status` | 1.3, E.1 |
| `holders` | `/presentations`, `/credentials/derive` | none yet |

`endpoint` is the root of your VCALM service, and the suite adds the paths.
An `endpoint` that already ends with the operation path, such as
`https://vcalm.example/credentials/issue`, also works, so an entry written for
another VC test suite can be reused. A role whose operations live under a
different root gets its own `endpoint`.

The suite signs its own test credentials and presentations, so you can test
a verifier without an issuer or holder. They use Ed25519 `did:key` keys and
`eddsa-rdfc-2022` proofs over the VC v2 context
(`https://www.w3.org/ns/credentials/v2`). VCALM requires no particular DID
method or cryptosuite; this is the suite's baseline. The verifier rows, and the
workflow rows where the suite answers as a holder, pass only if your service
resolves `did:key` and verifies `eddsa-rdfc-2022`.

### Entry fields

| Field | Roles | Meaning |
|-------|-------|---------|
| `endpoint` | all | Service root or operation URL (required). |
| `tags` | all | Must include `VCALM`. Add `multiProofs` for 3.2.1 (see below). |
| `id` | `issuers` | The issuer DID, used as the `issuer` of the credentials the suite asks you to issue. |
| `options` | `issuers`, `verifiers`, `status`, `workflows` | Fields merged into each request body to that role (see below). |
| `zcap` | any | `{capability, keySeed}`: the suite signs its POST requests with `capability`. `keySeed` names an environment variable that holds the client's key seed. `capability` may be an object or a JSON string. |
| `headers`, `oauth2` | `issuers` | Extra headers, or OAuth2 client credentials, for requests to the issuer. `headers` must not carry credentials (an `Authorization` value, an API key or a token): section 2.4.1 forbids long-lived static credentials in requests, and the 2.4.1 row fails if any entry has one. Use `zcap` or `oauth2` instead. |
| `interactionUrl` | any | An interaction URL your service serves, for the 3.7 rows (see below). |
| `encryptionStep` | `workflows` | Step fields that ask the holder to encrypt the response, for the 3.4.1 encryption rows (see below). |

`options` supplies what the spec leaves to the implementation:

- **Issuers:** sent as the `options` of each issue request, for example
  `{cryptosuite: 'eddsa-rdfc-2022'}`. A `cryptosuite` array asks for a proof
  set: the first suite is sent as `cryptosuite`, the rest as
  `additionalCryptosuites`.
- **Verifiers:** sent as the `options` of each verify request, for example
  `{checks: ['proof']}`.
- **Status:** merged into each status update request, for example the
  `indexAllocator` your status list uses (E.1 reads it from here).
- **Workflows:** merged into each `POST /workflows` body. A key with a value
  adds or replaces that field; a key set to `null` removes it. For example,
  `id: null` lets the server generate the workflow ID.

### Optional features

These rows are skipped unless you opt in.

**Multiple proofs (3.2.1).** The spec requires an issuer that attaches
multiple proofs to return all of them from one issue call. Add a second
issuer entry, tagged `multiProofs`, for an issuer configured that way:

```js
issuers: [{
  id: 'did:example:issuer',
  endpoint: 'https://issuer.example/issuers/main',
  tags: ['VCALM']
}, {
  id: 'did:example:issuer',
  endpoint: 'https://issuer.example/issuers/two-proofs',
  tags: ['VCALM', 'multiProofs']
}]
```

The other rows keep using the first entry.

**Workflows.** A workflows entry often needs all three of `options`, `zcap`
and `encryptionStep`:

```js
workflows: [{
  endpoint: 'https://workflows.example',
  tags: ['VCALM'],
  // Merged into each POST /workflows body: adds a meter, and removes the
  // suite's id so the server generates one.
  options: {
    meter: 'https://workflows.example/meters/z19uMCiPNET4YbcPpBcab5mEE',
    id: null
  },
  // Signs the create request; the key seed is read from WORKFLOW_KEY_SEED.
  zcap: {
    capability: require('./workflow-create-zcap.json'),
    keySeed: 'WORKFLOW_KEY_SEED'
  },
  // Step fields that make a step ask the holder to encrypt the response.
  encryptionStep: {acceptedEncryption: {required: true}}
}]
```

With a `zcap`, the suite also sets each workflow's `controller` to the
client's DID (unless `options` sets one) and signs its coordinator requests
to that workflow (reading it, creating exchanges, reading exchange state) with
the workflow's root capability (`urn:zcap:root:<workflow URL>`). Requests a
holder makes (taking part in an exchange, reading its protocols or current
request) are sent unsigned, as a wallet sends them: VCALM needs no
authorization beyond the exchange URL to initiate an exchange.
VCALM defines no step field for requesting encryption, so `encryptionStep`
names your own.

**Interaction URLs (3.7).** Set `interactionUrl` on any entry to an
interaction URL your service serves. The suite checks its syntax and `iuv`
parameter, its length, and the responses to a GET with
`Accept: application/json` and with an unrecognized `Accept` value, so the URL
must be live during the run:

```js
{
  endpoint: 'https://app.example',
  tags: ['VCALM'],
  interactionUrl: 'https://app.example/interactions/z8n38Dp7a?iuv=1'
}
```

### Sharing your results

The published report tests the implementations listed in
[vc-test-suite-implementations](https://github.com/w3c/vc-test-suite-implementations).
To appear in it, add your entries there with the `VCALM` tag. While
`localConfig.cjs` lists implementations, the suite tests only those.

## Reading the report

`npm test` writes `reports/index.html` and `reports/index.json`, and a log in
`suite.log`. Each cell is one statement for one implementation. Hover over a
cell to see its details:

- **Passed:** every check for the statement passed.
- **Failed:** at least one check failed. The details list each failed check,
  labelled `N.N (n): what it checks`, with the reason.
- **Skipped:** the row was not run for this implementation. The details say
  why: a role or optional feature is not configured, the response did not let
  the suite observe the statement, or the statement binds another party (such
  as a client or a browser) and is not tested.

A row is "at risk" while fewer than two implementations pass it, so with one
implementation every row is listed under "At Risk".

## Environment variables

| Variable | Effect |
|----------|--------|
| `NODE_TLS_REJECT_UNAUTHORIZED=0` | Accept self-signed HTTPS certificates. |
| `VCALM_OPENAPI=0` | Skip the OpenAPI schema checks on responses (refusal statuses are still checked). |

## How the suite works

This section is for people changing the suite.

### Layout

| Path | What it holds |
|------|---------------|
| `tests/sections/` | One test file per spec section, named after it (`3-4-1-...spec.js`). |
| `tests/coverage/statement-rows.spec.js` | Checks that every REQUIRED statement has exactly one row. |
| `tests/normative-statements.js` | The spec's normative sentences (generated, do not edit). |
| `tests/normative-links.js` | A link to each sentence in the TR (generated by `scripts/build-links.mjs`). |
| `tests/statement-test.js` | `statementTest`, which defines one row. |
| `tests/TestEndpoints.js` | The HTTP client for each role. |
| `tests/*.js` | Other helpers: request bodies, signing, OpenAPI, and per-section helpers. |
| `docs/openapi/oas.bundled.json` | The VCALM OpenAPI document. |
| `templates/` | The report layout. |

### Statements and rows

`tests/normative-statements.js` holds every sentence the
[VCALM TR](https://www.w3.org/TR/vcalm-1.0/) marks as normative (its RFC 2119
keyword is in an `<em class="rfc2119">` element). A keyword in an OpenAPI
description rendered into the TR is not marked, so it is not a statement here;
those rules are covered by the OpenAPI checks. The file exports `NORMATIVE`
(key to sentence, for example `1-3-conformance-3`), `SECTION` (key to section
heading), `REQUIRED` (keys whose sentence has MUST or REQUIRED: the rows of
the report) and `MARKED`. Regenerate it from the TR, then rerun
`scripts/build-links.mjs`.

Each REQUIRED statement is one row, written with `statementTest` in its
section file. A row has labelled checks:

- `accepts`: the implementation does what the statement requires.
- `refuses`: it refuses input that breaks the statement, with a client error
  status the OpenAPI lists for the operation.
- `responds`: for a statement about the implementation's own response, the
  response has the required form.

A row needs an `accepts` and a `refuses` check, or a `responds` check. A
statement the suite cannot test (for example, one that binds clients) is
still a row, skipped with its reason.

To add or change a row:

- Write `rowId` as a string literal, for example
  `rowId: '3-6-5-get-current-exchange-vpr-1'`.
  `tests/coverage/statement-rows.spec.js` reads the section files as text
  and fails if a REQUIRED statement has no row or more than one, or if a
  SHOULD or MAY statement has one. It runs even with no implementations
  configured.
- A new section file's `describe` title needs a matching
  `{{#matrixByTitle "<title>"}}` slot in `templates/metrics.hbs`, or its rows
  do not appear in their section of the report.
- Test credentials and presentations are signed by the suite
  (`tests/signing.js`, `eddsa-rdfc-2022`) with keys derived from fixed labels.

### The OpenAPI document

`docs/openapi/oas.bundled.json` is the published
[`oas.yaml`](https://w3c.github.io/vcalm/oas.yaml) (version `0.9-unstable`)
bundled into one JSON file with no external `$ref`, and with `servers` set to
`/` because the published file names one example host. The suite uses it in
two ways:

- **Refusal statuses.** A `refuses` check only accepts a 4xx status the
  document lists for the operation (`shouldBeListedRefusal` in
  `tests/openapi.js`). `VCALM_OPENAPI=0` does not turn this off.
- **Schema checks.** The successful responses of `POST /credentials/issue`
  (201), `POST /credentials/verify` (200) and `POST /presentations/verify`
  (200) are validated against their schemas. The HTTP client unwraps
  `verifiableCredential` from the issue response; the checker puts it back
  before validating. If the validator fails to load, these checks are skipped
  with a console warning.

To refresh the document after a spec change:

```sh
npx @redocly/cli@1.34.3 bundle https://w3c.github.io/vcalm/oas.yaml \
  --ext json -o docs/openapi/oas.bundled.json
```

Then set `servers` to `[{"url": "/"}]` in the output and run `npm test`. A
changed list of statuses changes which refusals pass.

## License

See [LICENSE.md](LICENSE.md).
