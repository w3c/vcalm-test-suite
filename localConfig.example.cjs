// Copy to localConfig.cjs (gitignored) and set your endpoints.
// Each endpoint is your VCALM service root; the suite adds the paths.
// Leave out the roles your service does not have: their rows are skipped.
// The README, "Configuring your implementation", describes every field.
const endpoint = 'https://vcalm.example';

module.exports = {
  implementations: [{
    name: 'My implementation',

    issuers: [{
      // Used as the issuer of the credentials the suite asks you to issue.
      id: 'did:example:issuer',
      endpoint,
      tags: ['VCALM']
      // options: {cryptosuite: 'eddsa-rdfc-2022'}
    }],

    verifiers: [{
      endpoint,
      tags: ['VCALM']
      // options: {checks: ['proof']}
    }],

    // workflows: [{
    //   endpoint,
    //   tags: ['VCALM'],
    //   options: {id: null},
    //   zcap: {capability: require('./zcap.json'), keySeed: 'KEY_SEED'},
    //   encryptionStep: {acceptedEncryption: {required: true}},
    //   interactionUrl: 'https://vcalm.example/interactions/z8n38Dp7a?iuv=1'
    // }],

    // status: [{
    //   endpoint,
    //   tags: ['VCALM'],
    //   options: {indexAllocator: 'urn:uuid:...'}
    // }]
  }]
};
