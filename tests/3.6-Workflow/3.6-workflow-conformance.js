/*
 * SPDX-License-Identifier: LicenseRef-w3c-3-clause-bsd-license-2008 OR LicenseRef-w3c-test-suite-license-2023
 */

import {describeSkippedSection, TR} from '../skipped-section.js';
import {
  shouldAcceptExchangeCallback,
  shouldCreateExchange,
  shouldCreateWorkflow,
  shouldGetCurrentExchangeVpr,
  shouldGetExchangeProtocols,
  shouldGetExchangeState,
  shouldGetWorkflowConfiguration,
  shouldParticipateInExchange,
  shouldRejectMalformedWorkflowRequest
} from '../assertions.js';
import {
  WORKFLOW_EXCHANGE_NEGATIVE_CASES,
  WORKFLOW_NEGATIVE_CASES
} from '../negative-fixtures.js';
import {createWorkflowRequest} from '../mock.data.js';
import {describeNormativeStatement} from '../statement-suite.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {NORMATIVE} from '../normative-statements.js';
import {v4 as uuidv4} from 'uuid';
import {VCALM_TAG} from '../helpers.js';

const tag = VCALM_TAG;
const {match} = filterByTag({property: 'workflows', tags: [tag]});

async function createdWorkflow(endpoints) {
  const created = await endpoints.createWorkflow();
  shouldCreateWorkflow(created);
  return created;
}

async function createdExchange(endpoints) {
  const workflow = await createdWorkflow(endpoints);
  const exchange = await endpoints.createExchange(workflow.workflowId);
  shouldCreateExchange(exchange);
  return {workflow, exchange};
}

describeNormativeStatement({
  section: 'Conformance',
  statement: NORMATIVE.conformance.workflow,
  link: `${TR}#conformance`,
  match,
  columnLabel: 'Workflow',
  subtests({endpoints}) {
    return [
      {
        name: 'positive: POST /workflows creates a workflow',
        run: async () => {
          await createdWorkflow(endpoints);
        }
      },
      {
        name: 'positive: GET /workflows/{localWorkflowId} returns the ' +
          'configuration',
        run: async () => {
          const sent = createWorkflowRequest();
          const created = await endpoints.createWorkflow(sent);
          shouldCreateWorkflow(created);
          const configuration = await endpoints.getWorkflowConfiguration(
            created.workflowId
          );
          shouldGetWorkflowConfiguration({...configuration, sent});
        }
      },
      {
        name: 'positive: POST /workflows/{localWorkflowId}/exchanges ' +
          'creates an exchange',
        run: async () => {
          await createdExchange(endpoints);
        }
      },
      {
        name: 'positive: GET exchange protocols returns supported protocols',
        run: async () => {
          const {workflow, exchange} = await createdExchange(endpoints);
          const protocols = await endpoints.getExchangeProtocols(
            workflow.workflowId,
            exchange.exchangeId
          );
          shouldGetExchangeProtocols(protocols);
        }
      },
      {
        name: 'positive: GET current exchange VPR returns a presentation ' +
          'request',
        run: async () => {
          const {workflow, exchange} = await createdExchange(endpoints);
          const current = await endpoints.getCurrentExchangeVpr(
            workflow.workflowId,
            exchange.exchangeId
          );
          shouldGetCurrentExchangeVpr(current);
        }
      },
      {
        name: 'positive: POST exchange participation accepts an empty body',
        run: async () => {
          const {workflow, exchange} = await createdExchange(endpoints);
          const participated = await endpoints.participateInExchange(
            workflow.workflowId,
            exchange.exchangeId,
            {}
          );
          shouldParticipateInExchange(participated);
        }
      },
      {
        name: 'positive: GET exchange state returns the exchange',
        run: async () => {
          const {workflow, exchange} = await createdExchange(endpoints);
          const state = await endpoints.getExchangeState(
            workflow.workflowId,
            exchange.exchangeId
          );
          shouldGetExchangeState({
            ...state,
            exchangeId: exchange.exchangeId
          });
        }
      },
      {
        name: 'positive: POST /callbacks/{localCallbackId} accepts an ' +
          'exchange step callback',
        run: async () => {
          const callback = await endpoints.exchangeStepCallback(
            `urn:uuid:${uuidv4()}`
          );
          shouldAcceptExchangeCallback(callback);
        }
      },
      ...WORKFLOW_NEGATIVE_CASES.map(item => ({
        name: `negative: ${item.title}`,
        run: async () => {
          const created = await endpoints.createWorkflowWithBody(item.body);
          shouldRejectMalformedWorkflowRequest({
            result: created.result ?? created.error?.response
          });
        }
      })),
      ...WORKFLOW_EXCHANGE_NEGATIVE_CASES.map(item => ({
        name: `negative: ${item.title}`,
        run: async () => {
          const created = await endpoints.createExchange(item.workflowId);
          shouldRejectMalformedWorkflowRequest({
            result: created.result ?? created.error?.response
          });
        }
      }))
    ];
  }
});

describeSkippedSection({
  section: 'Create Workflow',
  columnLabel: 'Workflow',
  property: 'workflows',
  link: `${TR}#create-workflow`,
  statements: [NORMATIVE.workflows.issueRequestResult]
});

describeSkippedSection({
  section: 'Get Current Exchange VPR',
  columnLabel: 'Workflow',
  property: 'workflows',
  link: `${TR}#get-current-exchange-vpr`,
  statements: [
    NORMATIVE.workflows.getCurrentVpr,
    NORMATIVE.workflows.getCurrentVprEmpty
  ]
});
