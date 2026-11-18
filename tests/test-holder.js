/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// A test holder that runs inside the suite. It generates a did:key with a
// fresh Ed25519 key, so no key material is stored in the repository, and signs
// a presentation with the eddsa-rdfc-2022 Data Integrity cryptosuite. Verifier
// tests use it to get a presentation without a holder implementation.

import * as credentialsContext from '@digitalbazaar/credentials-context';
import * as dataIntegrityContext from '@digitalbazaar/data-integrity-context';
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import * as eddsaRdfc2022 from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import jsonldSignatures from 'jsonld-signatures';

const {purposes: {AuthenticationProofPurpose}} = jsonldSignatures;

const CREDENTIALS_V2 = 'https://www.w3.org/ns/credentials/v2';
const DATA_INTEGRITY_CONTEXT = 'https://w3id.org/security/data-integrity/v2';

// Same local-only context loading as the test issuer.
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

let holderPromise;

/**
 * The test holder's key and DID. Created once per test run.
 *
 * @returns {Promise<{did: string, key: object}>} The holder identity.
 */
export function getTestHolder() {
  if(!holderPromise) {
    holderPromise = (async () => {
      const key = await Ed25519Multikey.generate();
      const did = `did:key:${key.publicKeyMultibase}`;
      key.id = `${did}#${key.publicKeyMultibase}`;
      key.controller = did;
      return {did, key};
    })();
  }
  return holderPromise;
}

/**
 * Sign a presentation as the test holder.
 *
 * @param {object} options - Options.
 * @param {Array<object>} options.credentials - Credentials to include.
 * @param {string} options.challenge - The challenge to bind the proof to.
 * @param {string} options.domain - The domain to bind the proof to.
 * @returns {Promise<object>} A VP 2.0 presentation with an eddsa-rdfc-2022
 *   DataIntegrityProof.
 */
export async function createTestPresentation({credentials, challenge, domain}) {
  const {did, key} = await getTestHolder();
  const document = {
    '@context': [CREDENTIALS_V2, DATA_INTEGRITY_CONTEXT],
    type: ['VerifiablePresentation'],
    holder: did,
    verifiableCredential: credentials
  };
  const suite = new DataIntegrityProof({
    signer: key.signer(),
    cryptosuite: eddsaRdfc2022.cryptosuite
  });
  const proof = await suite.createProof({
    document,
    purpose: new AuthenticationProofPurpose({challenge, domain}),
    documentLoader
  });
  return {...document, proof};
}
