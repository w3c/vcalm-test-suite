# VCALM Interoperability Test Suite

Interoperability tests for implementations of
[VCALM](https://www.w3.org/TR/vcalm-1.0/) (Verifiable Credential API for
Lifecycle Management).

This repo is an **initial scaffold** (v0.1.0): npm dependencies, project README,
and a curated normative statement inventory. Behavioral Mocha tests are added in
a follow-up change.

## What's in this repo

| Path | Purpose |
|------|---------|
| [`tests/normative-statements.js`](tests/normative-statements.js) | RFC 2119 strings for future Mocha `it()` titles |
| `abstract.hbs` / `respecConfig.json` | W3C interop report metadata |
| `package.json` / `package-lock.json` | Mocha, Chai, W3C interop reporter, `vc-test-suite-implementations` |

## Install

```sh
npm install --legacy-peer-deps
```

## Lint

```sh
npm run lint
```

## Run tests

`npm test` runs Mocha with the glob `tests/*/**/*.js` and the W3C interop
reporter (`abstract.hbs`, `respecConfig.json`). Reports are written under
`reports/`. A skipped placeholder test keeps the harness runnable until
behavioral tests land in follow-up PRs.

## Planned test layout

Tests will mirror the VCALM table of contents. Mocha will load
`tests/*/**/*.js` only; shared helpers at `tests/*.js` (including
`normative-statements.js`) are not test files.

```
tests/
  normative-statements.js   # RFC 2119 strings (present now)
  helpers.js                # matrix setup, VCALM tag, fixtures
  negative-fixtures.js      # malformed / foreign VC·VP cases
  1.3-Conformance/          # §1.3 service role probes
  2.4-Configurations/       # §2.4 JSON, options, auth, payload limits
  3.2-Issuing/              # §3.2 issue · get · delete · multi-proof
  3.3-Verifying/            # §3.3 verify VC/VP · challenge · negatives
  3.4-Requesting/           # §3.4 VPR shape and query rules
  3.5-Presenting/           # §3.5 derive · create · list · get · delete
  3.6-Workflows/            # §3.6 workflow and exchange lifecycle
  3.7-Interactions/         # §3.7 interaction URL · QR · protocols
  3.8-ErrorHandling/        # §3.8 ProblemDetails · verified true/false
  appendix-B-Security/      # selected appendix B guidance
```

## Implementation config (when tests land)

Implementations will be registered in **`localConfig.cjs`** (gitignored). Each
role gets an `endpoint` and **`tags: ['VCALM']`**. Register only what you
implement — tests skip missing pairings (for example, presentation verify needs
both `holders` and `verifiers`).

| Role key | Used for | Typical `endpoint` |
|----------|----------|-------------------|
| `issuers` | Issue credential (§3.2.1) | `…/credentials/issue` or gateway root |
| `verifiers` | Verify VC and VP (§3.3.1–2) | `…/credentials/verify` or gateway root |
| `holders` | Create presentation (§3.5.2) | `…/presentations` or gateway root |
| `workflows` | §3.6 workflows (optional) | `…/workflows` or gateway root |
| `interactions` | §3.7 interaction URL fetch (optional) | gateway root or `…/interactions` |

One `verifiers` entry covers both verify operations. Issuers may set
`options.cryptosuite` to a string or string array (array enables §3.2.4
multi-proof when length ≥ 2).

```javascript
module.exports = {
  implementations: [{
    name: 'My VCALM service',
    implementation: 'Example Corp',
    issuers: [{
      id: 'did:web:example.com',
      endpoint: process.env.BASE_URL || 'https://localhost:8000',
      tags: ['VCALM'],
      options: { cryptosuite: 'eddsa-jcs-2022' }
    }],
    verifiers: [{
      endpoint: process.env.BASE_URL || 'https://localhost:8000',
      tags: ['VCALM']
    }],
    holders: [{
      endpoint: process.env.BASE_URL || 'https://localhost:8000',
      tags: ['VCALM']
    }]
  }]
};
```

Override the base URL: `BASE_URL=https://localhost:8000 npm test`

## The `VCALM` tag

Endpoints that participate in this suite include **`VCALM`** in `tags`. The
harness uses
[`vc-test-suite-implementations`](https://github.com/w3c/vc-test-suite-implementations)
`filterByTag({ tags: ['VCALM'] })` to build the Mocha matrix.

## Mocha and OpenAPI (planned)

**Mocha** will run behavioral interop: HTTP status, VCALM response envelopes
(`verifiableCredential` / `verifiablePresentation`), and spec-specific fields.
`it()` titles will use strings from `tests/normative-statements.js`.

**OpenAPI (optional, later)** — selected tests may validate responses against
the VCALM OAS via Chai OpenAPI (`VCALM_OPENAPI=0` to disable).

## License

[LICENSE.md](LICENSE.md)
