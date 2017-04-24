/* global window */

import EventCollection from './utils/EventCollection';
import { interpolateConfiguration } from './utils/configurableRules';
import * as RuleContext from './utils/RuleContext';

const runRule = (name, rule, configuration, events, callback) => {
  let ruleResult = null;
  const configuredRule = interpolateConfiguration(rule, configuration || {});
  const ruleFunc = eval(`(${configuredRule})`);
  ruleResult = ruleFunc.apply(RuleContext, [events, callback]);
  return ruleResult;
};

window.addEventListener('message', (event) => {
  const { command, body, args, runId, name, configuration } = event.data;

  const postReturn = (result = {}) => {
    const resultWithRunIdAndAction = Object.assign(result, { runId, name, command: 'ruleResult' });
    event.source.postMessage(resultWithRunIdAndAction, event.origin);
  };

  if (command === 'runRule') {
    runRule(name, body, configuration, new EventCollection(args), postReturn);
  }
});
