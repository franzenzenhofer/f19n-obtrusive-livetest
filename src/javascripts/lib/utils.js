import { fromPairs } from 'lodash';

export const normalizeHeaders = (responseHeaders) => {
  const responseHeaderPairs = responseHeaders.map((responseHeader) => {
    return [responseHeader.name.toLowerCase(), responseHeader.value];
  });
  return fromPairs(responseHeaderPairs);
};


export const ruleResult = (label, message, type = 'info') => {
  return {
    label,
    message,
    type,
  };
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
    const sampleResult = ruleFunc({ html: '<p>...</p>' });
    if (sampleResult === null || (sampleResult.label && sampleResult.message && sampleResult.type)) {
      result.result = sampleResult;
    } else {
      result.valid = false;
      result.error = { name: 'Invalid return value', message: 'Result needs to contain at least label, message and type. Result was: ' + JSON.stringify(sampleResult) };
    }
  }

  return result;
};
