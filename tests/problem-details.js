/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Finds the ProblemDetails objects (3.8) in a response body, and the inputs
// that make a verifier report them.
//
// The OpenAPI declares ProblemDetails in two places: the `problemDetails`
// lists of verification results (at the top and inside `results`), and an
// exchange's `lastError`. The 3.8.1 prose names the lists `errors` and
// `warnings`. Error bodies of other responses are not declared ProblemDetails,
// so they are not read here.

import {testCredential, testPresentation} from './signing.js';
import chai from 'chai';
import {randomUUID} from 'node:crypto';

const {expect} = chai;

// Keys whose values echo the request, not the implementation's findings.
const INPUT_KEYS = new Set([
  'credential', 'document', 'input', 'verifiableCredential',
  'verifiablePresentation'
]);
const LIST_KEYS = new Set(['errors', 'problemDetails', 'warnings']);

export const VERIFY_DOMAIN = 'https://vcalm-test-suite.example';

/**
 * Every ProblemDetails object in `body`, each with its path.
 *
 * @param {*} body - A parsed response body.
 * @returns {Array<{path: string, item: *}>} The ProblemDetails found.
 */
export function problemDetailsIn(body) {
  const found = [];
  const walk = (value, path) => {
    if(Array.isArray(value)) {
      value.forEach((child, index) => walk(child, `${path}[${index}]`));
      return;
    }
    if(!value || typeof value !== 'object') {
      return;
    }
    for(const [key, child] of Object.entries(value)) {
      if(INPUT_KEYS.has(key)) {
        continue;
      }
      if(LIST_KEYS.has(key) && Array.isArray(child)) {
        child.forEach((item, index) =>
          found.push({path: `${path}.${key}[${index}]`, item}));
      } else if(key === 'lastError' && child !== undefined) {
        found.push({path: `${path}.lastError`, item: child});
      } else {
        walk(child, `${path}.${key}`);
      }
    }
  };
  walk(body, '$');
  return found;
}

/**
 * The errors a VerificationResponse includes (3.8.1). A response that uses
 * the prose's `errors` and `warnings` lists has its `errors` entries. One
 * that uses only the OpenAPI's `problemDetails` lists has those entries,
 * since the OpenAPI sets `verified` to false when errors were detected and
 * has no separate list for warnings.
 *
 * @param {object} body - A VerificationResponse.
 * @returns {Array<{path: string, item: *}>} The errors.
 */
export function includedErrors(body) {
  const found = problemDetailsIn(body)
    .filter(({path}) => !path.endsWith('.lastError'));
  const prose = found.some(
    ({path}) => /\.(errors|warnings)\[\d+\]$/.test(path));
  const list = prose ? /\.errors\[\d+\]$/ : /\.problemDetails\[\d+\]$/;
  return found.filter(({path}) => list.test(path));
}

/**
 * Asserts that each ProblemDetails has a `type` whose value is a URL.
 *
 * @param {Array<{path: string, item: *}>} found - From problemDetailsIn.
 */
export function shouldHaveUrlTypes(found) {
  for(const {path, item} of found) {
    expect(item, `${path} is a map`).to.be.an('object');
    expect(item, `${path} has type`).to.have.property('type');
    const {type} = item;
    expect(type, `${path}.type`).to.be.a('string');
    expect(isUrl(type), `${path}.type is a URL, got "${type}"`)
      .to.equal(true);
  }
}

function isUrl(value) {
  try {
    new URL(value);
    return true;
  } catch{
    return false;
  }
}

// A credential from the test issuer, changed after signing so its proof
// fails.
export async function tamperedCredential() {
  const credential = await testCredential();
  credential.credentialSubject.id = `urn:uuid:${randomUUID()}`;
  return credential;
}

/**
 * A presentation from the test holder, with its challenge and domain.
 *
 * @param {object} [options] - Options.
 * @param {boolean} [options.tampered] - Changes the presentation after
 *   signing so its proof fails.
 * @returns {Promise<object>} `{presentation, challenge, domain}`.
 */
export async function presentationToVerify({tampered = false} = {}) {
  const challenge = randomUUID();
  const presentation = await testPresentation({
    credentials: [await testCredential()], challenge, domain: VERIFY_DOMAIN
  });
  if(tampered) {
    presentation.id = `urn:uuid:${randomUUID()}`;
  }
  return {presentation, challenge, domain: VERIFY_DOMAIN};
}
