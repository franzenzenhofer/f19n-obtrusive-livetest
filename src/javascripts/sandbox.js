import EventCollection from './lib/EventCollection';
import sampleEvents from './constants/sampleEvents';

import * as RuleContext from './lib/RuleContext';

const runRule = (rule, events) => {
  const ruleFunc = eval(`(${rule})`);
  return ruleFunc.apply(RuleContext, [events]);
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
      const sampleResult = ruleFunc(new EventCollection(sampleEvents));
      if (sampleResult === null || (sampleResult.label && sampleResult.message && sampleResult.type && sampleResult.priority)) {
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
  const { command, body, args, runId } = event.data;
  if (command === 'validateRule') {
    let result = validateRule(body);
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
  if (command === 'runRule') {
    let result = runRule(body, new EventCollection(args));
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
});
