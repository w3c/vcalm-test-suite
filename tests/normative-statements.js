/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

/**
 * Exact normative statement text: only sentences with an RFC 2119 keyword.
 * Source: VCALM TR. Test titles and endpoint descriptions do not belong here.
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
      'Requests to this API MUST NOT utilize any authorization protocol ' +
      'that includes long-lived static credentials such as usernames and ' +
      'passwords or similar values in those requests.',
    vcPayloadBaseline:
      'A default maximum size of 10MB per verifiable credential is ' +
      'RECOMMENDED as an interoperability baseline, with the possibility of ' +
      'configuring a larger size if required.'
  },
  conformance: {
    issuer:
      'A conforming issuer service implementation MUST provide the interface ' +
      'described in Section 3.2.1 Issue Credential.',
    issuingMay:
      'Other interfaces described in Section 3.2 Issuing MAY also be ' +
      'provided.',
    verifyCredential:
      'A conforming verifier service implementation MUST provide the ' +
      'interface described in Section 3.3.1 Verify Credential and Section ' +
      '3.3.2 Verify Presentation.',
    verifyPresentation:
      'A conforming verifier service implementation MUST provide the ' +
      'interface described in Section 3.3.1 Verify Credential and Section ' +
      '3.3.2 Verify Presentation.',
    verifyingMay:
      'Other interfaces described in Section 3.3 Verifying MAY also be ' +
      'provided.',
    getExchangeProtocols:
      'A conforming holder service implementation MUST provide the interface ' +
      'described in Section 3.6.4 Get Exchange Protocols.',
    participateInExchange:
      'A conforming holder service implementation MUST provide the interface ' +
      'described in Section 3.6.4 Get Exchange Protocols and Section 3.6.6 ' +
      'Participate in an Exchange.',
    holderMay:
      'Conformance to protocols, query languages, and data formats described ' +
      'in Section 3.7 Initiating Interactions, Section 3.4 Requesting a ' +
      'Presentation, Section 3.5.2 Create Presentation, Section 3.5 ' +
      'Presenting, and Section 3.6 Workflows and Exchanges MAY also be ' +
      'provided.',
    status:
      'A conforming status service implementation MUST provide the interface ' +
      'described in Section D.3 Update Status.',
    workflow:
      'A conforming workflow service implementation MUST provide all ' +
      'interfaces Section 3.6 Workflows and Exchanges.',
    serviceClient:
      'A conforming service client implementation MUST provide the ' +
      'means to communicate with all REQUIRED interfaces provided by the ' +
      'corresponding service implementation.'
  },
  issuing: {
    multipleProofs:
      'If a use case requires an issuer instance to attach multiple proofs ' +
      'to the provided `credential`, the instance MUST attach all of these ' +
      'proofs in response to a single call to the `/credentials/issue` ' +
      'endpoint.',
    proofHandling:
      'An issuing instance SHOULD be configured to handle existing proofs in ' +
      'one of the following ways:'
  },
  requestingPresentation: {
    queryRequired:
      'query A REQUIRED property that specifies the information requested by ' +
      'the verifier.',
    queryValue:
      'The value MUST be one or more maps where each map MUST define a type ' +
      'property with an associated string value.',
    queryMapType:
      'each map MUST define a type property with an associated string value.',
    acceptedIssuerItem:
      'Each acceptedIssuers item MUST be an issuer URL, an object with an ' +
      'id URL, or an object with a recognizedIn RecognizedEntityCredential.',
    matchAlgorithm:
      'A conforming implementation MUST produce the same output as the ' +
      'algorithm for matching a credential to a QueryByExample.',
    acceptedIssuerMatch:
      'If acceptedIssuers is present, the credential\'s issuer MUST be ' +
      'acceptable.',
    emptyStringExists:
      'An empty string indicates that the property MUST exist, but any ' +
      'value is acceptable.',
    emptyMapExists:
      'An empty map indicates that the property MUST exist, but any value ' +
      'is acceptable.',
    emptyListExists:
      'An empty list indicates that the property MUST exist, but any value ' +
      'is acceptable.',
    listElementMap:
      'If actualValue is a list, then at least one element MUST be a map ' +
      'for which the property-matching algorithm returns true.',
    listElementMatch:
      'At least one element in the expected list MUST match at least one ' +
      'element in the actual values.',
    primitiveMatch:
      'At least one element in the actual values MUST satisfy strict ' +
      'equality or numeric coercion against the expected primitive.',
    noPartialNumericCoercion:
      'Strings that contain non-numeric characters MUST NOT be coerced.',
    selectiveDisclosureAlgorithm:
      'A conforming implementation that converts a QueryByExample example ' +
      'for selective disclosure MUST produce the same output as this ' +
      'algorithm.',
    queryByExample:
      'To signal that selective disclosure cryptosuites are acceptable, ' +
      'verifiers SHOULD include cryptosuites such as bbs-2023 or ' +
      'ecdsa-sd-2023 in the acceptedCryptosuites array.',
    didAuthenticationQuery:
      'A DID Authentication query MUST be of the following form.',
    didAuthenticationQueryTypeRequired:
      'The type of a DID Authentication query is a REQUIRED string value.',
    didAuthenticationQueryType:
      'The type of a DID Authentication query MUST be set to ' +
      'DIDAuthentication.',
    didAuthenticationMethod:
      'Each object in the array MUST contain a property called method with a ' +
      'value that is a DID Method name, and MAY contain other properties that ' +
      'are specific to the DID Method.',
    didAuthenticationCryptosuiteChoice:
      'An optional array of objects that conveys the cryptography suites ' +
      'among which the holder MUST choose when generating a cryptographic ' +
      'proof to be submitted to this verifier.',
    didAuthenticationCryptosuite:
      'Each object in the array MUST contain a property called cryptosuite ' +
      'with a value that is a Data Integrity cryptosuite name (or ' +
      'Ed25519Signature2020 for legacy), and MAY contain other properties ' +
      'that are specific to the cryptosuite.',
    didAuthenticationResponse:
      'A DID Authentication response MUST be a verifiable presentation ' +
      'of the following form.',
    didAuthenticationResponseTypeRequired:
      'The type of a DID Authentication response is a REQUIRED string value.',
    didAuthenticationResponseType:
      'The type of a DID Authentication response MUST be set to ' +
      'VerifiablePresentation.',
    didAuthenticationHolderRequired:
      'The holder of a DID Authentication response is a REQUIRED string ' +
      'value.',
    didAuthenticationHolder:
      'A REQUIRED string value that MUST be set to a specific DID that is of ' +
      'the type that was requested in the DID Authentication query.',
    didAuthenticationProofRequired:
      'The proof of a DID Authentication response is a REQUIRED value.',
    didAuthenticationProof:
      'A REQUIRED value that MUST be one or more specific digital proof types ' +
      'that were requested in the DID Authentication query.',
    didAuthenticationProofChallenge:
      'Each proof object MUST include the domain and challenge values ' +
      'that were provided in the DID Authentication query.',
    didAuthenticationDomain:
      'Holder implementations MUST ensure that the domain specified by ' +
      'the verifier matches the domain used for the current channel of ' +
      'communication.'
  },
  workflows: {
    issueRequestVariables:
      'An issue request object MAY also include a variables property to ' +
      'provide values to be used when evaluating the credential template.',
    issueRequestResult:
      'An issue request object MAY include an optional result property whose ' +
      'value MUST be either the name of a top-level variable in the ' +
      'exchange\'s variables object or a JSON pointer to any variable within ' +
      'the exchange\'s variables object, identifying where the result of the ' +
      'issue request is to be stored.',
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
    referenceIdEcho:
      'If the client receives a `referenceId`, it SHOULD include the same ' +
      '`referenceId` in its next message to the server.',
    referenceIdServerMay:
      'A server MAY include a `referenceId` property in an exchange message.',
    referenceIdUrnUuid:
      'The value of referenceId SHOULD be a urn:uuid value.'
  },
  interactions: {
    interactionUrl:
      'The format of the interaction URL MUST conform to the syntax for the ' +
      'URL Standard and contain an iuv query parameter encoding the ' +
      'interaction URL version number, which MUST be 1 when using this ' +
      'version of this API.',
    interactionUrlVersion:
      'which MUST be 1 when using this version of this API.',
    digitalCredentialsRequest:
      'To make a digital-credentials request backed by the VCALM protocol, ' +
      'the coordinator MUST provide the interaction URL as the request data.',
    digitalCredentialsFetch:
      'The browser MUST fetch the interaction URL, retrieve the supported ' +
      'protocols, and perform an HTTP GET on the vcapi URL concatenated ' +
      'with /request.',
    interactionHttps:
      'The interaction URL SHOULD be an HTTPS URL that contains an ' +
      'interaction-specific identifier.',
    interactionOpaque:
      'The URL SHOULD be opaque and require no URL syntax processing before ' +
      'it is fetched by the receiving system.',
    interactionNoExtraQuery:
      'Implementers SHOULD NOT put information that can be expressed in the ' +
      'response to a GET request for an interaction URL, defined in Section ' +
      '3.7.4 Interaction Protocols Response, into the query parameters of the ' +
      'interaction URL.',
    qrCode:
      'An interaction QR Code MUST be an interaction URL expressed as a QR ' +
      'code according to ISO18004:2024: QR Code Bar Code Symbology ' +
      'Specification.',
    qrCodeMaxLength:
      'To ensure broad interoperability, the length of the interaction URL ' +
      'SHOULD be as short as possible, SHOULD NOT exceed 400 alphanumeric ' +
      'characters, and MUST NOT exceed 4,296 alphanumeric characters.',
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
      'understands how to process interaction URLs.'
  },
  errorHandling: {
    problemDetailsTypePresent:
      'The type key MUST be present and its value MUST be a URL identifying ' +
      'the type of problem.',
    problemDetailsType:
      'its value MUST be a URL identifying the type of problem.',
    problemDetailsReadable:
      'The title key SHOULD provide a short but specific human-readable ' +
      'string for the problem.',
    verifiedFalse:
      'If an error is included, the verified property of the ' +
      'VerificationResponse object MUST be set to false.',
    verifiedTrue:
      'if no errors are included, it MUST be set to true.'
  },
};
