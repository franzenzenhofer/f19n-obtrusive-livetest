import { normalizeHeaders } from './lib/utils';
import EventCollector from './lib/EventCollector';
import update from 'react-addons-update';

import { runRule } from './lib/Sandbox';

const filter = {
  urls: ['<all_urls>'],
  types: ['main_frame'],
};

const collector = {};

const findOrCreateCollector = (tabId) => {
  collector[tabId] = collector[tabId] || new EventCollector({
    onFinished: (events) => {
      console.log(`DataCollector finished for tabId: ${tabId}`, events);
      const results = [];

      // Empty results in case of no (or disabled) rules
      chrome.storage.local.remove([String(tabId)]);

      chrome.storage.local.get('rules', (data) => {
        const enabledRules = (data.rules || []).filter(r => r.status === 'enabled');
        enabledRules.forEach((rule) => {
          runRule(rule, events, (result) => {
            if (result) {
              results.push(result);
              chrome.storage.local.set({ [String(tabId)]: results });
            }
          });
        });
      });
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
  collector[tabId] = null;
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  if (request === 'tabIdPls') {
    callback({ tabId: sender.tab.id });
  }

  if (request.event === 'document_end') {
    const tabId = sender.tab.id;
    findOrCreateCollector(tabId).pushEvent(request.data, 'documentEnd');
  }

  if (request.event === 'document_idle') {
    const tabId = sender.tab.id;
    findOrCreateCollector(tabId).pushEvent(request.data, 'documentIdle');
  }
});
