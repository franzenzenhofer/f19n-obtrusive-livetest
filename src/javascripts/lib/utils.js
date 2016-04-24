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
