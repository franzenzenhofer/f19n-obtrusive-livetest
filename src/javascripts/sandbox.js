/* global window */

import EventCollection from './utils/EventCollection';

import * as RuleContext from './utils/RuleContext';

const runRule = (name, rule, events, callback) => {
  let ruleResult = null;
  try {
    const ruleFunc = eval(`(${rule})`);
    ruleResult = ruleFunc.apply(RuleContext, [events, callback]);
  } catch (e) {
    ruleResult = { label: 'Pending', message: `<b>${e.name}</b>: ${e.message} @<b>${name}</b>`, type: 'pending' };
  }
  return ruleResult;
};

window.addEventListener('message', (event) => {
  const { command, body, args, runId, name } = event.data;

  const postReturn = (result = {}) => {
    const resultWithRunId = Object.assign(result, { runId });
    event.source.postMessage(resultWithRunId, event.origin);
  };

  if (command === 'runRule') {
    const result = runRule(name, body, new EventCollection(args), postReturn);
    postReturn(result);
  }
});
