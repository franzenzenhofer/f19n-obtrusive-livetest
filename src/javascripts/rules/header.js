import { ruleResult } from './../lib/utils';

export const xRobotsTag = (data) => {
  const { responseHeaders } = data;
  return responseHeaders['x-robots-tag'] ? result('HTTP', `X-Robots-Tag: ${responseHeaders['x-robots-tag']}`, 'warning') : null;
};

export const contentEncodingNotGzip = (data) => {
  const { responseHeaders } = data;
  const encoding = responseHeaders['content-encoding'];
  return !encoding || encoding !== 'gzip' ? ruleResult('HTTP', `Content-Encoding: ${encoding}`, 'warning') : null;
};

export const statusCodeNot200 = (data) => {
  const { statusCode } = data;
  return Number(statusCode) !== 200 ? ruleResult('HTTP', `HTTP ${statusCode}`, 'warning') : null;
};

export const documentSize = (data) => {
  const { responseHeaders } = data;
  const contentLength = responseHeaders['content-length'];
  const encoding = responseHeaders['content-encoding'];
  const contentSizeInKb = contentLength / 1024;
  return encoding === 'gzip' &&  contentSizeInKb > 14.6 ? ruleResult('SPEED', `HTML size gzip: ${contentSizeInKb}`, 'warning') : null;
};
