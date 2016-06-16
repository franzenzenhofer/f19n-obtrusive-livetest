import EventCollection from './utils/EventCollection';
import sampleEvents from './constants/sampleEvents';

import * as RuleContext from './utils/RuleContext';

const runRule = (name, rule, events) => {
  let ruleResult = null;
  const ruleFunc = eval(`(${rule})`);
  try {
    ruleResult = ruleFunc.apply(RuleContext, [events]);
  } catch (e) {
    ruleResult = { label: 'ERROR', message: `<b>${e.name}</b>: ${e.message} @<b>${name}</b>`, type: 'warning' };
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
  const { command, body, args, runId, name } = event.data;
  if (command === 'validateRule') {
    let result = validateRule(body);
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
  if (command === 'runRule') {
    let result = runRule(name, body, new EventCollection(args));
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
});
