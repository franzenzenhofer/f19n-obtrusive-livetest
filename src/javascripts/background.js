import { normalizeHeaders, ruleResult } from './lib/utils';

import {
  xRobotsTag,
  contentEncodingNotGzip,
  statusCodeNot200,
  documentSize,
  statusCode200,
} from './rules/header';

import {
  hasCanonicalTags,
  countLinks,
} from './rules/html';

import {
  outgoingNofollowLinks,
} from './rules/dom';


const headerRules = [
  statusCode200,
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

const store = {};

const clearResultsDelayed = (key) => {
  if (store[key].timeout) { clearTimeout(store[key].timeout); }
  store[key].timeout = setTimeout(() => {
    store[key].results = [];
    store[key].domProcessed = false;
  }, 2000);
};

chrome.webNavigation.onBeforeNavigate.addListener((data) => {
  store[data.tabId] = store[data.tabId] || { results: [], timeout: null, domProcessed: false };
  clearResultsDelayed(data.tabId);
}, filter);

chrome.webNavigation.onCommitted.addListener((data) => {
  console.log('onCommmited', data);
  if (data.frameId === 0 && data.transitionType === 'link' && data.transitionQualifiers.findIndex(q => q === 'client_redirect') !== -1) {
    store[data.tabId].results = store[data.tabId].results.concat([ruleResult('CLIENT REDIRECT', data.url)]);
    chrome.storage.local.set({ [data.tabId]: store[data.tabId].results });
  }
  clearResultsDelayed(data.tabId);
}, filter);

chrome.webRequest.onBeforeSendHeaders.addListener((data) => {
  console.log('onBeforeSendHeaders', data);
  clearResultsDelayed(data.tabId);
}, filter);

chrome.webRequest.onBeforeRequest.addListener((data) => {
  console.log('onBeforeRequest', data);
  clearResultsDelayed(data.tabId);
}, filter);

chrome.webRequest.onHeadersReceived.addListener((data) => {
  console.log('onHeadersReceived', data);
  data['responseHeaders'] = normalizeHeaders(data.responseHeaders);
  store[data.tabId].results = store[data.tabId].results.concat(headerRules.map(rule => rule(data)));
  chrome.storage.local.set({ [data.tabId]: store[data.tabId].results });
  clearResultsDelayed(data.tabId);
}, filter, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener((data) => {
  console.log('onCompleted', data);
  clearResultsDelayed(data.tabId);
}, filter);

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  if (request === 'tabIdPls') {
    callback({ tabId: sender.tab.id });
  }

  if (request.event === 'document_end') {
    const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
    store[sender.tab.id].results = store[sender.tab.id].results.concat(HTMLRules.map(rule => rule(data)));
    chrome.storage.local.set({ [sender.tab.id]: store[sender.tab.id].results });
  }

  if (request.event === 'document_idle') {
    if (!store[sender.tab.id].domProcessed) {
      const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
      store[sender.tab.id].results = store[sender.tab.id].results.concat(DOMRules.map(rule => rule(data)));
      store[sender.tab.id].domProcessed = true;
      chrome.storage.local.set({ [sender.tab.id]: store[sender.tab.id].results });
    }
  }
});
