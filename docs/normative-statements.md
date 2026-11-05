# VCALM — Normative statements

**Source:** https://www.w3.org/TR/vcalm-1.0/
**Method:** BeautifulSoup `select(".rfc2119")` on the published TR.
**Count:** 74 statements (8 RFC 2119 boilerplate hits omitted below)

## Keyword summary

| Keyword | Count |
|---------|------:|
| MUST NOT | 2 |
| MUST | 27 |
| SHOULD NOT | 2 |
| SHOULD | 10 |
| REQUIRED | 6 |
| RECOMMENDED | 1 |
| MAY | 18 |
| OPTIONAL | 8 |

## Statements

### 1.3 Conformance

1. **[MUST]** A conforming issuer service implementation MUST provide the interface described in Section 3.2.1 Issue Credential . Other interfaces described in Section 3.2 Issuing MAY also be provided.
2. **[MAY]** A conforming issuer service implementation MUST provide the interface described in Section 3.2.1 Issue Credential . Other interfaces described in Section 3.2 Issuing MAY also be provided.
3. **[MUST]** A conforming verifier service implementation MUST provide the interface described in Section 3.3.1 Verify Credential and Section 3.3.2 Verify Presentation . Other interfaces described in Section 3.3 Verifying MAY also be provided.
4. **[MAY]** A conforming verifier service implementation MUST provide the interface described in Section 3.3.1 Verify Credential and Section 3.3.2 Verify Presentation . Other interfaces described in Section 3.3 Verifying MAY also be provided.
5. **[MUST]** A conforming holder service implementation MUST provide the interface described in Section 3.6.4 Get Exchange Protocols and Section 3.6.5 Participate in an Exchange . Conformance to protocols, query languages, and data formats described in Section 3.7 Initiating Interactions , Section 3.4 Requesting a Presentation , Section 3.5.2 Create Presentation , Section 3.5 Presenting , and Section 3.6 Workflows and Exchanges MAY also be provided.
6. **[MAY]** A conforming holder service implementation MUST provide the interface described in Section 3.6.4 Get Exchange Protocols and Section 3.6.5 Participate in an Exchange . Conformance to protocols, query languages, and data formats described in Section 3.7 Initiating Interactions , Section 3.4 Requesting a Presentation , Section 3.5.2 Create Presentation , Section 3.5 Presenting , and Section 3.6 Workflows and Exchanges MAY also be provided.
7. **[MUST]** A conforming status service implementation MUST provide the interface described in Section C.3 Update Status .
8. **[MUST]** A conforming workflow service implementation MUST provide all interfaces Section 3.6 Workflows and Exchanges .
9. **[MUST]** A conforming service client implementation MUST provide the means to communicate with all REQUIRED interfaces provided by the corresponding service implementation. That is, a status client implementation provides means to communicate with all mandatory interfaces exposed by a status service implementation .
10. **[REQUIRED]** A conforming service client implementation MUST provide the means to communicate with all REQUIRED interfaces provided by the corresponding service implementation. That is, a status client implementation provides means to communicate with all mandatory interfaces exposed by a status service implementation .
11. **[MAY]** All implementations MAY provide functionality beyond this specification.

### Base URL

1. **[MAY]** There are no restrictions put on the base URL for any particular instance . The URL paths used throughout this specification are shown as absolute paths and their base URL MAY be the host name of the server (e.g., website.example ), a subdomain (e.g., api.website.example , or a path within that domain (e.g., website.example/api ).

### Forbidden Authorization

1. **[MUST NOT]** Requests to this API MUST NOT utilize any authorization protocol that includes long-lived static credentials such as usernames and passwords or similar values in those requests. An example of such a forbidden protocol is HTTP Basic Authentication [ RFC7617 ].

### Options

1. **[OPTIONAL]** Some of the endpoints defined in the following sections accept an options object. All properties of the options object are OPTIONAL when configuring each instance, as these properties are intended to meet per-deployment needs that might vary. Thus, any given instance configuration MAY prohibit client use of some options properties in order to prevent clients from passing certain data to that instance. Likewise, an instance configuration MAY require that clients include some options properties.
2. **[MAY]** Some of the endpoints defined in the following sections accept an options object. All properties of the options object are OPTIONAL when configuring each instance, as these properties are intended to meet per-deployment needs that might vary. Thus, any given instance configuration MAY prohibit client use of some options properties in order to prevent clients from passing certain data to that instance. Likewise, an instance configuration MAY require that clients include some options properties.
3. **[MAY]** Implementations MAY extend an options object with additional properties.
4. **[MUST]** Implementations MUST throw an error if an endpoint receives data, options, or option values that it does not understand or know how to process.

### Content Serialization

1. **[MUST]** All entity bodies in requests and responses sent to or received from the API endpoints defined by this specification MUST be serialized as JSON and include the Content-Type header with a media type value of application/json .

### Payload Sizes

1. **[RECOMMENDED]** A default maximum size of 10MB per verifiable credential is RECOMMENDED as an interoperability baseline, with the possibility of configuring a larger size if required. This also accommodates the 16MB size limit of most document-based database storage solutions.

### 3.2.1 Issue Credential

1. **[MUST]** If a use case requires an issuer instance to attach multiple proofs to the provided credential , the instance MUST attach all of these proofs in response to a single call to the /credentials/issue endpoint.
2. **[SHOULD]** If a provided credential already contains one or more proofs, the behavior is determined by the configuration of the issuer instance. An issuing instance SHOULD be configured to handle existing proofs in one of the following ways:

### 3.4.1 Verifiable Presentation Request

1. **[REQUIRED]** A REQUIRED property that specifies the information requested by the verifier . The value MUST be one or more maps where each map MUST define a type property with an associated string value.
2. **[MUST]** A REQUIRED property that specifies the information requested by the verifier . The value MUST be one or more maps where each map MUST define a type property with an associated string value.
3. **[OPTIONAL]** An OPTIONAL string that a verifier provides to a holder during a presentation request . The holder checks to ensure that the data is associated with the domain, such as a website domain, that they are interacting with, and if it is, includes the data in a verifiable presentation . A domain is used to ensure that the holder limits their verifiable presentation to a specific verifier , protecting the verifier against replay attacks .
4. **[OPTIONAL]** An OPTIONAL , unique string that is provided by a verifier to a holder during a specific presentation request . The holder includes this data in a verifiable presentation to the verifier , protecting the verifier against replay attacks .

### 3.4.2 Query By Example

1. **[OPTIONAL]** An OPTIONAL string that provides a human-readable explanation for why the credential is being requested. This MAY be displayed to the holder by their software.
2. **[MAY]** An OPTIONAL string that provides a human-readable explanation for why the credential is being requested. This MAY be displayed to the holder by their software.
3. **[OPTIONAL]** An OPTIONAL object that provides an example of the credential being requested, including its @context , type , and optionally credentialSubject fields to indicate which claims are needed.
4. **[OPTIONAL]** An OPTIONAL array of items, or lists that contain items, that identify entities that the verifier recognizes and accepts as issuers of the verifiable credential . Each item MUST be either 1) a [ URL ] that identifies an issuer in the issuer property of the received verifiable credential , or 2) an object that contains an id property whose value is a [ URL ] that identifies an issuer in the issuer property of the received verifiable credential , or 3) an object that contains a recognizedIn property that is associated with an object with a type property that is set to RecognizedEntityCredential and an id property with a [ URL ] value that points to such a credential as defined in the Recognized Entities v1.0 specification; the list contains recognized issuers that are acceptable to the verifier . Valid example values include: did:web:red-issuer.example https://blue-issuer.example/ {"id": "did:web:green-issuer.example"} {"recognizedIn": {"id": "https://url.example/list.vc", "type": "RecognizedEntityCredential"}}
5. **[MUST]** An OPTIONAL array of items, or lists that contain items, that identify entities that the verifier recognizes and accepts as issuers of the verifiable credential . Each item MUST be either 1) a [ URL ] that identifies an issuer in the issuer property of the received verifiable credential , or 2) an object that contains an id property whose value is a [ URL ] that identifies an issuer in the issuer property of the received verifiable credential , or 3) an object that contains a recognizedIn property that is associated with an object with a type property that is set to RecognizedEntityCredential and an id property with a [ URL ] value that points to such a credential as defined in the Recognized Entities v1.0 specification; the list contains recognized issuers that are acceptable to the verifier . Valid example values include: did:web:red-issuer.example https://blue-issuer.example/ {"id": "did:web:green-issuer.example"} {"recognizedIn": {"id": "https://url.example/list.vc", "type": "RecognizedEntityCredential"}}
6. **[OPTIONAL]** An OPTIONAL array specifying which cryptographic proof suites the verifier will accept. Each element SHOULD be an object with a cryptosuite property referencing a Data Integrity cryptosuite name or Ed25519Signature2020 for legacy (for backwards compatibility, string values MAY also be used and are to be interpreted as the cryptosuite name). This enables the holder to select an appropriate proof format. This property MAY be used independently of acceptedEnvelopes , which is only applicable to enveloped credentials. Valid example values include: [{"cryptosuite": "eddsa-rdfc-2022"}, {"cryptosuite": "ecdsa-rdfc-2019"}] [{"cryptosuite": "bbs-2023"}, {"cryptosuite": "ecdsa-sd-2023"}]
7. **[SHOULD]** An OPTIONAL array specifying which cryptographic proof suites the verifier will accept. Each element SHOULD be an object with a cryptosuite property referencing a Data Integrity cryptosuite name or Ed25519Signature2020 for legacy (for backwards compatibility, string values MAY also be used and are to be interpreted as the cryptosuite name). This enables the holder to select an appropriate proof format. This property MAY be used independently of acceptedEnvelopes , which is only applicable to enveloped credentials. Valid example values include: [{"cryptosuite": "eddsa-rdfc-2022"}, {"cryptosuite": "ecdsa-rdfc-2019"}] [{"cryptosuite": "bbs-2023"}, {"cryptosuite": "ecdsa-sd-2023"}]
8. **[MAY]** An OPTIONAL array specifying which cryptographic proof suites the verifier will accept. Each element SHOULD be an object with a cryptosuite property referencing a Data Integrity cryptosuite name or Ed25519Signature2020 for legacy (for backwards compatibility, string values MAY also be used and are to be interpreted as the cryptosuite name). This enables the holder to select an appropriate proof format. This property MAY be used independently of acceptedEnvelopes , which is only applicable to enveloped credentials. Valid example values include: [{"cryptosuite": "eddsa-rdfc-2022"}, {"cryptosuite": "ecdsa-rdfc-2019"}] [{"cryptosuite": "bbs-2023"}, {"cryptosuite": "ecdsa-sd-2023"}]
9. **[OPTIONAL]** An OPTIONAL array specifying which envelope formats the verifier will accept. Each element SHOULD be an object with a mediaType property referencing the media type for the envelope (for backwards compatibility, string values MAY also be used and are to be interpreted as the media type). This enables the holder to provide credentials in formats other than the default Data Integrity format. This property MAY be used independently of acceptedCryptosuites , which is only applicable to JSON-LD credentials signed with an acceptable cryptosuite. Valid example values include: [{"mediaType": "application/jwt"}] [{"mediaType": "application/vc+sd-jwt"}]
10. **[SHOULD]** An OPTIONAL array specifying which envelope formats the verifier will accept. Each element SHOULD be an object with a mediaType property referencing the media type for the envelope (for backwards compatibility, string values MAY also be used and are to be interpreted as the media type). This enables the holder to provide credentials in formats other than the default Data Integrity format. This property MAY be used independently of acceptedCryptosuites , which is only applicable to JSON-LD credentials signed with an acceptable cryptosuite. Valid example values include: [{"mediaType": "application/jwt"}] [{"mediaType": "application/vc+sd-jwt"}]
11. **[MAY]** An OPTIONAL array specifying which envelope formats the verifier will accept. Each element SHOULD be an object with a mediaType property referencing the media type for the envelope (for backwards compatibility, string values MAY also be used and are to be interpreted as the media type). This enables the holder to provide credentials in formats other than the default Data Integrity format. This property MAY be used independently of acceptedCryptosuites , which is only applicable to JSON-LD credentials signed with an acceptable cryptosuite. Valid example values include: [{"mediaType": "application/jwt"}] [{"mediaType": "application/vc+sd-jwt"}]
12. **[SHOULD]** Any field included in a Query By Example is a required field. This means that when using a Query By Example to enable selective disclosure, a requester needs to be mindful not to include fields in their query that are not needed for their use case. Query By Example provides no way to indicate an "optional" field; consequently, it is up to the wallet that is responding to the query to ensure that its response does not reveal any information beyond what is being requested. Note: Some securing mechanisms for verifiable credentials do not permit selective disclosure; in these cases, unrequested information might have to be sent in order to send the requested information. Digital wallets are expected to inform users about what information will be shared. To request a field without any statement about an expected value, a requester can include the field in the request and leave the value as an empty string. For instance, if a requester needs a first name, they could include the optional " credentialSubject " object with a single field, "firstName": "" . This would allow a wallet to respond with only the firstName of the requested credential with no expectation of any other field being included. _This does not prevent a wallet from oversharing by including additional fields in its response to the query._ To signal that selective disclosure cryptosuites are acceptable, verifiers SHOULD include cryptosuites such as bbs-2023 or ecdsa-sd-2023 in the acceptedCryptosuites array.

### 3.4.3.1 The DID Authentication Query Format

1. **[MUST]** The DID Authentication query format enables a verifier to request that a holder authenticate in specific ways. A DID Authentication query MUST be of the following form:
2. **[REQUIRED]** A REQUIRED string value that MUST be set to DIDAuthentication .
3. **[MUST]** A REQUIRED string value that MUST be set to DIDAuthentication .
4. **[MUST]** An optional array of objects expressing that the verifier would accept any DID Method listed. Each object in the array MUST contain a property called method with a value that is a DID Method name, and MAY contain other properties that are specific to the DID Method. Valid example values include: [{"method": "key"}] [{"method": "key"}, {"method": "web"}]
5. **[MAY]** An optional array of objects expressing that the verifier would accept any DID Method listed. Each object in the array MUST contain a property called method with a value that is a DID Method name, and MAY contain other properties that are specific to the DID Method. Valid example values include: [{"method": "key"}] [{"method": "key"}, {"method": "web"}]
6. **[MUST]** An optional array of objects that conveys the cryptography suites among which the holder MUST choose when generating a cryptographic proof to be submitted to this verifier . Each object in the array MUST contain a property called cryptosuite with a value that is a Data Integrity cryptosuite name (or Ed25519Signature2020 for legacy), and MAY contain other properties that are specific to the cryptosuite. Valid example values include: [{"cryptosuite": "eddsa-rdfc-2022"}] [{"cryptosuite": "ecdsa-rdfc-2019"}, {"cryptosuite": "bbs-2023"}]
7. **[MAY]** An optional array of objects that conveys the cryptography suites among which the holder MUST choose when generating a cryptographic proof to be submitted to this verifier . Each object in the array MUST contain a property called cryptosuite with a value that is a Data Integrity cryptosuite name (or Ed25519Signature2020 for legacy), and MAY contain other properties that are specific to the cryptosuite. Valid example values include: [{"cryptosuite": "eddsa-rdfc-2022"}] [{"cryptosuite": "ecdsa-rdfc-2019"}, {"cryptosuite": "bbs-2023"}]

### 3.4.3.2 The DID Authentication Response Format

1. **[MUST]** The DID Authentication response format enables a holder to provide the information requested by the verifier . A DID Authentication response MUST be a verifiable presentation of the following form:
2. **[REQUIRED]** A REQUIRED string value that MUST be set to VerifiablePresentation .
3. **[MUST]** A REQUIRED string value that MUST be set to VerifiablePresentation .
4. **[REQUIRED]** A REQUIRED string value that MUST be set to a specific DID that is of the type that was requested in the DID Authentication query.
5. **[MUST]** A REQUIRED string value that MUST be set to a specific DID that is of the type that was requested in the DID Authentication query.
6. **[REQUIRED]** A REQUIRED value that MUST be one or more specific digital proof types that were requested in the DID Authentication query. Each proof object MUST include the domain and challenge values that were provided in the DID Authentication query. Holder implementations MUST ensure that the domain specified by the verifier matches the domain used for the current channel of communication.
7. **[MUST]** A REQUIRED value that MUST be one or more specific digital proof types that were requested in the DID Authentication query. Each proof object MUST include the domain and challenge values that were provided in the DID Authentication query. Holder implementations MUST ensure that the domain specified by the verifier matches the domain used for the current channel of communication.

### 3.6 Workflows and Exchanges

1. **[MAY]** referenceId : An optional identifier to correlate exchange messages. A server MAY include this value; if present, the client SHOULD include it in its next message. The value SHOULD be a urn:uuid value.
2. **[SHOULD]** referenceId : An optional identifier to correlate exchange messages. A server MAY include this value; if present, the client SHOULD include it in its next message. The value SHOULD be a urn:uuid value.

### 3.6.1 Create Workflow

1. **[MAY]** A step that includes an issueRequests array containing one or more issue request objects. Each issue request object identifies a credential template to use, either by its identifier ( credentialTemplateId ) or by its index ( credentialTemplateIndex ) in the workflow's credentialTemplates array. An issue request object MAY also include a variables property to provide values to be used when evaluating the credential template. By default, the result of each issue request is included in the verifiable presentation that is sent to the exchange client in the same step. An issue request object MAY include an optional result property whose value MUST be either the name of a top-level variable in the exchange's variables object or a JSON pointer to any variable within the exchange's variables object, identifying where the result of the issue request is to be stored. This enables greater composition, as subsequent steps can reference the stored result, or the exchange can end and a party with access to the exchange state can obtain the result for use in another exchange or via some other mechanism.
2. **[MUST]** A step that includes an issueRequests array containing one or more issue request objects. Each issue request object identifies a credential template to use, either by its identifier ( credentialTemplateId ) or by its index ( credentialTemplateIndex ) in the workflow's credentialTemplates array. An issue request object MAY also include a variables property to provide values to be used when evaluating the credential template. By default, the result of each issue request is included in the verifiable presentation that is sent to the exchange client in the same step. An issue request object MAY include an optional result property whose value MUST be either the name of a top-level variable in the exchange's variables object or a JSON pointer to any variable within the exchange's variables object, identifying where the result of the issue request is to be stored. This enables greater composition, as subsequent steps can reference the stored result, or the exchange can end and a party with access to the exchange state can obtain the result for use in another exchange or via some other mechanism.
3. **[MAY]** A step MAY include a verifiablePresentation to explicitly express one or more verifiable presentation s to be used in that step. This presentation could be composed via other variables in an exchange and could be augmented with any additional verifiable credentials that might be issued during the step (per issueRequests ). This supports use cases where specific verifiable presentation versions are required, specific sub-types of verifiable presentations are required, or specific verifiable presentation contents are required, including previously out-of-band issued verifiable credentials that are to be delivered in the workflow step.
4. **[MAY]** A step MAY include a redirectUrl to specify a URL to send to the client that can be used to continue an interaction at another location. One use case for this is to send the user of an exchange client back to a coordinator website after an exchange has completed. Another use case is to return an interaction URL that allows a server to implement custom business rules during a continuing interaction without requiring the client to navigate to a web browser. For example, a first exchange could request information from a user and then return an interaction URL via redirectUrl . The client (e.g., a digital wallet) can determine that it is an interaction URL (e.g., the URL uses ?iuv=1 ) and fetch it, causing the interaction server to run custom business logic and then return a protocol object with another exchange to continue the interaction.

### 3.6.5 Participate in an Exchange

1. **[MAY]** A server MAY include a referenceId property in an exchange message. If the client receives a referenceId , it SHOULD include the same referenceId in its next message to the server. This aids in debugging and ensures that potentially delayed or misordered messages are linked to the correct request. The value of referenceId SHOULD be a urn:uuid value.
2. **[SHOULD]** A server MAY include a referenceId property in an exchange message. If the client receives a referenceId , it SHOULD include the same referenceId in its next message to the server. This aids in debugging and ensures that potentially delayed or misordered messages are linked to the correct request. The value of referenceId SHOULD be a urn:uuid value.

### 3.6.8 Exchange Examples

1. **[MAY]** The holder coordinator MAY call the Coordinator's exchange discovery endpoint to determine if the holder coordinator supports the Coordinator's protocol requirements on a particular endpoint, before actually initiating the exchange.

### 3.7.1 Interaction URL Format

1. **[MUST]** The format of the interaction URL MUST conform to the syntax for the URL Standard and contain an iuv query parameter encoding the interaction URL version number, which MUST be 1 when using this version of this API. The interaction URL SHOULD be an HTTPS URL that contains an interaction-specific identifier. The URL SHOULD be opaque and require no URL syntax processing before it is fetched by the receiving system. An example of such a URL is shown below:
2. **[SHOULD]** The format of the interaction URL MUST conform to the syntax for the URL Standard and contain an iuv query parameter encoding the interaction URL version number, which MUST be 1 when using this version of this API. The interaction URL SHOULD be an HTTPS URL that contains an interaction-specific identifier. The URL SHOULD be opaque and require no URL syntax processing before it is fetched by the receiving system. An example of such a URL is shown below:
3. **[SHOULD NOT]** Protocols that encode lengthy protocol-specific information into URLs suffer from limitations placed by software libraries on the maximum allowable length of a URL. At the time of writing, the suggested URL length limit is roughly 2,000 characters. Implementers SHOULD NOT put information that can be expressed in the response to a GET request for an interaction URL, defined in Section 3.7.4 Interaction Protocols Response , into the query parameters of the interaction URL.

### 3.7.2 Interaction QR Code Format

1. **[MUST]** An interaction QR Code MUST be an interaction URL expressed as a QR code according to ISO18004:2024: QR Code Bar Code Symbology Specification . To ensure broad interoperability, the length of the interaction URL SHOULD be as short as possible, SHOULD NOT exceed 400 alphanumeric characters, and MUST NOT exceed 4,296 alphanumeric characters. An example of an interaction QR code can be found below:
2. **[SHOULD]** An interaction QR Code MUST be an interaction URL expressed as a QR code according to ISO18004:2024: QR Code Bar Code Symbology Specification . To ensure broad interoperability, the length of the interaction URL SHOULD be as short as possible, SHOULD NOT exceed 400 alphanumeric characters, and MUST NOT exceed 4,296 alphanumeric characters. An example of an interaction QR code can be found below:
3. **[SHOULD NOT]** An interaction QR Code MUST be an interaction URL expressed as a QR code according to ISO18004:2024: QR Code Bar Code Symbology Specification . To ensure broad interoperability, the length of the interaction URL SHOULD be as short as possible, SHOULD NOT exceed 400 alphanumeric characters, and MUST NOT exceed 4,296 alphanumeric characters. An example of an interaction QR code can be found below:
4. **[MUST NOT]** An interaction QR Code MUST be an interaction URL expressed as a QR code according to ISO18004:2024: QR Code Bar Code Symbology Specification . To ensure broad interoperability, the length of the interaction URL SHOULD be as short as possible, SHOULD NOT exceed 400 alphanumeric characters, and MUST NOT exceed 4,296 alphanumeric characters. An example of an interaction QR code can be found below:

### 3.7.3 Interaction Scheme Format

1. **[MUST]** It can be useful to invoke an application that is capable of processing an interaction URL . This section defines an interaction: protocol scheme format for this purpose. The format of the protocol scheme MUST conform to the following syntax:

### 3.7.4 Interaction Protocols Response

1. **[MUST]** When the interaction URL is fetched using an Accept header of application/json , a single JSON object containing a protocols map MUST be returned where each key is a protocol identifier and each value is a URL that can be used to initiate the interaction. For example, performing an HTTP GET on the https://app.example/interactions/z8n38Dp7a?iuv=1 interaction URL might result in either of the following responses:
2. **[MUST]** When the interaction URL is fetched using any unrecognized Accept header, a text/html document MUST be returned with directions instructing a human being to use specific software that understands how to process interaction URLs.

### 3.8 Error Handling

1. **[MUST]** The type key MUST be present and its value MUST be a URL identifying the type of problem.
2. **[SHOULD]** The title key SHOULD provide a short but specific human-readable string for the problem.
3. **[SHOULD]** The detail key SHOULD provide a longer human-readable string for the problem.

### 3.8.1 Verification Errors vs. Warnings

1. **[MUST]** If an error is included, the verified property of the VerificationResponse object MUST be set to false ; if no errors are included, it MUST be set to true .
