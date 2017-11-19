/* global window */

import EventCollection from './utils/EventCollection';
import { interpolateConfiguration } from './utils/configurableRules';
import * as RuleContext from './utils/RuleContext';

const runRule = (name, rule, configuration, events, callback, ruleContextGlobals) => {
  try {

    //
    function soThatThisWorksForArrowRules(){
      const configuredRule = interpolateConfiguration(rule, configuration || {});
      const ruleFunc = eval(`(${configuredRule})`);
      RuleContext.setGlobals(ruleContextGlobals);
      ruleFunc.apply(RuleContext, [events, callback]);
    };
    soThatThisWorksForArrowRules.apply(RuleContext);

  } catch (e) {
    callback(RuleContext.createResult('ERROR', `${e} in <b>${name}</b>`, 'warning'));
  }
};

window.addEventListener('message', (event) => {
  const { command, body, args, runId, name, configuration, ruleContextGlobals } = event.data;

  const postReturn = (result = {}) => {
    const resultWithRunIdAndAction = Object.assign(result, { runId, name, command: 'ruleResult' });
    event.source.postMessage(resultWithRunIdAndAction, event.origin);
  };

  if (command === 'runRule') {
    runRule(name, body, configuration, new EventCollection(args), postReturn, ruleContextGlobals);
  }
});
