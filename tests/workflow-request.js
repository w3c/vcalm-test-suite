/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Signed requests for workflow instances. Veres authorizes each workflow
// instance against its own root (`urn:zcap:root:<instance URL>`), so the test
// client signs instance calls with that root. The client must be the
// workflow's controller (set with `options.controller` on the workflow entry).

import * as didKey from '@digitalbazaar/did-method-key';
import {decodeSecretKeySeed} from 'bnid';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import {ZcapClient} from '@digitalbazaar/ezcap';

const zcapClients = new Map();

async function getZcapClient({keySeed}) {
  if(zcapClients.has(keySeed)) {
    return zcapClients.get(keySeed);
  }
  const secretKeySeed = process.env[keySeed];
  if(!secretKeySeed) {
    throw new Error(`ENV variable ${keySeed} is required.`);
  }
  const seed = await decodeSecretKeySeed({secretKeySeed});
  const key = await didKey.driver().generate({seed});
  const signer = key.keyPairs.get(key.didDocument.capabilityInvocation[0])
    .signer();
  const client = new ZcapClient({
    SuiteClass: Ed25519Signature2020,
    invocationSigner: signer,
    delegationSigner: signer
  });
  zcapClients.set(keySeed, client);
  return client;
}

/**
 * Send a signed GET or POST with a capability.
 *
 * @param {object} options - Options.
 * @param {string} options.method - `GET` or `POST`.
 * @param {string} options.url - The request URL.
 * @param {object} [options.json] - JSON body for POST.
 * @param {object} [options.headers] - Extra headers.
 * @param {string} options.capability - The capability (a root URN or a
 *   delegated zcap).
 * @param {string} options.keySeed - Name of the environment variable holding
 *   the client's secret key seed.
 * @returns {Promise<object>} `{data, result}` on success, or `{error}`.
 */
export async function workflowRequest({
  method, url, json, headers, capability, keySeed
}) {
  try {
    const zcapClient = await getZcapClient({keySeed});
    const result = method === 'GET' ?
      await zcapClient.read({url, capability, headers}) :
      await zcapClient.write({url, json, capability, headers});
    // ezcap parses the response body onto `data`
    return {data: result.data, result};
  } catch(error) {
    return {error};
  }
}
