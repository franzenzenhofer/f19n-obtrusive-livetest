/* global window */

import EventCollection from './utils/EventCollection';
import { interpolateConfiguration } from './utils/configurableRules';
import * as RuleContext from './utils/RuleContext';

const runRule = (name, rule, configuration, events, callback) => {
  let ruleResult = null;
  try {
    const configuredRule = interpolateConfiguration(rule, configuration || {});
    const ruleFunc = eval(`(${configuredRule})`);
    ruleResult = ruleFunc.apply(RuleContext, [events, callback]);
  } catch (e) {
    ruleResult = { label: 'Pending', message: `<b>${e.name}</b>: ${e.message} @<b>${name}</b>`, type: 'pending' };
  }
  return ruleResult;
};

window.addEventListener('message', (event) => {
  const { command, body, args, runId, name, configuration } = event.data;

  const postReturn = (result = {}) => {
    const resultWithRunId = Object.assign(result, { runId });
    event.source.postMessage(resultWithRunId, event.origin);
  };

  if (command === 'runRule') {
    const result = runRule(name, body, configuration, new EventCollection(args), postReturn);
    postReturn(result);
  }
});
