/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

// Generated from the VCALM TR by respec-normative-statements. Do not edit.
// Each value is one sentence from the spec that contains an RFC 2119 keyword.

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
    'described in Section D.3 Update Status.',
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
    'website.example ), a subdomain (e.g., api.website.example, or a path ' +
    'within that domain (e.g., website.example/api ).',
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
    'Each item in the @context array MUST be a string.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-2':
    'Each item in the type array MUST be a string.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-3':
    'It MUST be an object of the following form:',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-4':
    'Used with selective disclosure schemes to specify mandatory reveal ' +
    'statements Each item in the mandatoryPointers array MUST be a string.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-5':
    'credentialId SHOULD NOT be set by the issuer coordinator if the ' +
    'credential.id property is set, nor should credentialId be used as a ' +
    'replacement for credential.id;',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-6':
    'The issuer service SHOULD NOT auto-generate a credentialId if one is ' +
    'not supplied by the issuer coordinator, because doing so could create ' +
    'a partitioning error if the result is never received by the client.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-7':
    'This MUST be a "data:" scheme URL [RFC2397] that expresses a secured ' +
    'verifiable credential using an enveloping security scheme.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-8':
    'This MUST be EnvelopedVerifiableCredential.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-9':
    'If a use case requires an issuer instance to attach multiple proofs to ' +
    'the provided credential, the instance MUST attach all of these proofs ' +
    'in response to a single call to the /credentials/issue endpoint.',
  // 3.2.1 Issue Credential
  '3-2-1-issue-credential-10':
    'An issuing instance SHOULD be configured to handle existing proofs in ' +
    'one of the following ways:',
  // 3.2.2 Get a Specific Credential
  '3-2-2-get-a-specific-credential-1':
    'I\'m a teapot - MUST not be returned outside of pre-arranged scenarios ' +
    'between both parties',
  // 3.3.1 Verify Credential
  '3-3-1-verify-credential-1':
    'Options for specifying how a credential is verified It MUST be an ' +
    'object of the following form:',
  // 3.3.1 Verify Credential
  '3-3-1-verify-credential-2':
    'Each item in the problemDetails array MUST be an object of the ' +
    'following form:',
  // 3.3.1 Verify Credential
  '3-3-1-verify-credential-3':
    'Each item in the credentialSchema array MUST be Results from verifying ' +
    'a credentialSchema object.',
  // 3.3.1 Verify Credential
  '3-3-1-verify-credential-4':
    'Each item in the credentialStatus array MUST be Results of verifying a ' +
    'credentialStatus object.',
  // 3.3.1 Verify Credential
  '3-3-1-verify-credential-5':
    'Each item in the proof array MUST be Results from verifying a proof ' +
    'object.',
  // 3.3.2 Verify Presentation
  '3-3-2-verify-presentation-1':
    'Implementations MAY extend this object with additional properties to ' +
    'control verification behavior.',
  // 3.3.2 Verify Presentation
  '3-3-2-verify-presentation-2':
    'If true, then the verified presentation MUST be returned.',
  // 3.3.2 Verify Presentation
  '3-3-2-verify-presentation-3':
    'If false or not provided, then the verified presentation MUST NOT be ' +
    'returned.',
  // 3.3.2 Verify Presentation
  '3-3-2-verify-presentation-4':
    'This MUST be a "data:" scheme URL [RFC2397] that expresses a secured ' +
    'verifiable presentation using an enveloping security scheme.',
  // 3.3.2 Verify Presentation
  '3-3-2-verify-presentation-5':
    'This MUST be EnvelopedVerifiablePresentation.',
  // 3.3.2 Verify Presentation
  '3-3-2-verify-presentation-6':
    'Each item in the credentials array MUST be Object to report the result ' +
    'of a verification process on a VerifiableCredential.',
  // 3.3.3 Create Challenge
  '3-3-3-create-challenge-1':
    'Object containg a challenge It MUST be an object of the following ' +
    'form:',
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
    'Each item MUST be either 1) a URL that identifies an issuer in the ' +
    'issuer property of the received verifiable credential, or 2) an object ' +
    'that contains an id property whose value is a URL that identifies an ' +
    'issuer in the issuer property of the received verifiable credential, ' +
    'or 3) an object that contains a recognizedIn property that is ' +
    'associated with an object with a type property that is set to ' +
    'RecognizedEntityCredential and an id property with a URL value that ' +
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
    'for legacy (for backwards compatibility, string values MAY also be ' +
    'used and are to be interpreted as the cryptosuite name).',
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
    'Ed25519Signature2020 for legacy), and MAY contain other properties ' +
    'that are specific to the cryptosuite.',
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
  // 3.5.1 Derive Credential
  '3-5-1-derive-credential-1':
    'Each item in the selectivePointers array MUST be a string.',
  // 3.5.3 Get Presentations
  '3-5-3-get-presentations-1':
    'Each item in the array MUST be an object of the following form:',
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
    'Passing an ID is OPTIONAL.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-2':
    'Passing initialStep is REQUIRED.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-3':
    'An OPTIONAL property that specifies the root controller of the ' +
    'instance, which can be used by systems supporting authorization ' +
    'mechanisms like Authorization Capabilities (ZCAPs), which rely on ' +
    'object capabilities.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-4':
    'An OPTIONAL property that specifies authorization scheme information ' +
    'for the endpoint, such as an OAuth2 configuration.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-5':
    'An array where each item MUST be an object of the following form:',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-6':
    'Passing the steps object is REQUIRED.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-7':
    'Each item in the query array MUST be an object of the following form:',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-8':
    'Each item in the acceptedIssuers array MUST be an object of the ' +
    'following form:',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-9':
    'Each item in the acceptedCryptosuites array MUST be a undefined:',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-10':
    'Each item in the acceptedEnvelopes array MUST be a undefined:',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-11':
    'Each item in the interact array MUST be an object of the following ' +
    'form:',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-12':
    'The document MAY include an embedded proof.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-13':
    'An EnvelopedVerifiablePresentation MAY be used instead, where noted in ' +
    'the API description.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-14':
    'Passing redirectUrl is OPTIONAL.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-15':
    'Each item in the issueRequests array MUST be an object of the ' +
    'following form:',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-16':
    'The value MUST be JsonSchema.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-17':
    'Passing nextStep is OPTIONAL.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-18':
    'This field MUST NOT be present on the final step configuration.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-19':
    'The value MUST be either the name of a top-level variable in the ' +
    'exchange\'s variables object (see Create Exchange ) or a JSON pointer ' +
    'to any variable within the exchange\'s variables object.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-20':
    'Either this or authorizationRequest MUST be present, but not both.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-21':
    'An issue request object MAY also include a variables property to ' +
    'provide values to be used when evaluating the credential template.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-22':
    'An issue request object MAY include an optional result property whose ' +
    'value MUST be either the name of a top-level variable in the ' +
    'exchange\'s variables object or a JSON pointer to any variable within ' +
    'the exchange\'s variables object, identifying where the result of the ' +
    'issue request is to be stored.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-23':
    'A step MAY include a verifiablePresentation to explicitly express one ' +
    'or more verifiable presentation s to be used in that step.',
  // 3.6.1 Create Workflow
  '3-6-1-create-workflow-24':
    'A step MAY include a redirectUrl to specify a URL to send to the ' +
    'client that can be used to continue an interaction at another ' +
    'location.',
  // 3.6.2 Get Workflow Configuration
  '3-6-2-get-workflow-configuration-1':
    'Passing intialStep is REQUIRED.',
  // 3.6.2 Get Workflow Configuration
  '3-6-2-get-workflow-configuration-2':
    'Passing controller is OPTIONAL.',
  // 3.6.2 Get Workflow Configuration
  '3-6-2-get-workflow-configuration-3':
    'Passing authorization is OPTIONAL.',
  // 3.6.2 Get Workflow Configuration
  '3-6-2-get-workflow-configuration-4':
    'Passing credentialTemplates is OPTIONAL.',
  // 3.6.2 Get Workflow Configuration
  '3-6-2-get-workflow-configuration-5':
    'Each item in the credentialTemplates array MUST be an object of the ' +
    'following form:',
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
    'To make a digital-credentials request backed by the VCALM protocol, ' +
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
    'However, if we find that the digital-credentials or other supported ' +
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
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-4':
    'When the server previously sent a referenceId, the client SHOULD ' +
    'include it here to aid debugging and message correlation.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-5':
    'If the server previously sent a referenceId, the client SHOULD include ' +
    'it here to aid debugging and message correlation.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-6':
    'A client MAY send an interaction URL to the server as a redirectUrl, ' +
    'inviting the server to become the client for a different related ' +
    'exchange starting with that interaction URL.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-7':
    'A server MAY engage with this redirectUrl.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-8':
    'Each item in the verifiablePresentation array MUST be a undefined:',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-9':
    'A server MAY also send an interaction URL to the client as a ' +
    'redirectUrl, inviting the client to automatically initiate another ' +
    'exchange.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-10':
    'In this case, a client that understands interaction URLs MAY retrieve ' +
    'the protocols associated with the interaction URL and start the ' +
    'exchange.',
  // 3.6.6 Participate in an Exchange
  '3-6-6-participate-in-an-exchange-11':
    'A client that does not understand interaction URLs MAY direct the ' +
    'holder to the redirectUrl in the browser, where an HTML page MAY ' +
    'display next steps.',
  // 3.6.8 Exchange Step Callbacks
  '3-6-8-exchange-step-callbacks-1':
    'The URL SHOULD be a capability URL to ensure that it can only be used ' +
    'by parties with whom the URL is shared without a need for ' +
    'authorization tokens, periodic token refresh, nor client registration.',
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
    'code according to ISO18004:2024:',
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
  // D.1 Create Status List
  'd-1-create-status-list-1':
    'An EnvelopedVerifiableCredential MAY be used instead, where noted in ' +
    'the API description.',
};
