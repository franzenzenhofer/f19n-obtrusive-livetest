import { fromPairs } from 'lodash';
import EventCollection from './EventCollection';
import sampleEvents from '../constants/sampleEvents';

export const normalizeHeaders = (responseHeaders) => {
  const responseHeaderPairs = responseHeaders.map((responseHeader) => {
    return [responseHeader.name.toLowerCase(), responseHeader.value];
  });
  return fromPairs(responseHeaderPairs);
};


export const ruleResult = (priority, label, message, type = 'info') => {
  return {
    priority,
    label,
    message,
    type,
  };
};

export const runRule = (rule, events) => {
  const ruleFunc = eval(`(${rule})`);
  return ruleFunc(events);
};

export const validateRule = (rule) => {
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
