/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

export const VCALM_TAG = 'VCALM';

/**
 * §1.3 holder conformance uses fixed workflow/exchange ids. Implementations
 * under test SHOULD accept these resources (stubs may pre-seed them).
 */
export const CONFORMANCE_WORKFLOW_ID = 'urn:uuid:vcalm-probe-workflow';
export const CONFORMANCE_EXCHANGE_ID = 'urn:uuid:vcalm-probe-exchange';

export function setupMatrix(match, columnLabel) {
  this.matrix = true;
  this.report = true;
  this.implemented = [...match.keys()];
  this.rowLabel = 'Test Name';
  this.columnLabel = columnLabel || 'Implementation';
}

export function addPerTestMetadata() {
  this.currentTest.cell = {
    columnId: this.currentTest.parent.title,
    rowId: this.currentTest.title
  };
}

/**
 * Fixture-only tests (§3.4 VPR shapes, etc.) run when `VCALM_FIXTURE=1`.
 *
 * @param {string} title - Mocha suite title.
 * @param {Function} fn - Suite body.
 */
export function describeFixtureSuite(title, fn) {
  const run = process.env.VCALM_FIXTURE === '1';
  (run ? describe : describe.skip)(title, fn);
}

export function hasTaggedEndpoint(implementation, property, tag = VCALM_TAG) {
  return implementation[property]?.some(endpoint => endpoint.tags.has(tag));
}

export function implementationsWithIssuerAndVerifier(match, tag = VCALM_TAG) {
  return [...match].filter(([, implementation]) =>
    hasTaggedEndpoint(implementation, 'issuers', tag) &&
    hasTaggedEndpoint(implementation, 'verifiers', tag));
}

export function implementationsWithPresentationFlow(match, tag = VCALM_TAG) {
  return [...match].filter(([, implementation]) =>
    hasTaggedEndpoint(implementation, 'issuers', tag) &&
    hasTaggedEndpoint(implementation, 'holders', tag) &&
    hasTaggedEndpoint(implementation, 'verifiers', tag));
}

export function implementationsWithIssuerAndHolder(match, tag = VCALM_TAG) {
  return [...match].filter(([, implementation]) =>
    hasTaggedEndpoint(implementation, 'issuers', tag) &&
    hasTaggedEndpoint(implementation, 'holders', tag));
}

/**
 * Resolve POST /credentials/issue from an issuer endpoint setting. The
 * setting may be the issue URL itself or the service root.
 *
 * @param {object} options - Options.
 * @param {string} options.issuerEndpoint - Issue URL or service root.
 * @returns {string} Issue credential URL.
 */
export function resolveIssueCredentialUrl({issuerEndpoint} = {}) {
  const trimmed = issuerEndpoint.replace(/\/+$/, '');
  if(trimmed.endsWith('/credentials/issue')) {
    return trimmed;
  }
  if(trimmed.endsWith('/credentials')) {
    return `${trimmed}/issue`;
  }
  return `${trimmed}/credentials/issue`;
}

/**
 * Build GET/DELETE URL for `/credentials/{id}` from an issuer endpoint setting.
 *
 * @param {string} issuerEndpoint - Issuer POST URL or instance root.
 * @param {string} credentialId - Credential identifier.
 * @returns {string} Resource URL for the credential.
 */
export function resolveCredentialResourceUrl(issuerEndpoint, credentialId) {
  const trimmed = issuerEndpoint.replace(/\/+$/, '');
  let credentialsBase;
  if(trimmed.endsWith('/credentials/issue')) {
    credentialsBase = trimmed.slice(0, -'/issue'.length);
  } else if(trimmed.endsWith('/credentials')) {
    credentialsBase = trimmed;
  } else {
    credentialsBase = `${trimmed}/credentials`;
  }
  return `${credentialsBase}/${encodeURIComponent(credentialId)}`;
}

/**
 * Build a URL for a verifier-scoped resource from a verify endpoint setting.
 *
 * @param {string} verifierEndpoint - Verifier POST URL or instance root.
 * @param {string} resourcePath - Path suffix (e.g. `/challenges`).
 * @returns {string} Absolute URL for the resource.
 */
export function resolveVerifierResourceUrl(verifierEndpoint, resourcePath) {
  const trimmed = verifierEndpoint.replace(/\/+$/, '');
  let base;
  if(trimmed.endsWith('/credentials/verify')) {
    base = trimmed.slice(0, -'/credentials/verify'.length);
  } else if(trimmed.endsWith('/presentations/verify')) {
    base = trimmed.slice(0, -'/presentations/verify'.length);
  } else {
    base = trimmed;
  }
  const suffix = resourcePath.startsWith('/') ?
    resourcePath :
    `/${resourcePath}`;
  return `${base}${suffix}`;
}

/**
 * Resolve POST /credentials/verify from a verifier endpoint setting.
 *
 * @param {string} verifierEndpoint - Verifier POST URL or instance root.
 * @returns {string} Verify credential URL.
 */
export function resolveVerifyCredentialUrl(verifierEndpoint) {
  const trimmed = verifierEndpoint.replace(/\/+$/, '');
  if(trimmed.endsWith('/credentials/verify')) {
    return trimmed;
  }
  if(trimmed.endsWith('/presentations/verify')) {
    return trimmed.replace(/\/presentations\/verify$/, '/credentials/verify');
  }
  return `${trimmed}/credentials/verify`;
}

/**
 * Resolve POST /credentials/status from a status endpoint setting.
 *
 * @param {string} statusEndpoint - Status POST URL or instance root.
 * @returns {string} Update Status URL.
 */
export function resolveUpdateStatusUrl(statusEndpoint) {
  const trimmed = statusEndpoint.replace(/\/+$/, '');
  if(trimmed.endsWith('/credentials/status')) {
    return trimmed;
  }
  return `${trimmed}/credentials/status`;
}

/**
 * Resolve POST /presentations/verify from a verifier endpoint setting.
 *
 * @param {string} verifierEndpoint - Verifier POST URL or instance root.
 * @returns {string} Verify presentation URL.
 */
export function resolveVerifyPresentationUrl(verifierEndpoint) {
  const trimmed = verifierEndpoint.replace(/\/+$/, '');
  if(trimmed.endsWith('/presentations/verify')) {
    return trimmed;
  }
  if(trimmed.endsWith('/credentials/verify')) {
    return trimmed.replace(/\/credentials\/verify$/, '/presentations/verify');
  }
  return `${trimmed}/presentations/verify`;
}

/**
 * Build a URL for holder-scoped resources from a holder endpoint setting.
 *
 * @param {string} holderEndpoint - Holder POST URL or instance root.
 * @param {string} resourcePath - Path suffix (e.g. `/presentations`).
 * @returns {string} Absolute URL for the resource.
 */
export function resolveHolderResourceUrl(holderEndpoint, resourcePath) {
  const trimmed = holderEndpoint.replace(/\/+$/, '');
  let base;
  if(trimmed.endsWith('/presentations')) {
    base = trimmed.slice(0, -'/presentations'.length);
  } else {
    base = trimmed;
  }
  const suffix = resourcePath.startsWith('/') ?
    resourcePath :
    `/${resourcePath}`;
  return `${base}${suffix}`;
}

/**
 * Build GET/DELETE URL for `/presentations/{id}` from a holder endpoint.
 *
 * @param {string} holderEndpoint - Holder POST URL or instance root.
 * @param {string} [presentationId] - Presentation id; omit for collection URL.
 * @returns {string} Resource URL for presentation(s).
 */
export function resolvePresentationResourceUrl(
  holderEndpoint,
  presentationId
) {
  const collection = resolveHolderResourceUrl(holderEndpoint, '/presentations');
  if(presentationId === undefined) {
    return collection;
  }
  return `${collection}/${encodeURIComponent(presentationId)}`;
}

/**
 * Build POST URL for `/credentials/derive` from a holder endpoint setting.
 *
 * @param {string} holderEndpoint - Holder POST URL or instance root.
 * @returns {string} Derive credential URL.
 */
export function resolveDeriveCredentialUrl(holderEndpoint) {
  return resolveHolderResourceUrl(holderEndpoint, '/credentials/derive');
}

/**
 * Build the workflows collection URL from a workflow endpoint setting.
 *
 * @param {string} workflowEndpoint - Workflow POST URL or instance root.
 * @returns {string} Workflows collection URL.
 */
export function resolveWorkflowsBaseUrl(workflowEndpoint) {
  const trimmed = workflowEndpoint.replace(/\/+$/, '');
  if(trimmed.endsWith('/workflows')) {
    return trimmed;
  }
  return `${trimmed}/workflows`;
}

/**
 * Build a workflow or exchange URL under `/workflows`.
 *
 * @param {string} workflowEndpoint - Workflow POST URL or instance root.
 * @param {string} workflowId - Workflow id.
 * @param {string} [exchangeId] - Exchange id for exchange-scoped paths.
 * @param {string} [suffix] - Optional path suffix (e.g. `protocols`).
 * @returns {string} Workflow resource URL.
 */
export function resolveWorkflowResourceUrl(
  workflowEndpoint,
  workflowId,
  exchangeId,
  suffix
) {
  let url = `${resolveWorkflowsBaseUrl(workflowEndpoint)}/${
    encodeURIComponent(workflowId)}`;
  if(exchangeId !== undefined) {
    url += `/exchanges/${encodeURIComponent(exchangeId)}`;
  }
  if(suffix) {
    const path = suffix.startsWith('/') ? suffix.slice(1) : suffix;
    url += `/${path}`;
  }
  return url;
}

/**
 * §1.3 holder service URLs under `/workflows/{id}/exchanges/{id}`.
 *
 * @param {string} workflowEndpoint - Workflow POST URL or instance root.
 * @param {'exchangeProtocols'|'participateExchange'} requirementId - Probe id.
 * @returns {string} Exchange-scoped URL.
 */
export function resolveHolderExchangeUrl(workflowEndpoint, requirementId) {
  switch(requirementId) {
    case 'exchangeProtocols':
      return resolveWorkflowResourceUrl(
        workflowEndpoint,
        CONFORMANCE_WORKFLOW_ID,
        CONFORMANCE_EXCHANGE_ID,
        'protocols'
      );
    case 'participateExchange':
      return resolveWorkflowResourceUrl(
        workflowEndpoint,
        CONFORMANCE_WORKFLOW_ID,
        CONFORMANCE_EXCHANGE_ID
      );
    default:
      throw new Error(
        `Unknown holder conformance requirement: ${requirementId}`
      );
  }
}

/**
 * Remove proof types that are not on the holder allow list (Appendix B.1).
 *
 * @param {object} credential - Credential or presentation.
 * @param {string[]} acceptedProofTypes - Allowed proof type strings.
 * @returns {object} Credential with unrecognized proofs removed.
 */
export function stripUnrecognizedProofs(credential, acceptedProofTypes) {
  const copy = structuredClone(credential);
  if(!copy.proof) {
    return copy;
  }
  const proofs = Array.isArray(copy.proof) ? copy.proof : [copy.proof];
  const kept = proofs.filter(proof => acceptedProofTypes.includes(proof.type));
  if(kept.length === 0) {
    delete copy.proof;
  } else if(kept.length === 1) {
    copy.proof = kept[0];
  } else {
    copy.proof = kept;
  }
  return copy;
}
