/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Generated from the spec TR by respec-normative-statements. Do not edit.
// NORMATIVE: every spec sentence with an RFC 2119 keyword in an
// <em class="rfc2119"> element, keyed by section.
// SECTION: key -> spec section heading.
// REQUIRED: keys whose sentence contains MUST or REQUIRED (matrix rows).
// MARKED: keys the TR marks as normative with the rfc2119 class.

export const NORMATIVE = {
  // 1.3 Conformance
  '1-3-conformance-1':
    'A conforming issuer service implementation MUST provide the interface ' +
    'described in Section 3.2.1 Issue Credential.',
  // 1.3 Conformance
  '1-3-conformance-2':
    'Other interfaces described in Section 3.2 Issuing MAY also be ' +
    'provided.',
  // 1.3 Conformance
  '1-3-conformance-3':
    'A conforming verifier service implementation MUST provide the ' +
    'interface described in Section 3.3.1 Verify Credential and Section ' +
    '3.3.2 Verify Presentation.',
  // 1.3 Conformance
  '1-3-conformance-4':
    'Other interfaces described in Section 3.3 Verifying MAY also be ' +
    'provided.',
  // 1.3 Conformance
  '1-3-conformance-5':
    'A conforming holder service implementation MUST provide the interface ' +
    'described in Section 3.6.4 Get Exchange Protocols and Section 3.6.6 ' +
    'Participate in an Exchange.',
  // 1.3 Conformance
  '1-3-conformance-6':
    'Conformance to protocols, query languages, and data formats described ' +
    'in Section 3.7 Initiating Interactions, Section 3.4 Requesting a ' +
    'Presentation, Section 3.5.2 Create Presentation, Section 3.5 ' +
    'Presenting, and Section 3.6 Workflows and Exchanges MAY also be ' +
    'provided.',
  // 1.3 Conformance
  '1-3-conformance-7':
    'A conforming status service implementation MUST provide the interface ' +
    'described in Section E.3 Update Status.',
  // 1.3 Conformance
  '1-3-conformance-8':
    'A conforming workflow service implementation MUST provide all ' +
    'interfaces Section 3.6 Workflows and Exchanges.',
  // 1.3 Conformance
  '1-3-conformance-9':
    'A conforming service client implementation MUST provide the means to ' +
    'communicate with all REQUIRED interfaces provided by the corresponding ' +
    'service implementation.',
  // 1.3 Conformance
  '1-3-conformance-10':
    'All implementations MAY provide functionality beyond this ' +
    'specification.',
  // Base URL
  'base-url-1':
    'The URL paths used throughout this specification are shown as absolute ' +
    'paths and their base URL MAY be the host name of the server (e.g., ' +
    'website.example), a subdomain (e.g., api.website.example, or a path ' +
    'within that domain (e.g., website.example/api).',
  // Forbidden Authorization
  'forbidden-authorization-1':
    'Requests to this API MUST NOT utilize any authorization protocol that ' +
    'includes long-lived static credentials such as usernames and passwords ' +
    'or similar values in those requests.',
  // Options
  'options-1':
    'All properties of the options object are OPTIONAL when configuring ' +
    'each instance, as these properties are intended to meet per-deployment ' +
    'needs that might vary.',
  // Options
  'options-2':
    'Thus, any given instance configuration MAY prohibit client use of some ' +
    'options properties in order to prevent clients from passing certain ' +
    'data to that instance.',
  // Options
  'options-3':
    'Likewise, an instance configuration MAY require that clients include ' +
    'some options properties.',
  // Options
  'options-4':
    'Implementations MAY extend an options object with additional ' +
    'properties.',
  // Options
  'options-5':
    'Implementations MUST throw an error if an endpoint receives data, ' +
    'options, or option values that it does not understand or know how to ' +
    'process.',
  // Content Serialization
  'content-serialization-1':
    'All entity bodies in requests and responses sent to or received from ' +
    'the API endpoints defined by this specification MUST be serialized as ' +
    'JSON and include the Content-Type header with a media type value of ' +
    'application/json.',
  // Payload Sizes
  'payload-sizes-1':
    'A default maximum size of 10MB per verifiable credential is ' +
    'RECOMMENDED as an interoperability baseline, with the possibility of ' +
    'configuring a larger size if required.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-1':
    'If a use case requires an issuer instance to attach multiple proofs to ' +
    'the provided credential, the instance MUST attach all of these proofs ' +
    'in response to a single call to the /credentials/issue endpoint.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-2':
    'An issuing instance SHOULD be configured to handle existing proofs in ' +
    'one of the following ways:',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-1':
    'A REQUIRED property that specifies the information requested by the ' +
    'verifier.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-2':
    'The value MUST be one or more maps where each map MUST define a type ' +
    'property with an associated string value.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-3':
    'An OPTIONAL string that a verifier provides to a holder during a ' +
    'presentation request.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-4':
    'An OPTIONAL, unique string that is provided by a verifier to a holder ' +
    'during a specific presentation request.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-5':
    'An OPTIONAL map that a verifier provides to a holder to indicate ' +
    'whether the holder MAY or MUST encrypt the verifiable presentation ' +
    'response (and any contained verifiable credentials) with public keys ' +
    'the verifier controls.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-6':
    'The value MUST be a map of the following form:',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-7':
    'required: A REQUIRED boolean.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-8':
    'If true, the holder MUST encrypt the response using one of the ' +
    'provided keys for the response to be acceptable.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-9':
    'If false, the holder MAY send an unencrypted verifiable presentation.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-10':
    'jwks: A REQUIRED array of one or more public JSON Web Keys [RFC7517] ' +
    'with which the holder may encrypt the response.',
  // 3.4.1 Verifiable Presentation Request
  '3-4-1-verifiable-presentation-request-11':
    'Private key material MUST NOT be included.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-1':
    'An OPTIONAL string that provides a human-readable explanation for why ' +
    'the credential is being requested.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-2':
    'This MAY be displayed to the holder by their software.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-3':
    'An OPTIONAL object that provides an example of the credential being ' +
    'requested, including its @context, type, and optionally ' +
    'credentialSubject fields to indicate which claims are needed.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-4':
    'An OPTIONAL array of items, or lists that contain items, that identify ' +
    'entities that the verifier recognizes and accepts as issuers of the ' +
    'verifiable credential.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-5':
    'Each item MUST be either 1) a [URL] that identifies an issuer in the ' +
    'issuer property of the received verifiable credential, or 2) an object ' +
    'that contains an id property whose value is a [URL] that identifies an ' +
    'issuer in the issuer property of the received verifiable credential, ' +
    'or 3) an object that contains a recognizedIn property that is ' +
    'associated with an object with a type property that is set to ' +
    'RecognizedEntityCredential and an id property with a [URL] value that ' +
    'points to such a credential as defined in the Recognized Entities v1.0 ' +
    'specification;',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-6':
    'An OPTIONAL array specifying which cryptographic proof suites the ' +
    'verifier will accept.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-7':
    'Each element SHOULD be an object with a cryptosuite property ' +
    'referencing a Data Integrity cryptosuite name or Ed25519Signature2020 ' +
    'for legacy support (for backwards compatibility, string values MAY ' +
    'also be used and are to be interpreted as the cryptosuite name).',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-8':
    'This property MAY be used independently of acceptedEnvelopes, which is ' +
    'only applicable to enveloped credentials.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-9':
    'An OPTIONAL array specifying which envelope formats the verifier will ' +
    'accept.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-10':
    'Each element SHOULD be an object with a mediaType property referencing ' +
    'the media type for the envelope (for backwards compatibility, string ' +
    'values MAY also be used and are to be interpreted as the media type).',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-11':
    'This property MAY be used independently of acceptedCryptosuites, which ' +
    'is only applicable to JSON-LD credentials signed with an acceptable ' +
    'cryptosuite.',
  // 3.4.2 Query By Example
  '3-4-2-query-by-example-12':
    'This would allow a wallet to respond with only the givenName of the ' +
    'requested credential with no expectation of any other field being ' +
    'included. _This does not prevent a wallet from oversharing by ' +
    'including additional fields in its response to the query._ To signal ' +
    'that selective disclosure cryptosuites are acceptable, verifiers ' +
    'SHOULD include cryptosuites such as bbs-2023 or ecdsa-sd-2023 in the ' +
    'acceptedCryptosuites array.',
  // 3.4.3.1 The DID Authentication Query Format
  '3-4-3-1-the-did-authentication-query-format-1':
    'A DID Authentication query MUST be of the following form:',
  // 3.4.3.1 The DID Authentication Query Format
  '3-4-3-1-the-did-authentication-query-format-2':
    'A REQUIRED string value that MUST be set to DIDAuthentication.',
  // 3.4.3.1 The DID Authentication Query Format
  '3-4-3-1-the-did-authentication-query-format-3':
    'Each object in the array MUST contain a property called method with a ' +
    'value that is a DID Method name, and MAY contain other properties that ' +
    'are specific to the DID Method.',
  // 3.4.3.1 The DID Authentication Query Format
  '3-4-3-1-the-did-authentication-query-format-4':
    'An optional array of objects that conveys the cryptography suites ' +
    'among which the holder MUST choose when generating a cryptographic ' +
    'proof to be submitted to this verifier.',
  // 3.4.3.1 The DID Authentication Query Format
  '3-4-3-1-the-did-authentication-query-format-5':
    'Each object in the array MUST contain a property called cryptosuite ' +
    'with a value that is a Data Integrity cryptosuite name (or ' +
    'Ed25519Signature2020 for legacy support), and MAY contain other ' +
    'properties that are specific to the cryptosuite.',
  // 3.4.3.2 The DID Authentication Response Format
  '3-4-3-2-the-did-authentication-response-format-1':
    'A DID Authentication response MUST be a verifiable presentation of the ' +
    'following form:',
  // 3.4.3.2 The DID Authentication Response Format
  '3-4-3-2-the-did-authentication-response-format-2':
    'A REQUIRED string value that MUST be set to VerifiablePresentation.',
  // 3.4.3.2 The DID Authentication Response Format
  '3-4-3-2-the-did-authentication-response-format-3':
    'A REQUIRED string value that MUST be set to a specific DID that is of ' +
    'the type that was requested in the DID Authentication query.',
  // 3.4.3.2 The DID Authentication Response Format
  '3-4-3-2-the-did-authentication-response-format-4':
    'A REQUIRED value that MUST be one or more specific digital proof types ' +
    'that were requested in the DID Authentication query.',
  // 3.4.3.2 The DID Authentication Response Format
  '3-4-3-2-the-did-authentication-response-format-5':
    'Each proof object MUST include the domain and challenge values that ' +
    'were provided in the DID Authentication query.',
  // 3.4.3.2 The DID Authentication Response Format
  '3-4-3-2-the-did-authentication-response-format-6':
    'Holder implementations MUST ensure that the domain specified by the ' +
    'verifier matches the domain used for the current channel of ' +
    'communication.',
  // 3.6 Workflows and Exchanges
  '3-6-workflows-and-exchanges-1':
    'A server MAY include this value;',
  // 3.6 Workflows and Exchanges
  '3-6-workflows-and-exchanges-2':
    'if present, the client SHOULD include it in its next message.',
  // 3.6 Workflows and Exchanges
  '3-6-workflows-and-exchanges-3':
    'The value SHOULD be a urn:uuid value.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-1':
    'An issue request object MAY also include a variables property to ' +
    'provide values to be used when evaluating the credential template.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-2':
    'An issue request object MAY include an optional result property whose ' +
    'value MUST be either the name of a top-level variable in the ' +
    'exchange\'s variables object or a JSON pointer to any variable within ' +
    'the exchange\'s variables object, identifying where the result of the ' +
    'issue request is to be stored.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-3':
    'A step MAY include a verifiablePresentation to explicitly express one ' +
    'or more verifiable presentations to be used in that step.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-4':
    'A step MAY include a redirectUrl to specify a URL to send to the ' +
    'client that can be used to continue an interaction at another ' +
    'location.',
  // 3.6.5 Get Current Exchange VPR
  '3-6-5-get-current-exchange-vpr-1':
    'This endpoint MUST return the current verifiable presentation request ' +
    'to be returned by an exchange when accessed with an Accept header ' +
    'value of application/json.',
  // 3.6.5 Get Current Exchange VPR
  '3-6-5-get-current-exchange-vpr-2':
    'Processing this request SHOULD NOT advance the exchange to a new step ' +
    'nor perform any state-changing side effects, such as credential ' +
    'issuance.',
  // 3.6.5 Get Current Exchange VPR
  '3-6-5-get-current-exchange-vpr-3':
    'If there is no verifiable presentation request available for the ' +
    'exchange in the current step, the value of the ' +
    'verifiablePresentationRequest property returned by this endpoint MUST ' +
    'be an empty JSON object.',
  // 3.6.5 Get Current Exchange VPR
  '3-6-5-get-current-exchange-vpr-4':
    'To make a [digital-credentials] request backed by the VCALM protocol, ' +
    'the coordinator MUST provide the interaction URL as the request data.',
  // 3.6.5 Get Current Exchange VPR
  '3-6-5-get-current-exchange-vpr-5':
    'Subsequently, the browser MUST fetch the interaction URL, retrieve the ' +
    'supported protocols, and perform an HTTP GET on the vcapi URL ' +
    'concatenated with /request.',
  // 3.6.5 Get Current Exchange VPR
  '3-6-5-get-current-exchange-vpr-6':
    'Finally, this endpoint operates without the need for signed requests, ' +
    'as it MAY rely on TLS and existing CA infrastructure, without a need ' +
    'for new certificates nor a need to incorporate those into the exchange ' +
    'protocol in an additive way.',
  // 3.6.5 Get Current Exchange VPR
  '3-6-5-get-current-exchange-vpr-7':
    'However, if we find that the [digital-credentials] or other supported ' +
    'protocols require signed requests or encrypted responses, then the ' +
    'request MAY be returned as a signed object referencing a public key ' +
    'that SHOULD be used to encrypt the response.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-1':
    'A server MAY include a referenceId property in an exchange message.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-2':
    'If the client receives a referenceId, it SHOULD include the same ' +
    'referenceId in its next message to the server.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-3':
    'The value of referenceId SHOULD be a urn:uuid value.',
  // 3.6.9 Exchange Examples
  '3-6-9-exchange-examples-1':
    'The holder coordinator MAY call the Coordinator\'s exchange discovery ' +
    'endpoint to determine if the holder coordinator supports the ' +
    'Coordinator\'s protocol requirements on a particular endpoint, before ' +
    'actually initiating the exchange.',
  // 3.7.1 Interaction URL Format
  '3-7-1-interaction-url-format-1':
    'The format of the interaction URL MUST conform to the syntax for the ' +
    'URL Standard and contain an iuv query parameter encoding the ' +
    'interaction URL version number, which MUST be 1 when using this ' +
    'version of this API.',
  // 3.7.1 Interaction URL Format
  '3-7-1-interaction-url-format-2':
    'The interaction URL SHOULD be an HTTPS URL that contains an ' +
    'interaction-specific identifier.',
  // 3.7.1 Interaction URL Format
  '3-7-1-interaction-url-format-3':
    'The URL SHOULD be opaque and require no URL syntax processing before ' +
    'it is fetched by the receiving system.',
  // 3.7.1 Interaction URL Format
  '3-7-1-interaction-url-format-4':
    'Implementers SHOULD NOT put information that can be expressed in the ' +
    'response to a GET request for an interaction URL, defined in Section ' +
    '3.7.4 Interaction Protocols Response, into the query parameters of the ' +
    'interaction URL.',
  // 3.7.2 Interaction QR Code Format
  '3-7-2-interaction-qr-code-format-1':
    'An interaction QR Code MUST be an interaction URL expressed as a QR ' +
    'code according to ISO18004:2024: QR Code Bar Code Symbology ' +
    'Specification.',
  // 3.7.2 Interaction QR Code Format
  '3-7-2-interaction-qr-code-format-2':
    'To ensure broad interoperability, the length of the interaction URL ' +
    'SHOULD be as short as possible, SHOULD NOT exceed 400 alphanumeric ' +
    'characters, and MUST NOT exceed 4,296 alphanumeric characters.',
  // 3.7.3 Interaction Scheme Format
  '3-7-3-interaction-scheme-format-1':
    'The format of the protocol scheme MUST conform to the following ' +
    'syntax:',
  // 3.7.4 Interaction Protocols Response
  '3-7-4-interaction-protocols-response-1':
    'When the interaction URL is fetched using an Accept header value of ' +
    'application/json, a single JSON object containing a protocols map MUST ' +
    'be returned where each key is a protocol identifier and each value is ' +
    'a URL that can be used to initiate the interaction.',
  // 3.7.4 Interaction Protocols Response
  '3-7-4-interaction-protocols-response-2':
    'When the interaction URL is fetched using any unrecognized Accept ' +
    'header value, a text/html document MUST be returned with directions ' +
    'instructing a human being to use specific software that understands ' +
    'how to process interaction URLs.',
  // 3.8 Error Handling
  '3-8-error-handling-1':
    'The type key MUST be present and its value MUST be a URL identifying ' +
    'the type of problem.',
  // 3.8 Error Handling
  '3-8-error-handling-2':
    'The title key SHOULD provide a short but specific human-readable ' +
    'string for the problem.',
  // 3.8 Error Handling
  '3-8-error-handling-3':
    'The detail key SHOULD provide a longer human-readable string for the ' +
    'problem.',
  // 3.8.1 Verification Errors vs. Warnings
  '3-8-1-verification-errors-vs-warnings-1':
    'If an error is included, the verified property of the ' +
    'VerificationResponse object MUST be set to false;',
  // 3.8.1 Verification Errors vs. Warnings
  '3-8-1-verification-errors-vs-warnings-2':
    'if no errors are included, it MUST be set to true.',
  // E.1 Create Status List
  'e-1-create-status-list-1':
    'When a status service manages more than one index-allocation context, ' +
    'clients MAY supply an indexAllocator value when creating a status ' +
    'list.',
  // E.1 Create Status List
  'e-1-create-status-list-2':
    'If an indexAllocator is supplied at list creation (or when indices are ' +
    'first assigned at issuance), subsequent status updates that depend on ' +
    'that allocation state MUST reuse the same indexAllocator value unless ' +
    'the implementation can unambiguously infer a single default allocator.',
};

export const SECTION = {
  '1-3-conformance-1':
    '1.3 Conformance',
  '1-3-conformance-2':
    '1.3 Conformance',
  '1-3-conformance-3':
    '1.3 Conformance',
  '1-3-conformance-4':
    '1.3 Conformance',
  '1-3-conformance-5':
    '1.3 Conformance',
  '1-3-conformance-6':
    '1.3 Conformance',
  '1-3-conformance-7':
    '1.3 Conformance',
  '1-3-conformance-8':
    '1.3 Conformance',
  '1-3-conformance-9':
    '1.3 Conformance',
  '1-3-conformance-10':
    '1.3 Conformance',
  'base-url-1':
    'Base URL',
  'forbidden-authorization-1':
    'Forbidden Authorization',
  'options-1':
    'Options',
  'options-2':
    'Options',
  'options-3':
    'Options',
  'options-4':
    'Options',
  'options-5':
    'Options',
  'content-serialization-1':
    'Content Serialization',
  'payload-sizes-1':
    'Payload Sizes',
  '3-2-1-issue-credential-1':
    '3.2.1 Issue Credential',
  '3-2-1-issue-credential-2':
    '3.2.1 Issue Credential',
  '3-4-1-verifiable-presentation-request-1':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-2':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-3':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-4':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-5':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-6':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-7':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-8':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-9':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-10':
    '3.4.1 Verifiable Presentation Request',
  '3-4-1-verifiable-presentation-request-11':
    '3.4.1 Verifiable Presentation Request',
  '3-4-2-query-by-example-1':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-2':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-3':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-4':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-5':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-6':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-7':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-8':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-9':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-10':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-11':
    '3.4.2 Query By Example',
  '3-4-2-query-by-example-12':
    '3.4.2 Query By Example',
  '3-4-3-1-the-did-authentication-query-format-1':
    '3.4.3.1 The DID Authentication Query Format',
  '3-4-3-1-the-did-authentication-query-format-2':
    '3.4.3.1 The DID Authentication Query Format',
  '3-4-3-1-the-did-authentication-query-format-3':
    '3.4.3.1 The DID Authentication Query Format',
  '3-4-3-1-the-did-authentication-query-format-4':
    '3.4.3.1 The DID Authentication Query Format',
  '3-4-3-1-the-did-authentication-query-format-5':
    '3.4.3.1 The DID Authentication Query Format',
  '3-4-3-2-the-did-authentication-response-format-1':
    '3.4.3.2 The DID Authentication Response Format',
  '3-4-3-2-the-did-authentication-response-format-2':
    '3.4.3.2 The DID Authentication Response Format',
  '3-4-3-2-the-did-authentication-response-format-3':
    '3.4.3.2 The DID Authentication Response Format',
  '3-4-3-2-the-did-authentication-response-format-4':
    '3.4.3.2 The DID Authentication Response Format',
  '3-4-3-2-the-did-authentication-response-format-5':
    '3.4.3.2 The DID Authentication Response Format',
  '3-4-3-2-the-did-authentication-response-format-6':
    '3.4.3.2 The DID Authentication Response Format',
  '3-6-workflows-and-exchanges-1':
    '3.6 Workflows and Exchanges',
  '3-6-workflows-and-exchanges-2':
    '3.6 Workflows and Exchanges',
  '3-6-workflows-and-exchanges-3':
    '3.6 Workflows and Exchanges',
  '3-6-1-create-workflow-1':
    '3.6.1 Create Workflow',
  '3-6-1-create-workflow-2':
    '3.6.1 Create Workflow',
  '3-6-1-create-workflow-3':
    '3.6.1 Create Workflow',
  '3-6-1-create-workflow-4':
    '3.6.1 Create Workflow',
  '3-6-5-get-current-exchange-vpr-1':
    '3.6.5 Get Current Exchange VPR',
  '3-6-5-get-current-exchange-vpr-2':
    '3.6.5 Get Current Exchange VPR',
  '3-6-5-get-current-exchange-vpr-3':
    '3.6.5 Get Current Exchange VPR',
  '3-6-5-get-current-exchange-vpr-4':
    '3.6.5 Get Current Exchange VPR',
  '3-6-5-get-current-exchange-vpr-5':
    '3.6.5 Get Current Exchange VPR',
  '3-6-5-get-current-exchange-vpr-6':
    '3.6.5 Get Current Exchange VPR',
  '3-6-5-get-current-exchange-vpr-7':
    '3.6.5 Get Current Exchange VPR',
  '3-6-6-participate-in-an-exchange-1':
    '3.6.6 Participate in an Exchange',
  '3-6-6-participate-in-an-exchange-2':
    '3.6.6 Participate in an Exchange',
  '3-6-6-participate-in-an-exchange-3':
    '3.6.6 Participate in an Exchange',
  '3-6-9-exchange-examples-1':
    '3.6.9 Exchange Examples',
  '3-7-1-interaction-url-format-1':
    '3.7.1 Interaction URL Format',
  '3-7-1-interaction-url-format-2':
    '3.7.1 Interaction URL Format',
  '3-7-1-interaction-url-format-3':
    '3.7.1 Interaction URL Format',
  '3-7-1-interaction-url-format-4':
    '3.7.1 Interaction URL Format',
  '3-7-2-interaction-qr-code-format-1':
    '3.7.2 Interaction QR Code Format',
  '3-7-2-interaction-qr-code-format-2':
    '3.7.2 Interaction QR Code Format',
  '3-7-3-interaction-scheme-format-1':
    '3.7.3 Interaction Scheme Format',
  '3-7-4-interaction-protocols-response-1':
    '3.7.4 Interaction Protocols Response',
  '3-7-4-interaction-protocols-response-2':
    '3.7.4 Interaction Protocols Response',
  '3-8-error-handling-1':
    '3.8 Error Handling',
  '3-8-error-handling-2':
    '3.8 Error Handling',
  '3-8-error-handling-3':
    '3.8 Error Handling',
  '3-8-1-verification-errors-vs-warnings-1':
    '3.8.1 Verification Errors vs. Warnings',
  '3-8-1-verification-errors-vs-warnings-2':
    '3.8.1 Verification Errors vs. Warnings',
  'e-1-create-status-list-1':
    'E.1 Create Status List',
  'e-1-create-status-list-2':
    'E.1 Create Status List',
};

export const REQUIRED = [
  '1-3-conformance-1',
  '1-3-conformance-3',
  '1-3-conformance-5',
  '1-3-conformance-7',
  '1-3-conformance-8',
  '1-3-conformance-9',
  'forbidden-authorization-1',
  'options-5',
  'content-serialization-1',
  '3-2-1-issue-credential-1',
  '3-4-1-verifiable-presentation-request-1',
  '3-4-1-verifiable-presentation-request-2',
  '3-4-1-verifiable-presentation-request-5',
  '3-4-1-verifiable-presentation-request-6',
  '3-4-1-verifiable-presentation-request-7',
  '3-4-1-verifiable-presentation-request-8',
  '3-4-1-verifiable-presentation-request-10',
  '3-4-1-verifiable-presentation-request-11',
  '3-4-2-query-by-example-5',
  '3-4-3-1-the-did-authentication-query-format-1',
  '3-4-3-1-the-did-authentication-query-format-2',
  '3-4-3-1-the-did-authentication-query-format-3',
  '3-4-3-1-the-did-authentication-query-format-4',
  '3-4-3-1-the-did-authentication-query-format-5',
  '3-4-3-2-the-did-authentication-response-format-1',
  '3-4-3-2-the-did-authentication-response-format-2',
  '3-4-3-2-the-did-authentication-response-format-3',
  '3-4-3-2-the-did-authentication-response-format-4',
  '3-4-3-2-the-did-authentication-response-format-5',
  '3-4-3-2-the-did-authentication-response-format-6',
  '3-6-1-create-workflow-2',
  '3-6-5-get-current-exchange-vpr-1',
  '3-6-5-get-current-exchange-vpr-3',
  '3-6-5-get-current-exchange-vpr-4',
  '3-6-5-get-current-exchange-vpr-5',
  '3-7-1-interaction-url-format-1',
  '3-7-2-interaction-qr-code-format-1',
  '3-7-2-interaction-qr-code-format-2',
  '3-7-3-interaction-scheme-format-1',
  '3-7-4-interaction-protocols-response-1',
  '3-7-4-interaction-protocols-response-2',
  '3-8-error-handling-1',
  '3-8-1-verification-errors-vs-warnings-1',
  '3-8-1-verification-errors-vs-warnings-2',
  'e-1-create-status-list-2',
];

export const MARKED = [
  '1-3-conformance-1',
  '1-3-conformance-2',
  '1-3-conformance-3',
  '1-3-conformance-4',
  '1-3-conformance-5',
  '1-3-conformance-6',
  '1-3-conformance-7',
  '1-3-conformance-8',
  '1-3-conformance-9',
  '1-3-conformance-10',
  'base-url-1',
  'forbidden-authorization-1',
  'options-1',
  'options-2',
  'options-3',
  'options-4',
  'options-5',
  'content-serialization-1',
  'payload-sizes-1',
  '3-2-1-issue-credential-1',
  '3-2-1-issue-credential-2',
  '3-4-1-verifiable-presentation-request-1',
  '3-4-1-verifiable-presentation-request-2',
  '3-4-1-verifiable-presentation-request-3',
  '3-4-1-verifiable-presentation-request-4',
  '3-4-1-verifiable-presentation-request-5',
  '3-4-1-verifiable-presentation-request-6',
  '3-4-1-verifiable-presentation-request-7',
  '3-4-1-verifiable-presentation-request-8',
  '3-4-1-verifiable-presentation-request-9',
  '3-4-1-verifiable-presentation-request-10',
  '3-4-1-verifiable-presentation-request-11',
  '3-4-2-query-by-example-1',
  '3-4-2-query-by-example-2',
  '3-4-2-query-by-example-3',
  '3-4-2-query-by-example-4',
  '3-4-2-query-by-example-5',
  '3-4-2-query-by-example-6',
  '3-4-2-query-by-example-7',
  '3-4-2-query-by-example-8',
  '3-4-2-query-by-example-9',
  '3-4-2-query-by-example-10',
  '3-4-2-query-by-example-11',
  '3-4-2-query-by-example-12',
  '3-4-3-1-the-did-authentication-query-format-1',
  '3-4-3-1-the-did-authentication-query-format-2',
  '3-4-3-1-the-did-authentication-query-format-3',
  '3-4-3-1-the-did-authentication-query-format-4',
  '3-4-3-1-the-did-authentication-query-format-5',
  '3-4-3-2-the-did-authentication-response-format-1',
  '3-4-3-2-the-did-authentication-response-format-2',
  '3-4-3-2-the-did-authentication-response-format-3',
  '3-4-3-2-the-did-authentication-response-format-4',
  '3-4-3-2-the-did-authentication-response-format-5',
  '3-4-3-2-the-did-authentication-response-format-6',
  '3-6-workflows-and-exchanges-1',
  '3-6-workflows-and-exchanges-2',
  '3-6-workflows-and-exchanges-3',
  '3-6-1-create-workflow-1',
  '3-6-1-create-workflow-2',
  '3-6-1-create-workflow-3',
  '3-6-1-create-workflow-4',
  '3-6-5-get-current-exchange-vpr-1',
  '3-6-5-get-current-exchange-vpr-2',
  '3-6-5-get-current-exchange-vpr-3',
  '3-6-5-get-current-exchange-vpr-4',
  '3-6-5-get-current-exchange-vpr-5',
  '3-6-5-get-current-exchange-vpr-6',
  '3-6-5-get-current-exchange-vpr-7',
  '3-6-6-participate-in-an-exchange-1',
  '3-6-6-participate-in-an-exchange-2',
  '3-6-6-participate-in-an-exchange-3',
  '3-6-9-exchange-examples-1',
  '3-7-1-interaction-url-format-1',
  '3-7-1-interaction-url-format-2',
  '3-7-1-interaction-url-format-3',
  '3-7-1-interaction-url-format-4',
  '3-7-2-interaction-qr-code-format-1',
  '3-7-2-interaction-qr-code-format-2',
  '3-7-3-interaction-scheme-format-1',
  '3-7-4-interaction-protocols-response-1',
  '3-7-4-interaction-protocols-response-2',
  '3-8-error-handling-1',
  '3-8-error-handling-2',
  '3-8-error-handling-3',
  '3-8-1-verification-errors-vs-warnings-1',
  '3-8-1-verification-errors-vs-warnings-2',
  'e-1-create-status-list-1',
  'e-1-create-status-list-2',
];
