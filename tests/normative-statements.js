/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

/**
 * Exact normative statement text for Mocha `it()` titles.
 * Source: VCALM TR / editor draft, plus suite-defined `negative.*` titles.
 *
 * @see branch feature/vcalm-docs — docs/normative-requirements.md
 */

export const UNKNOWN_OPTION_PROBE_KEY = 'vcalmInteropUnknownOptionProbe';

export const NORMATIVE = {
  configuration: {
    jsonContentType:
      'All entity bodies in requests and responses sent to or received from ' +
      'the API endpoints defined by this specification MUST be serialized ' +
      'as JSON and include the Content-Type header with a media type value ' +
      'of `application/json`.',
    unknownOptions:
      'Implementations MUST throw an error if an endpoint receives data, ' +
      'options, or option values that it does not understand or know how to ' +
      'process.',
    mustNotStaticCredentials:
      'Requests MUST NOT use authorization protocols with long-lived static ' +
      'credentials (e.g. HTTP Basic Authentication with username/password).',
    vcPayloadBaseline:
      'A default maximum size of 10MB per verifiable credential is ' +
      'RECOMMENDED as an interoperability baseline, with the possibility of ' +
      'configuring a larger size if required.'
  },
  conformance: {
    issuer:
      'A conforming issuer service implementation MUST provide the interface ' +
      'described in Section Issue Credential.',
    issuingMay:
      'Other interfaces described in Section Issuing MAY also be provided.',
    verifyCredential:
      'A conforming verifier service implementation MUST provide the ' +
      'interface described in Section Verify Credential.',
    verifyPresentation:
      'A conforming verifier service implementation MUST provide the ' +
      'interface described in Section Verify Presentation.',
    verifyingMay:
      'Other interfaces described in Section Verifying MAY also be provided.',
    getExchangeProtocols:
      'A conforming holder service implementation MUST provide the interface ' +
      'described in Section 3.6.4 Get Exchange Protocols.',
    participateInExchange:
      'A conforming holder service implementation MUST provide the interface ' +
      'described in Section 3.6.6 Participate in an Exchange.',
    holderMay:
      'Conformance to protocols, query languages, and data formats ' +
      'described in Section Initiating Interactions, Section Requesting a ' +
      'Presentation, Section Create Presentation, Section Presenting, and ' +
      'Section Workflows and Exchanges MAY also be provided.',
    status:
      'A conforming status service implementation MUST provide the interface ' +
      'described in Section C.3 Update Status.',
    workflow:
      'A conforming workflow service implementation MUST provide all ' +
      'interfaces Section 3.6 Workflows and Exchanges.'
  },
  issuing: {
    issue:
      'Issues a credential and returns it in the response body.',
    get:
      'Gets a credential or verifiable credential by ID. To get a credential ' +
      'that does not have credential.id set but has an associated ' +
      'credentialId value, pass credentialId instead.',
    delete:
      'Deletes a credential or verifiable credential by ID. To delete a ' +
      'credential that does not have credential.id set but has an associated ' +
      'credentialId value, pass credentialId instead.',
    multipleProofs:
      'If a use case requires an issuer instance to attach multiple proofs ' +
      'to the provided `credential`, the instance MUST attach all of these ' +
      'proofs in response to a single call to the `/credentials/issue` ' +
      'endpoint.',
    proofHandling:
      'An issuing instance SHOULD be configured to handle existing proofs in ' +
      'one of the following ways: Proof Sets, Proof Chains, or Error ' +
      'Handling.'
  },
  verifying: {
    verifyCredential:
      'Verifies a verifiableCredential and returns a verificationResult in ' +
      'the response body.',
    verifyPresentation:
      'Verifies a Presentation and all Verifiable Credentials it contains, ' +
      'returning detailed verification results.',
    challenge:
      'Passing an empty body to this endpoint creates and returns a ' +
      'challenge string in the response body.'
  },
  requestingPresentation: {
    queryRequired:
      'query A REQUIRED property that specifies the information requested ' +
      'by the verifier.',
    queryType:
      'The value MUST be one or more maps where each map MUST define a ' +
      '`type` property with an associated string value.',
    queryByExample:
      'To signal that selective-disclosure cryptosuites are acceptable, ' +
      'verifiers SHOULD include cryptosuites such as `bbs-2023` or ' +
      '`ecdsa-sd-2023` in the `acceptedCryptosuites` array.',
    didAuthentication:
      'A DID Authentication response MUST be a verifiable presentation of ' +
      'the following form:',
    didAuthenticationQueryType:
      'A REQUIRED string value that MUST be set to `DIDAuthentication`.',
    authorizationCapability:
      'This query type would be included in a request to ask for ' +
      'Authorization ' +
      'Capabilities or "zcaps" in the Verifiable Presentation.',
    logicalOperations:
      'Multiple queries with the same `group` value are processed as "AND" ' +
      'operations, while queries with different or missing `group` values ' +
      'are processed as "OR" operations.'
  },
  presenting: {
    derive: 'Derives a credential and returns it in the response body.',
    create: 'Creates a presentation and returns it in the response body.',
    getList: 'Gets list of presentations or verifiable presentations',
    getById: 'Gets a presentation or verifiable presentation by ID',
    deleteById: 'Deletes a presentation or verifiable presentation by ID'
  },
  workflows: {
    create:
      'Creates a new workflow and returns location of workflow metadata in a ' +
      'response header.',
    issueRequestVariables:
      'An issue request object MAY include a `variables` property to provide ' +
      'values to be used when evaluating the credential template.',
    issueRequestResult:
      'An issue request object MAY include an optional `result` property ' +
      'whose value MUST be either the name of a top-level variable in the ' +
      'exchange\'s `variables` object or a JSON pointer to any variable ' +
      'within the exchange\'s `variables` object.',
    getConfiguration:
      'Gets the configuration of an existing workflow and returns it in the ' +
      'response body.',
    createExchange:
      'Creates a new exchange and returns location of exchange metadata in a ' +
      'response header.',
    getProtocols:
      'Gets the supported protocols for interacting with a specific exchange.',
    getCurrentVpr:
      'This endpoint MUST return the current verifiable presentation ' +
      'request to be returned by an exchange when accessed with an Accept ' +
      'header value of `application/json`.',
    getCurrentVprNoSideEffects:
      'Processing this request SHOULD NOT advance the exchange to a new ' +
      'step nor perform any state-changing side effects, such as ' +
      'credential issuance.',
    getCurrentVprEmpty:
      'If there is no verifiable presentation request available for the ' +
      'exchange in the current step, the value of the ' +
      '`verifiablePresentationRequest` property returned by this endpoint ' +
      'MUST be an empty JSON object.',
    participate:
      'Participate in an exchange. Posting an empty body will start the ' +
      'exchange or return what the exchange is expecting to complete the ' +
      'next step.',
    getState:
      'Gets the state of an existing exchange and returns it in the response ' +
      'body.',
    referenceIdEcho:
      'If the client receives a `referenceId`, it SHOULD include the same ' +
      '`referenceId` in its next message to the server.',
    referenceIdServerMay:
      'A server MAY include a `referenceId` property in an exchange message.',
    referenceIdUrnUuid:
      'The value of `referenceId` SHOULD be a `urn:uuid:` value.',
    callbacks:
      'A callback that can be any capability URL (i.e., a URL that is ' +
      'infeasible to guess) that can be notified when an exchange step is ' +
      'performed.',
    examples:
      'The APIs in this specification enables unmediated (automated, ' +
      'machine-to-machine) or mediated (person in the loop) exchanges to be ' +
      'executed.',
  },
  interactions: {
    interactionUrl:
      'The format of the interaction URL MUST conform to the syntax for the ' +
      'URL and contain an `iuv` query parameter encoding the interaction URL ' +
      'version number, which MUST be `1` when using this version of this API.',
    interactionHttps:
      'The interaction URL SHOULD be an HTTPS URL that contains an ' +
      'interaction-specific identifier.',
    interactionOpaque:
      'The URL SHOULD be opaque and require no URL syntax processing before ' +
      'it is fetched by the receiving system.',
    interactionNoExtraQuery:
      'Implementers SHOULD NOT put information that can be expressed in ' +
      'the response to a GET request for an interaction URL into the query ' +
      'parameters of the interaction URL.',
    qrCode:
      'An interaction QR Code MUST be an interaction URL expressed as a QR ' +
      'code according to ISO 18004.',
    qrCodeMaxLength:
      'The length of the interaction URL MUST NOT exceed 4,296 alphanumeric ' +
      'characters.',
    scheme:
      'The format of the protocol scheme MUST conform to the following syntax:',
    protocolsJson:
      'When the interaction URL is fetched using an `Accept` header value ' +
      'of `application/json`, a single JSON object containing a `protocols` ' +
      'map MUST be returned where each key is a protocol identifier and ' +
      'each value is a URL that can be used to initiate the interaction.',
    protocolsHtml:
      'When the interaction URL is fetched using any unrecognized `Accept` ' +
      'header value, a `text/html` document MUST be returned with ' +
      'directions instructing a human being to use specific software that ' +
      'understands how to process interaction URLs.',
    inviteRequest:
      'The `inviteRequest` interaction protocol is used by a local system ' +
      'to signal to the remote system that it would like an invitation ' +
      'to a remote system via a specific URL, such as a website where an ' +
      'individual can engage in a use-case specific interaction.',
    vcapi:
      'The `vcapi` interaction protocol is used to initiate a specific ' +
      'exchange as described in Section Participate in an Exchange.'
  },
  errorHandling: {
    problemDetailsType:
      'The `type` map/key MUST be present and its value MUST be a URL ' +
      'identifying the type of problem.',
    problemDetailsReadable:
      'The `title` map/key SHOULD provide a short but specific ' +
      'human-readable string for the problem.',
    unknownOptionType:
      'https://www.w3.org/TR/vcalm#UNKNOWN_OPTION_PROVIDED An option that ' +
      'is unknown to the implementation was provided to the API call.',
    verifiedFalse:
      'If an error is included, the `verified` property of the ' +
      '`VerificationResponse` object MUST be set to `false`',
    verifiedTrue:
      'if no errors are included, it MUST be set to `true`.'
  },
  security: {
    stripUnrecognizedProofs:
      'Implementations maintain allow lists of understood proofs and ensure ' +
      'that any proofs not present are stripped prior to presentation.',
    instancePayloadLimits:
      'It\'s recommended to configure the payload size accepted by endpoints ' +
      'at an instance level.'
  },
  negative: {
    issueMissingCredential:
      'POST /credentials/issue with a missing credential property returns a ' +
      'client error.',
    issueEmptyBody:
      'POST /credentials/issue with an empty request body returns a client ' +
      'error.',
    issueCredentialWithoutType:
      'POST /credentials/issue with a credential missing type returns a ' +
      'client error.',
    verifyForeignCredential:
      'POST /credentials/verify returns verified:false for a reference ' +
      'credential not issued by this service.',
    verifyCredentialWithoutProof:
      'POST /credentials/verify returns verified:false for a credential ' +
      'without proof.',
    verifyCredentialEmpty:
      'POST /credentials/verify returns verified:false for an empty ' +
      'verifiable credential object.',
    verifyCredentialInvalidType:
      'POST /credentials/verify returns verified:false for a credential with ' +
      'an invalid type.',
    verifyForeignPresentation:
      'POST /presentations/verify returns verified:false for a reference ' +
      'presentation not created by this service.',
    verifyPresentationWithoutProof:
      'POST /presentations/verify returns verified:false for a presentation ' +
      'without proof.',
    conformanceProbeIssue:
      'Issue Credential endpoint rejects a malformed issue request.',
    conformanceProbeVerify:
      'Verify endpoint processes a malformed verify request and reports ' +
      'verification failure.',
    workflowStepsNotObject:
      'POST /workflows with invalid steps returns a client error.',
    workflowMissingSteps:
      'POST /workflows without steps returns a client error.',
    workflowExchangeUnknownWorkflow:
      'POST exchanges for an unknown workflow returns a client error.'
  }
};
