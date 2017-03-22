import EventCollection from './utils/EventCollection';
import sampleEvents from './constants/sampleEvents';

import * as RuleContext from './utils/RuleContext';

const interpolateConfiguration = (rule, configuration) => {
  return rule.replace(/%([^%]+%)/g, (key) => {
    return configuration[key.replace(/%/g, '')] || key;
  });
};

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

const validateRule = (rule) => {
  let result = null;
  let ruleFunc = null;
  try {
    ruleFunc = eval(`(${rule})`);
    result = { valid: true };
  } catch (e) {
    const { message, stack, lineNumber, name } = e;
    result = { valid: false, error: { name, message, stack, lineNumber } };
  }

  if (ruleFunc) {
    try {
      const sampleResult = ruleFunc.apply(RuleContext, [new EventCollection(sampleEvents)]);
      if (sampleResult === null || (sampleResult.label && sampleResult.message && sampleResult.type)) {
        result.result = sampleResult;
      } else {
        result.valid = false;
        result.error = { name: 'Invalid return value', message: `Result needs to contain at least label, message and type. Result was: ${JSON.stringify(sampleResult)}` };
      }
    } catch (e) {
      const { message, stack, lineNumber, name } = e;
      result = { valid: false, error: { name, message, stack, lineNumber } };
    }
  }

  return result;
};

window.addEventListener('message', (event) => {
  const { command, body, args, runId, name, configuration } = event.data;

  console.log(event.data);

  var postReturn = function(result){
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }

  if (command === 'validateRule') {
    let result = validateRule(body);
    //result = Object.assign(result || {}, { runId });
    //event.source.postMessage(result, event.origin);
    postReturn(result);
  }

  if (command === 'runRule') {
    let result = runRule(name, body, configuration, new EventCollection(args), postReturn);
    //result = Object.assign(result || {}, { runId });
    //event.source.postMessage(result, event.origin);
    //if(result !== 'async'){
      postReturn(result);
    //}
  }
});
