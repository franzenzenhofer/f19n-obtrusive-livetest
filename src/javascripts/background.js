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

chrome.webNavigation.onBeforeNavigate.addListener((data) => {
  console.log('onBeforeNavigate', data);
  results = [];
  domProcessed = false;
}, filter);

chrome.webRequest.onBeforeSendHeaders.addListener((data) => {
  console.log('onBeforeSendHeaders', data);
}, filter);

chrome.webRequest.onBeforeRequest.addListener((data) => {
  console.log('onBeforeRequest', data);
}, filter);

chrome.webRequest.onHeadersReceived.addListener((data) => {
  console.log('onHeadersReceived', data);
  data['responseHeaders'] = normalizeHeaders(data.responseHeaders);
  results = results.concat([ruleResult(data.method, data.url)]);
  results = results.concat(headerRules.map(rule => rule(data)));
  chrome.storage.local.set({ results });
}, filter, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener(() => {
  console.log('onCompleted');
}, filter);

chrome.runtime.onMessage.addListener((request) => {
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
