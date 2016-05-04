import { normalizeHeaders } from './lib/utils';

import EventCollector from './lib/EventCollector';

import update from 'react-addons-update';

const filter = {
  urls: ['<all_urls>'],
  types: ['main_frame'],
};

const collector = {};
const events = {};

const findOrCreateCollector = (tabId) => {
  collector[tabId] = collector[tabId] || new EventCollector({
    onFinished: (e) => {
      console.log(`DataCollector finished for tabId: ${tabId}`, e);
      events[tabId] = e;
    },
  });
  return collector[tabId];
};

chrome.webNavigation.onBeforeNavigate.addListener((data) => {
  const { tabId } = data;
  if (data.frameId === 0) {
    findOrCreateCollector(tabId).pushEvent(data, 'onBeforeNavigate');
  }
}, filter);

chrome.webNavigation.onCommitted.addListener((data) => {
  const { tabId } = data;
  if (data.frameId === 0) {
    findOrCreateCollector(tabId).pushEvent(data, 'onCommitted');
  }
}, filter);

chrome.webRequest.onBeforeSendHeaders.addListener((data) => {
  const { tabId } = data;
  findOrCreateCollector(tabId).pushEvent(data, 'onBeforeSendHeaders');
}, filter);

chrome.webRequest.onBeforeRequest.addListener((data) => {
  const { tabId } = data;
  findOrCreateCollector(tabId).pushEvent(data, 'onBeforeRequest');
}, filter);

chrome.webRequest.onHeadersReceived.addListener((data) => {
  const { tabId, responseHeaders } = data;
  findOrCreateCollector(tabId).pushEvent(update(data, { responseHeaders: { $set: normalizeHeaders(responseHeaders) } }), 'onHeadersReceived');
}, filter, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener((data) => {
  const { tabId } = data;
  findOrCreateCollector(tabId).pushEvent(data, 'onCompleted');
}, filter);

chrome.tabs.onRemoved.addListener((tabId) => {
  events[tabId] = [];
  collector[tabId] = null;
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  if (request === 'tabIdPls') {
    callback({ tabId: sender.tab.id });
  }

  if (request === 'panelReady') {
    const tabId = sender.tab.id;
    const results = [];

    chrome.storage.local.get('rules', (data) => {
      data.rules.forEach((rule) => {
        chrome.tabs.sendMessage(tabId, { command: 'runRule', name: rule.name, body: rule.body, args: events[tabId] }, (result) => {
          results.push(result);
          chrome.storage.local.set({ [String(tabId)]: results });
        });
      });
    });
  }

  if (request.event === 'document_end') {
    const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
    const tabId = sender.tab.id;
    findOrCreateCollector(tabId).pushEvent(data, 'documentEnd');
  }

  if (request.event === 'document_idle') {
    const data = Object.assign({}, request.data, { document: (new DOMParser()).parseFromString(request.data.html, 'text/html') });
    const tabId = sender.tab.id;
    findOrCreateCollector(tabId).pushEvent(data, 'documentIdle');
  }
});
