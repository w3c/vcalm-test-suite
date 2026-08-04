/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

/**
 * Normative VCALM text (MUST, MUST NOT, REQUIRED) for Mocha `it()` titles.
 *
 * One sentence per entry: the sentence that carries the normative keyword.
 * MAY and SHOULD are excluded. OpenAPI property-table blurbs are excluded.
 */

export const NORMATIVE = {
  conformance: {
    issuer:
      'A conforming issuer service implementation MUST provide the interface ' +
      'described in Section Issue Credential.',
    verifier:
      'A conforming verifier service implementation MUST provide the ' +
      'interface described in Section Verify Credential and Section ' +
      'Verify Presentation.',
    holder:
      'A conforming holder service implementation MUST provide the interface ' +
      'described in Section Get Exchange Protocols and Section ' +
      'Participate in an Exchange.',
    status:
      'A conforming status service implementation MUST provide the interface ' +
      'described in Section Update Status.',
    workflow:
      'A conforming workflow service implementation MUST provide all ' +
      'interfaces Section Workflows and Exchanges.',
    serviceClient:
      'A conforming service client implementation MUST provide the means ' +
      'to communicate with all REQUIRED interfaces provided by the ' +
      'corresponding service implementation.'
  },
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
      'credentials (e.g. HTTP Basic Authentication with username/password).'
  },
  issuing: {
    multipleProofs:
      'If a use case requires an issuer instance to attach multiple proofs ' +
      'to the provided `credential`, the instance MUST attach all of these ' +
      'proofs in response to a single call to the `/credentials/issue` ' +
      'endpoint.'
  },
  requestingPresentation: {
    queryRequired:
      'query is a REQUIRED property that specifies the information requested ' +
      'by the verifier.',
    queryType:
      'The value MUST be one or more maps where each map MUST define a ' +
      '`type` property with an associated string value.',
    didAuthentication:
      'A DID Authentication response MUST be a verifiable presentation of ' +
      'the following form:'
  },
  workflows: {
    issueRequestResult:
      'The `result` property value MUST be either the name of a top-level ' +
      'variable in the exchange\'s `variables` object or a JSON pointer to ' +
      'any variable within the exchange\'s `variables` object.'
  },
  interactions: {
    interactionUrl:
      'The format of the interaction URL MUST conform to the syntax for the ' +
      'URL and contain an `iuv` query parameter encoding the interaction URL ' +
      'version number, which MUST be `1` when using this version of this API.',
    qrCode:
      'An interaction QR Code MUST be an interaction URL expressed as a QR ' +
      'code according to ISO 18004.',
    qrCodeMaxLength:
      'The length of the interaction URL MUST NOT exceed 4,296 alphanumeric ' +
      'characters.',
    scheme:
      'The format of the protocol scheme MUST conform to the following syntax:',
    protocolsJson:
      'When the interaction URL is fetched using an `Accept` header of ' +
      '`application/json`, a single JSON object containing a `protocols` map ' +
      'MUST be returned where each map/key is a protocol identifier and each ' +
      'map/value is a URL that can be used to initiate the interaction.',
    protocolsHtml:
      'When the interaction URL is fetched using any unrecognized `Accept` ' +
      'header, a `text/html` document MUST be returned with directions ' +
      'instructing a human being to use specific software that understands ' +
      'how to process interaction URLs.'
  },
  errorHandling: {
    problemDetailsType:
      'The `type` map/key MUST be present and its value MUST be a URL ' +
      'identifying the type of problem.',
    verifiedFalse:
      'If an error is included, the `verified` property of the ' +
      '`VerificationResponse` object MUST be set to `false`.',
    verifiedTrue:
      'If no errors are included, the `verified` property of the ' +
      '`VerificationResponse` object MUST be set to `true`.'
  }
};
