/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

import chai from 'chai';
import chaiOpenApiModule from 'chai-openapi-response-validator';

const chaiResponseValidator =
  chaiOpenApiModule.default ?? chaiOpenApiModule;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUITE_ROOT = path.join(__dirname, '..');

/** Published VCALM OpenAPI document. */
export const OPENAPI_SPEC_URL = 'https://w3c.github.io/vcalm/oas.yaml';

export const OPENAPI_SPEC_PATH = path.join(
  SUITE_ROOT,
  'docs/openapi/oas.bundled.json'
);

/**
 * VCALM operation paths from pinned oas.yaml (path only, no server prefix).
 */
export const OPENAPI_OPERATIONS = {
  issueCredential: {method: 'POST', path: '/credentials/issue'},
  verifyCredential: {method: 'POST', path: '/credentials/verify'},
  verifyPresentation: {method: 'POST', path: '/presentations/verify'},
  createPresentation: {method: 'POST', path: '/presentations'},
  deriveCredential: {method: 'POST', path: '/credentials/derive'},
  challenge: {method: 'POST', path: '/challenges'},
  getCredential: {pathTemplate: '/credentials/{id}', method: 'GET'},
  deleteCredential: {pathTemplate: '/credentials/{id}', method: 'DELETE'},
  updateStatus: {method: 'POST', path: '/credentials/status'},
  createWorkflow: {method: 'POST', path: '/workflows'},
  createExchange: {
    method: 'POST', pathTemplate: '/workflows/{localWorkflowId}/exchanges'
  },
  participateInExchange: {
    method: 'POST',
    pathTemplate: '/workflows/{localWorkflowId}/exchanges/{localExchangeId}'
  }
};

const OPENAPI_DOCUMENT = JSON.parse(fs.readFileSync(OPENAPI_SPEC_PATH, 'utf8'));

/**
 * The response statuses the OpenAPI lists for an operation.
 *
 * @param {object} options - Options.
 * @param {string} options.operation - Key from OPENAPI_OPERATIONS.
 * @returns {Array<number>} The listed statuses.
 */
export function listedStatuses({operation} = {}) {
  const {method, path: opPath, pathTemplate} = OPENAPI_OPERATIONS[operation];
  const responses = OPENAPI_DOCUMENT.paths[opPath ?? pathTemplate]
    ?.[method.toLowerCase()]?.responses ?? {};
  return Object.keys(responses).map(Number);
}

/**
 * Assert a refusal: a client error status that the OpenAPI lists for the
 * operation.
 *
 * @param {object} options - Options.
 * @param {object} options.result - The HTTP result.
 * @param {string} options.operation - Key from OPENAPI_OPERATIONS.
 */
export function shouldBeListedRefusal({result, operation} = {}) {
  const refusals = listedStatuses({operation})
    .filter(status => status >= 400 && status < 500);
  chai.expect(result, 'Expected an HTTP result.').to.exist;
  chai.expect(refusals).to.include(result.status,
    `Expected a client error the OpenAPI lists for ${operation} ` +
    `(${refusals.join(', ')}), got ${result.status}.`);
}

const disabled = process.env.VCALM_OPENAPI === '0';
let openApiReady = false;

if(!disabled) {
  try {
    chai.use(chaiResponseValidator(OPENAPI_SPEC_PATH));
    openApiReady = true;
  } catch(error) {
    console.warn(
      'VCALM OpenAPI response validation disabled:',
      error.message
    );
  }
}

export function isOpenApiValidationEnabled() {
  return !disabled && openApiReady;
}

const expect = chai.expect;

/**
 * The interop HTTP client unwraps `verifiableCredential` before tests see
 * the body. The Issue Credential response schema is that envelope.
 *
 * @param {string} operation - Key from OPENAPI_OPERATIONS.
 * @param {object} data - Parsed response body.
 * @returns {object} Body shape described by the OpenAPI response schema.
 */
function responseBodyForSpec(operation, data) {
  if(operation !== 'issueCredential' || !data || typeof data !== 'object') {
    return data;
  }
  if(Object.hasOwn(data, 'verifiableCredential')) {
    return data;
  }
  if(data['@context'] && data.type) {
    return {verifiableCredential: data};
  }
  return data;
}

function resolveOperationPath(operation, pathParams = {}) {
  const spec = OPENAPI_OPERATIONS[operation];
  if(!spec) {
    throw new Error(`Unknown OpenAPI operation: ${operation}`);
  }
  if(spec.path) {
    return spec.path;
  }
  if(spec.pathTemplate && pathParams.id !== undefined) {
    const encodedId = encodeURIComponent(String(pathParams.id));
    return spec.pathTemplate.replace('{id}', encodedId);
  }
  return spec.pathTemplate;
}

/**
 * Adapt HTTP results for chai-openapi-response-validator.
 *
 * @param {object} options - Adapter options.
 * @param {object} options.result - Sanitized fetch Response from the client.
 * @param {object} [options.data] - Parsed response body (OAS envelope).
 * @param {string} options.operation - Key from OPENAPI_OPERATIONS.
 * @param {object} [options.pathParams] - Path template parameters.
 * @returns {object} Axios-shaped response for satisfyApiSpec.
 */
export function buildOpenApiResponse({
  result,
  data,
  operation,
  pathParams
}) {
  const op = OPENAPI_OPERATIONS[operation];
  return {
    status: result.status,
    data: responseBodyForSpec(operation, data ?? result.data ?? null),
    headers: result.headers,
    request: {
      method: op.method,
      path: resolveOperationPath(operation, pathParams)
    }
  };
}

/**
 * Assert an HTTP response satisfies the pinned VCALM OpenAPI spec.
 *
 * @param {object} options - Same shape as buildOpenApiResponse.
 */
export function expectSatisfiesOpenApi(options) {
  if(!isOpenApiValidationEnabled()) {
    return;
  }
  const response = buildOpenApiResponse(options);
  expect(response).to.satisfyApiSpec;
}
