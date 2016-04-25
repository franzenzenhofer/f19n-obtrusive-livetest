import { normalizeHeaders, ruleResult } from './lib/utils';

import {
  xRobotsTag,
  contentEncodingNotGzip,
  statusCodeNot200,
  documentSize,
} from './rules/header';

import {
  hasCanonicalTags,
  countLinks,
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
  countLinks,
];

const DOMRules = [
  outgoingNofollowLinks,
];

const filter = {
  urls: ['<all_urls>'],
  types: ['main_frame'],
};

let results = [];
let domProcessed = false;
let timeout = null;

const clearResultsDelayed = () => {
  if (timeout) { clearTimeout(timeout); }
  timeout = setTimeout(() => {
    results = [];
    domProcessed = false;
  }, 1000);
};

chrome.webNavigation.onBeforeNavigate.addListener((data) => {
  console.log('onBeforeNavigate', data);
  clearResultsDelayed();
}, filter);

chrome.webNavigation.onCommitted.addListener((data) => {
  console.log('onCommmited', data);
  if (data.frameId === 0 && data.transitionType === 'link' && data.transitionQualifiers.findIndex(q => q === 'client_redirect') !== -1) {
    results = results.concat([ruleResult('CLIENT REDIRECT', data.url)]);
  }
  clearResultsDelayed();
}, filter);

chrome.webRequest.onBeforeSendHeaders.addListener((data) => {
  console.log('onBeforeSendHeaders', data);
  clearResultsDelayed();
}, filter);

chrome.webRequest.onBeforeRequest.addListener((data) => {
  console.log('onBeforeRequest', data);
  clearResultsDelayed();
}, filter);

chrome.webRequest.onHeadersReceived.addListener((data) => {
  console.log('onHeadersReceived', data);
  if (timeout) { clearTimeout(timeout); }
  data['responseHeaders'] = normalizeHeaders(data.responseHeaders);
  results = results.concat([ruleResult(data.method, data.url)]);
  results = results.concat(headerRules.map(rule => rule(data)));
  chrome.storage.local.set({ results });
  clearResultsDelayed();
}, filter, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener((data) => {
  console.log('onCompleted', data);
  clearResultsDelayed();
}, filter);

chrome.runtime.onMessage.addListener((request, sender, cb) => {
  console.log(request, sender, cb);
  if (request.event === 'document_end') {
    const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
    results = results.concat(HTMLRules.map(rule => rule(data)));
    chrome.storage.local.set({ results });
  }

  if (request.event === 'document_idle') {
    if (!domProcessed) {
      const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
      results = results.concat(DOMRules.map(rule => rule(data)));
      chrome.storage.local.set({ results });
      domProcessed = true;
    }
  }
});
