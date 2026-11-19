/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// A test issuer and a test holder that run inside the suite, so verifier
// tests need no issuer or holder endpoint. Keys come from seeds built from
// public labels, so the same DIDs come back on every run and no key material
// is stored. Signing is eddsa-rdfc-2022. Contexts and did:key documents are
// loaded locally; nothing is fetched over the network.

import * as credentialsContext from '@digitalbazaar/credentials-context';
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import {createHash, randomUUID} from 'node:crypto';
import {cryptosuite} from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import jsonldSignatures from 'jsonld-signatures';

const {
  purposes: {AssertionProofPurpose, AuthenticationProofPurpose}
} = jsonldSignatures;

export const CREDENTIALS_V2 = 'https://www.w3.org/ns/credentials/v2';

const toEntries = c => c instanceof Map ? [...c] : Object.entries(c);
const LOCAL = new Map(toEntries(credentialsContext.contexts));

/**
 * The Ed25519 did:key for a public label. A test key only.
 *
 * @param {object} options - Options.
 * @param {string} options.label - Public label the seed is built from.
 * @returns {Promise<{did: string, key: object}>} The DID and its key.
 */
export async function keyFromLabel({label} = {}) {
  const seed = createHash('sha256').update(label).digest();
  const key = await Ed25519Multikey.generate({seed});
  const did = `did:key:${key.publicKeyMultibase}`;
  key.id = `${did}#${key.publicKeyMultibase}`;
  key.controller = did;
  return {did, key};
}

const issuerKey = () => keyFromLabel({label: 'vcalm-test-suite test issuer'});
const holderKey = () => keyFromLabel({label: 'vcalm-test-suite test holder'});

/**
 * The DID document for a did:key, built from the DID itself.
 *
 * @param {object} options - Options.
 * @param {string} options.did - The did:key.
 * @returns {object} The DID document.
 */
export function didDocumentFor({did} = {}) {
  const publicKeyMultibase = did.slice('did:key:'.length);
  const id = `${did}#${publicKeyMultibase}`;
  return {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: did,
    verificationMethod: [{
      '@context': ['https://w3id.org/security/multikey/v1'],
      id,
      type: 'Multikey',
      controller: did,
      publicKeyMultibase
    }],
    assertionMethod: [id],
    authentication: [id]
  };
}

/**
 * Loads contexts from local packages, and did:key documents from their
 * DIDs. Never fetches over the network.
 *
 * @param {string} url - The URL to load.
 * @returns {Promise<object>} The remote document.
 */
export async function documentLoader(url) {
  let document = LOCAL.get(url);
  if(document === undefined && url.startsWith('did:key:')) {
    const [did, fragment] = url.split('#');
    const didDocument = didDocumentFor({did});
    document = fragment === undefined ? didDocument :
      didDocument.verificationMethod.find(method => method.id === url);
  }
  if(document === undefined) {
    throw new Error(`Document not available locally: ${url}`);
  }
  return {contextUrl: null, documentUrl: url, document};
}

async function sign({document, key, purpose}) {
  const suite = new DataIntegrityProof({signer: key.signer(), cryptosuite});
  const proof = await suite.createProof({document, purpose, documentLoader});
  return {...document, proof};
}

/**
 * A credential signed by the test issuer.
 *
 * @param {object} [options] - Options.
 * @param {Function} [options.change] - Applied to the credential before it
 *   is signed.
 * @returns {Promise<object>} A VC 2.0 credential with an eddsa-rdfc-2022
 *   proof.
 */
export async function testCredential({change = () => {}} = {}) {
  const {did, key} = await issuerKey();
  const document = {
    '@context': [CREDENTIALS_V2],
    type: ['VerifiableCredential'],
    issuer: did,
    validFrom: '2025-01-01T00:00:00Z',
    credentialSubject: {id: `urn:uuid:${randomUUID()}`}
  };
  change(document);
  return sign({document, key, purpose: new AssertionProofPurpose()});
}

/**
 * A presentation signed by the test holder for authentication.
 *
 * @param {object} options - Options.
 * @param {Array<object>} options.credentials - The credentials it holds.
 * @param {string} options.challenge - The challenge.
 * @param {string} options.domain - The domain.
 * @returns {Promise<object>} A VP 2.0 presentation with an eddsa-rdfc-2022
 *   proof.
 */
export async function testPresentation({credentials, challenge, domain} = {}) {
  const {did, key} = await holderKey();
  const document = {
    '@context': [CREDENTIALS_V2],
    type: ['VerifiablePresentation'],
    holder: did,
    verifiableCredential: credentials
  };
  return sign({
    document, key,
    purpose: new AuthenticationProofPurpose({challenge, domain})
  });
}
