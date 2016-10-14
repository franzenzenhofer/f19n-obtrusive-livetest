import EventCollection from './utils/EventCollection';
import sampleEvents from './constants/sampleEvents';

import * as RuleContext from './utils/RuleContext';

/*console.log('in sandbox');
const asyncReturn = (ruleResult) => {
  console.log('async return');
  console.log(ruleResult);
  //let result = runRule(name, body, new EventCollection(args));
  //result = Object.assign(result || {}, { runId
}

RuleContext.asyncReturn = asyncReturn;*/

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

const validateRule = (rule, callback) => {
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
  console.log('what message');
  console.log(event);
  const { command, body, args, name } = event.data;
  var { runId } = event.data;
  var callback = function (result) {
    console.log('in callback');
    console.log(result);
    console.log(runId);
    console.log(event.origin);
    //runId = runId;
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
  if (command === 'validateRule') {
    let result = validateRule(body, callback);
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
  if (command === 'runRule') {
    let result = runRule(name, body, new EventCollection(args), callback);
    if (result !== 'async')
    {
      result = Object.assign(result || {}, { runId });
      event.source.postMessage(result, event.origin);
    }
  }
});
