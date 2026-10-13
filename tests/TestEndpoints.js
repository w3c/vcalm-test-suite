/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {
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
import {
  resolveCallbackUrl,
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
    return this.createWorkflowWithBody(body);
  }

  async createWorkflowWithBody(body) {
    const settled = settleHttp(await this.workflow.post({json: body}));
    return {
      workflowId: body?.id ?? extractLocationResourceId(settled.result),
      ...settled
    };
  }

  async getWorkflowConfiguration(workflowId) {
    const url = this.workflowResourceUrl(workflowId);
    const settled = settleHttp(await this.workflow.get({url}));
    return {configuration: settled.data, ...settled};
  }

  async createExchange(workflowId, body = createExchangeRequest()) {
    const url = this.workflowResourceUrl(workflowId, undefined);
    const exchangesUrl = `${url}/exchanges`;
    const settled = settleHttp(await this.workflow.post({
      url: exchangesUrl,
      json: body
    }));
    return {
      exchangeId: extractLocationResourceId(settled.result),
      ...settled
    };
  }

  async getExchangeProtocols(workflowId, exchangeId) {
    const url = this.workflowResourceUrl(workflowId, exchangeId, 'protocols');
    const settled = settleHttp(await this.workflow.get({url}));
    return {protocols: settled.data, ...settled};
  }

  async getCurrentExchangeVpr(workflowId, exchangeId) {
    const url = this.workflowResourceUrl(workflowId, exchangeId, 'request');
    const settled = settleHttp(await this.workflow.get({
      url,
      headers: {Accept: 'application/json'}
    }));
    return {vpr: settled.data, ...settled};
  }

  async participateInExchange(workflowId, exchangeId, body = {}) {
    const url = this.workflowResourceUrl(workflowId, exchangeId);
    const settled = settleHttp(
      await this.workflow.post({url, json: body})
    );
    return {message: settled.data, ...settled};
  }

  async getExchangeState(workflowId, exchangeId) {
    const url = this.workflowResourceUrl(workflowId, exchangeId);
    const settled = settleHttp(await this.workflow.get({url}));
    return {state: settled.data, ...settled};
  }

  async exchangeStepCallback(callbackId, body = {event: {data: {}}}) {
    const url = resolveCallbackUrl(
      this.workflow.settings.endpoint,
      callbackId
    );
    const settled = settleHttp(
      await this.workflow.post({url, json: body})
    );
    return settled;
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
