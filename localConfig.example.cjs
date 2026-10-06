// Rename to localConfig.cjs — unified gateway (A) or explicit paths (B) below.
//
// Two URL conventions (pick one per deployment):
//
// A) Unified gateway — one URL routes by path/body (e.g. credential.ninja).
//    Set every role's `endpoint` to the same BASE_URL.
//
// B) Explicit paths — each role points at the operation URL (typical ACA-Py /
//    instance-per-role setups). Set BASE_URL to the instance root and use the
//    path helpers below.
//
// BASE_URL=http://localhost:40443/my-instance npm test
const baseUrl = process.env.BASE_URL || 'https://credential.ninja';

/** Append VCALM paths when using explicit-path style (B). */
const paths = {
  issue: `${baseUrl}/credentials/issue`,
  verifyVc: `${baseUrl}/credentials/verify`,
  verifyVp: `${baseUrl}/presentations/verify`,
  createPresentation: `${baseUrl}/presentations`,
  updateStatus: `${baseUrl}/credentials/status`,
  workflows: `${baseUrl}/workflows`,
  interactions: `${baseUrl}/interactions`
};

// --- Pattern A: unified gateway (credential.ninja) ---
const endpoint = baseUrl;

// --- Pattern B: explicit paths (uncomment and comment out Pattern A) ---
// const endpoint = null; // unused
// const issuersEndpoint = paths.issue;
// const verifiersEndpoint = paths.verifyVc;
// const holdersEndpoint = paths.createPresentation;
// const workflowsEndpoint = paths.workflows;

module.exports = {
  settings: {
    // instancePayloadLimitBytes: 10485760
  },
  implementations: [{
    name: 'credential.ninja',
    implementation: 'The VC DOJO',

    // Issuer — §3.2.1 issue (required for §1.3 issuer service)
    issuers: [{
      id: 'did:web:credential.ninja',
      endpoint: endpoint /* or issuersEndpoint */,
      tags: ['VCALM']
      // options: {
      //   cryptosuite: ['eddsa-jcs-2022', 'eddsa-rdfc-2022'], // proof set
      //   // cryptosuite: 'eddsa-jcs-2022' // single proof
      // },
      // settings: { vcPayloadLimitBytes: 10485760 }
    }],

    // Verifier — §3.3.1 verify credential and §3.3.2 verify presentation
    verifiers: [{
      endpoint: endpoint /* or verifiersEndpoint */,
      tags: ['VCALM']
    }],

    // Holder — §3.5.2 create presentation (needed for 3.3.2 VP happy path)
    holders: [{
      endpoint: endpoint /* or holdersEndpoint */,
      tags: ['VCALM']
    }],

    // Workflow — optional; §3.6 and §1.3 holder checks when registered
    workflows: [{
      endpoint: endpoint /* or workflowsEndpoint */,
      tags: ['VCALM']
    }],

    // Interaction — optional; §3.7.4 GET protocols (skips if not implemented)
    interactions: [{
      endpoint: endpoint /* or paths.interactions */,
      tags: ['VCALM']
      // interactionId: 'urn:uuid:interaction-fixture',
      // interactionStart:
      //   `${baseUrl}/interactions/urn:uuid:interaction-fixture?iuv=1`
    }],

    // Status — §C.3 Update Status (required for a conforming status service)
    status: [{
      endpoint: endpoint /* or paths.updateStatus */,
      tags: ['VCALM']
    }]
  }]
};
