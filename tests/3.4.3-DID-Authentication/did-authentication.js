/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {NORMATIVE} from '../normative-statements.js';

const {requestingPresentation: did} = NORMATIVE;
const queryLink = `${TR}#the-did-authentication-query-format`;
const responseLink = `${TR}#the-did-authentication-response-format`;

describeSkippedSection({
  section: 'DID Authentication',
  statements: [
    {statement: did.didAuthenticationQuery, link: queryLink},
    {statement: did.didAuthenticationQueryTypeRequired, link: queryLink},
    {statement: did.didAuthenticationQueryType, link: queryLink},
    {statement: did.didAuthenticationMethod, link: queryLink},
    {statement: did.didAuthenticationCryptosuiteChoice, link: queryLink},
    {statement: did.didAuthenticationCryptosuite, link: queryLink},
    {statement: did.didAuthenticationResponse, link: responseLink},
    {statement: did.didAuthenticationResponseTypeRequired, link: responseLink},
    {statement: did.didAuthenticationResponseType, link: responseLink},
    {statement: did.didAuthenticationHolderRequired, link: responseLink},
    {statement: did.didAuthenticationHolder, link: responseLink},
    {statement: did.didAuthenticationProofRequired, link: responseLink},
    {statement: did.didAuthenticationProof, link: responseLink},
    {statement: did.didAuthenticationProofChallenge, link: responseLink},
    {statement: did.didAuthenticationDomain, link: responseLink}
  ]
});
