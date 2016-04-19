import { normalizeHeaders } from './lib/utils';

import {
  xRobotsTag,
  contentEncodingNotGzip,
  statusCodeNot200,
  documentSize,
} from './rules/header';

import {
  hasCanonicalTags,
} from './rules/html';

import {
  outgoingNofollowLinks,
} from './rules/dom';


const headerRules = [
  xRobotsTag,
  contentEncodingNotGzip,
  statusCodeNot200,
  documentSize,
];

const HTMLRules = [
  hasCanonicalTags,
];

const DOMRules = [
  outgoingNofollowLinks,
];


chrome.webRequest.onHeadersReceived.addListener((data) => {
  data['responseHeaders'] = normalizeHeaders(data.responseHeaders);
  const rulesResult = headerRules.map(rule => rule(data));
  console.log(rulesResult);
}, { urls: ["<all_urls>"], types: ["main_frame"] }, ["responseHeaders"]);


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.event === 'document_end') {
      const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
      const rulesResult = HTMLRules.map(rule => rule(data));
    }
    if (request.event === 'document_idle') {
      const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
      const rulesResult = DOMRules.map(rule => rule(data));
    }
  }
);
