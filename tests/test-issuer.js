/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// A test issuer that runs inside the suite. It generates a did:key with a
// fresh Ed25519 key, so no key material is stored in the repository, and
// signs credentials with the eddsa-rdfc-2022 Data Integrity cryptosuite.
// Verifier tests use it to get a credential without calling an issuer
// endpoint.

import * as credentialsContext from '@digitalbazaar/credentials-context';
import * as dataIntegrityContext from '@digitalbazaar/data-integrity-context';
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import * as eddsaRdfc2022 from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import jsonldSignatures from 'jsonld-signatures';
import {v4 as uuidv4} from 'uuid';

const {purposes: {AssertionProofPurpose}} = jsonldSignatures;

const CREDENTIALS_V2 = 'https://www.w3.org/ns/credentials/v2';
const DATA_INTEGRITY_CONTEXT = 'https://w3id.org/security/data-integrity/v2';

// Contexts are served from local packages only, so the suite never fetches
// remote contexts while signing.
function toEntries(contexts) {
  return contexts instanceof Map ?
    [...contexts] : Object.entries(contexts);
}
const LOCAL_CONTEXTS = new Map([
  ...toEntries(credentialsContext.contexts),
  ...toEntries(dataIntegrityContext.contexts)
]);

async function documentLoader(url) {
  const document = LOCAL_CONTEXTS.get(url);
  if(document === undefined) {
    throw new Error(`Context not available locally: ${url}`);
  }
  return {contextUrl: null, documentUrl: url, document};
}

let issuerPromise;

/**
 * The test issuer's key and DID. Created once per test run.
 *
 * @returns {Promise<{did: string, key: object}>} The issuer identity.
 */
export function getTestIssuer() {
  if(!issuerPromise) {
    issuerPromise = (async () => {
      const key = await Ed25519Multikey.generate();
      const did = `did:key:${key.publicKeyMultibase}`;
      key.id = `${did}#${key.publicKeyMultibase}`;
      key.controller = did;
      return {did, key};
    })();
  }
  return issuerPromise;
}

/**
 * Issue a signed credential from the test issuer.
 *
 * @param {object} [options] - Options.
 * @param {object} [options.credentialSubject] - Claims about the subject.
 * @returns {Promise<object>} A VC 2.0 credential with an eddsa-rdfc-2022
 *   DataIntegrityProof.
 */
export async function issueTestCredential({credentialSubject} = {}) {
  const {did, key} = await getTestIssuer();
  const document = {
    '@context': [CREDENTIALS_V2, DATA_INTEGRITY_CONTEXT],
    type: ['VerifiableCredential'],
    issuer: did,
    validFrom: new Date().toISOString(),
    credentialSubject: credentialSubject ?? {
      id: `urn:uuid:${uuidv4()}`
    }
  };
  const suite = new DataIntegrityProof({
    signer: key.signer(),
    cryptosuite: eddsaRdfc2022.cryptosuite
  });
  const proof = await suite.createProof({
    document,
    purpose: new AssertionProofPurpose(),
    documentLoader
  });
  return {...document, proof};
}
