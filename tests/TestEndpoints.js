/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
  applyWorkflowOptions,
  createDeriveRequestBody,
  createExchangeRequest,
  createIssueRequestWithExistingProof,
  createPresentationRequestBody,
  createRequestBody,
  createUnknownOptionIssueBody,
  createVerifyRequestBody,
  createVerifyVpRequestBody,
  createWorkflowRequest
} from './mock.data.js';
import {
  extractCreatedPresentation,
  extractIssuedCredential,
  extractLocationResourceId
} from './response.js';
import {getClientDid, workflowRequest} from './workflow-request.js';
import {
  resolveCredentialResourceUrl,
  resolveDeriveCredentialUrl,
  resolveInteractionStartUrl,
  resolvePresentationResourceUrl,
  resolveUpdateStatusUrl,
  resolveVerifierResourceUrl,
  resolveVerifyCredentialUrl,
  resolveVerifyPresentationUrl,
  resolveWorkflowResourceUrl,
  resolveWorkflowsBaseUrl
} from './helpers.js';

function settleHttp({data, result, error}) {
  const httpResult = result ?? error?.response;
  return {
    data,
    result: httpResult,
    error: httpResult ? undefined : error
  };
}

export class TestEndpoints {
  constructor({implementation, tag}) {
    this.implementation = implementation;
    this.tag = tag;
    this.issuer = implementation.issuers?.find(
      issuer => issuer.tags.has(tag)) || null;
    this.status = implementation.status?.find(
      endpoint => endpoint.tags.has(tag)) || null;
    this.verifier = implementation.verifiers?.find(
      verifier => verifier.tags.has(tag)) || null;
    this.holder = implementation.holders?.find(
      holder => holder.tags.has(tag)) || null;
    this.workflow = implementation.workflows?.find(
      workflow => workflow.tags.has(tag)) || null;
    this.interaction = implementation.interactions?.find(
      interaction => interaction.tags.has(tag)) || null;
  }

  async issue(credential) {
    const {issuedVc} = await this.issueCredential(credential);
    return issuedVc;
  }

  async issueCredential(credential, options) {
    const issueBody = createRequestBody({
      issuer: this.issuer,
      vc: credential,
      options
    });
    const {data, result, error} = await this.issuer.post({json: issueBody});
    return {
      issuedVc: extractIssuedCredential(data),
      data,
      result,
      error
    };
  }

  async issueCredentialWithBody(body) {
    const {data, result, error} = await this.issuer.post({json: body});
    const httpResult = result ?? error?.response;
    return {
      issuedVc: extractIssuedCredential(data),
      result: httpResult,
      error: httpResult ? undefined : error,
      data
    };
  }

  credentialResourceUrl(credentialId) {
    return resolveCredentialResourceUrl(
      this.issuer.settings.endpoint,
      credentialId
    );
  }

  async getCredential(credentialId) {
    const url = this.credentialResourceUrl(credentialId);
    const settled = settleHttp(await this.issuer.get({url}));
    return {
      credential: extractIssuedCredential(settled.data),
      ...settled
    };
  }

  async deleteCredential(credentialId) {
    const url = this.credentialResourceUrl(credentialId);
    const {headers: _headers = {}, oauth2} = this.issuer.settings;
    const {makeHttpsRequest} = await import(
      'vc-test-suite-implementations/lib/requests.js'
    );
    return settleHttp(await makeHttpsRequest({
      url,
      method: 'DELETE',
      headers: _headers,
      oauth2
    }));
  }

  async updateCredentialStatus(body) {
    const url = resolveUpdateStatusUrl(this.status.settings.endpoint);
    return settleHttp(await this.status.post({url, json: body}));
  }

  async verify(vc, options) {
    const {data} = await this.verifyCredential(vc, options);
    return data;
  }

  async verifyCredential(vc, options) {
    const verifyBody = createVerifyRequestBody({
      verifier: this.verifier, vc, options
    });
    const url = resolveVerifyCredentialUrl(this.verifier.settings.endpoint);
    const {data, result, error} = await this.verifier.post({
      url,
      json: verifyBody
    });
    const httpResult = result ?? error?.response;
    return {data, result: httpResult, error: httpResult ? undefined : error};
  }

  async createPresentation({issuedVc, presentation, options} = {}) {
    const body = createPresentationRequestBody({
      holder: this.holder,
      vcs: [issuedVc],
      presentation,
      options
    });
    const {data, result, error} = await this.holder.post({json: body});
    return {
      verifiablePresentation: extractCreatedPresentation(data),
      data,
      result,
      error
    };
  }

  presentationsCollectionUrl() {
    return resolvePresentationResourceUrl(this.holder.settings.endpoint);
  }

  presentationResourceUrl(presentationId) {
    return resolvePresentationResourceUrl(
      this.holder.settings.endpoint,
      presentationId
    );
  }

  async deriveCredential(vc, options) {
    const url = resolveDeriveCredentialUrl(this.holder.settings.endpoint);
    const body = createDeriveRequestBody({
      holder: this.holder,
      vc,
      options
    });
    const settled = settleHttp(await this.holder.post({url, json: body}));
    return {
      derivedVc: extractIssuedCredential(settled.data),
      ...settled
    };
  }

  async getPresentations() {
    const url = this.presentationsCollectionUrl();
    const settled = settleHttp(await this.holder.get({url}));
    return {presentations: settled.data, ...settled};
  }

  async getPresentation(presentationId) {
    const url = this.presentationResourceUrl(presentationId);
    const settled = settleHttp(await this.holder.get({url}));
    return {
      presentation: extractCreatedPresentation(settled.data),
      ...settled
    };
  }

  async deletePresentation(presentationId) {
    const url = this.presentationResourceUrl(presentationId);
    const {headers: _headers = {}, oauth2} = this.holder.settings;
    const {makeHttpsRequest} = await import(
      'vc-test-suite-implementations/lib/requests.js'
    );
    return settleHttp(await makeHttpsRequest({
      url,
      method: 'DELETE',
      headers: _headers,
      oauth2
    }));
  }

  async verifyPresentation(vp, options) {
    const verifyBody = createVerifyVpRequestBody({
      verifier: this.verifier, vp, options
    });
    const url = resolveVerifyPresentationUrl(this.verifier.settings.endpoint);
    const {data, result, error} = await this.verifier.post({
      url,
      json: verifyBody
    });
    const httpResult = result ?? error?.response;
    return {data, result: httpResult, error: httpResult ? undefined : error};
  }

  async verifyVp(vp, options = {}) {
    const {data} = await this.verifyPresentation(vp, options);
    return data;
  }

  async createChallenge() {
    const url = resolveVerifierResourceUrl(
      this.verifier.settings.endpoint,
      '/challenges'
    );
    const settled = settleHttp(await this.verifier.post({url, json: {}}));
    return settled;
  }

  workflowsBaseUrl() {
    return resolveWorkflowsBaseUrl(this.workflow.settings.endpoint);
  }

  workflowResourceUrl(workflowId, exchangeId, suffix) {
    return resolveWorkflowResourceUrl(
      this.workflow.settings.endpoint,
      workflowId,
      exchangeId,
      suffix
    );
  }

  async createWorkflow(body = createWorkflowRequest()) {
    // The test client controls the workflows it creates, so its DID is the
    // default controller. Implementation options (see applyWorkflowOptions)
    // are applied last and can override it.
    const keySeed = this.workflow?.settings?.zcap?.keySeed;
    const withController = keySeed && body.controller === undefined ?
      {controller: await getClientDid({keySeed}), ...body} : body;
    const options = this.workflow?.settings?.options;
    return this.createWorkflowWithBody(
      applyWorkflowOptions({body: withController, options}));
  }

  async createWorkflowWithBody(body) {
    const settled = settleHttp(await this.workflow.post({json: body}));
    return {
      workflowId: body?.id ?? extractLocationResourceId(settled.result),
      sent: body,
      ...settled
    };
  }

  // Requests to a workflow instance, signed with the instance's root. Without
  // a zcap on the workflow entry, the endpoint's unsigned calls are used.
  async workflowInstanceRequest({method, url, json, headers, workflowId}) {
    const zcap = this.workflow.settings.zcap;
    if(!zcap) {
      return method === 'GET' ?
        this.workflow.get({url, headers}) :
        this.workflow.post({url, json, headers});
    }
    const instanceUrl = this.workflowResourceUrl(workflowId);
    return workflowRequest({
      method,
      url,
      json,
      headers,
      capability: `urn:zcap:root:${encodeURIComponent(instanceUrl)}`,
      keySeed: zcap.keySeed
    });
  }

  async getWorkflowConfiguration(workflowId) {
    const url = this.workflowResourceUrl(workflowId);
    const settled = settleHttp(await this.workflowInstanceRequest({
      method: 'GET', url, workflowId
    }));
    return {configuration: settled.data, ...settled};
  }

  async createExchange(workflowId, body = createExchangeRequest()) {
    const url = this.workflowResourceUrl(workflowId, undefined);
    const exchangesUrl = `${url}/exchanges`;
    const settled = settleHttp(await this.workflowInstanceRequest({
      method: 'POST', url: exchangesUrl, json: body, workflowId
    }));
    return {
      exchangeId: extractLocationResourceId(settled.result),
      ...settled
    };
  }

  async getExchangeProtocols(workflowId, exchangeId) {
    const url = this.workflowResourceUrl(workflowId, exchangeId, 'protocols');
    const settled = settleHttp(await this.workflowInstanceRequest({
      method: 'GET', url, workflowId
    }));
    return {protocols: settled.data, ...settled};
  }

  async getCurrentExchangeVpr(workflowId, exchangeId) {
    const url = this.workflowResourceUrl(workflowId, exchangeId, 'request');
    const settled = settleHttp(await this.workflowInstanceRequest({
      method: 'GET',
      url,
      headers: {Accept: 'application/json'},
      workflowId
    }));
    return {vpr: settled.data, ...settled};
  }

  async participateInExchange(workflowId, exchangeId, body = {}) {
    const url = this.workflowResourceUrl(workflowId, exchangeId);
    const settled = settleHttp(await this.workflowInstanceRequest({
      method: 'POST', url, json: body, workflowId
    }));
    return {message: settled.data, ...settled};
  }

  async getExchangeState(workflowId, exchangeId) {
    const url = this.workflowResourceUrl(workflowId, exchangeId);
    const settled = settleHttp(await this.workflowInstanceRequest({
      method: 'GET', url, workflowId
    }));
    return {state: settled.data, ...settled};
  }

  async startInteraction({interactionId, accept = 'application/json'} = {}) {
    const settings = this.interaction.settings;
    const id = interactionId ?? settings.interactionId;
    const url = settings.interactionStart ??
      resolveInteractionStartUrl(settings.endpoint, id);
    const settled = settleHttp(await this.interaction.get({
      url,
      headers: {Accept: accept}
    }));
    return {protocols: settled.data, ...settled};
  }

  async issueWithUnknownOption() {
    const body = createUnknownOptionIssueBody(this.issuer);
    return this.issueCredentialWithBody(body);
  }

  async issueCredentialWithExistingProof() {
    const body = createIssueRequestWithExistingProof(this.issuer);
    return this.issueCredentialWithBody(body);
  }
}
