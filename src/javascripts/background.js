import EventCollector from './utils/EventCollector';
import update from 'react-addons-update';

import { isEmpty, fromPairs, xor, difference, without } from 'lodash';

import resultStoreKey from './utils/resultStoreKey';
import { runRule } from './utils/Sandbox';

const filter = {
  urls: ['<all_urls>'],
  types: ['main_frame'],
};

const collector = {};

const normalizeHeaders = (responseHeaders) => {
  const responseHeaderPairs = responseHeaders.map((responseHeader) => {
    return [responseHeader.name.toLowerCase(), responseHeader.value];
  });
  return fromPairs(responseHeaderPairs);
};

const hashFromNameValuePairArray = (array) => {
  const flatArray = array.map((entry) => {
    return [entry.name, entry.value];
  });
  return fromPairs(flatArray);
};

const cleanup = () => {
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
    const openTabIds = tabs.map(t => t.id);
    chrome.storage.local.get(null, (data) => {
      const savedTabResultIds = Object
        .keys(data)
        .filter(key => key.match(/results-\d+/))
        .map(key => key.split('-')[1])
        .map(key => Number(key));
      const tabIdsToRemove = xor(openTabIds, savedTabResultIds);
      const hiddenPanels = data['hidden-panels'] || [];
      chrome.storage.local.remove(tabIdsToRemove.map(id => resultStoreKey(id)));
      chrome.storage.local.set({ 'hidden-panels': difference(hiddenPanels, tabIdsToRemove) });
      tabIdsToRemove.forEach((id) => { delete collector[id]; });
    });
  });
};

const findOrCreateCollector = (tabId) => {
  collector[tabId] = collector[tabId] || new EventCollector({
    onFinished: (events) => {
      // Fetch rules from storage
      chrome.storage.local.get('rules', (data) => {
        // Take only enabled rules
        const enabledRules = (data.rules || []).filter(r => r.status === 'enabled');
        const promisedRuleCalls = enabledRules.map((rule) => {
          return new Promise((resolve) => { runRule(rule, events, (result) => { resolve(result); }); });
        });

        Promise.all(promisedRuleCalls).then((results) => {
          const notEmptyResults = results.filter(r => !isEmpty(r));
          setTimeout(() => {
            const storeKey = resultStoreKey(tabId);
            chrome.storage.local.set({ [storeKey]: notEmptyResults });
          }, 0);
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
  const eventData = update(
    data,
    {
      responseHeaders: { $set: normalizeHeaders(responseHeaders) },
      rawResponseHeaders: { $set: hashFromNameValuePairArray(responseHeaders) },
    }
  );
  findOrCreateCollector(tabId).pushEvent(eventData, 'onHeadersReceived');
}, filter, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener((data) => {
  const { tabId } = data;
  findOrCreateCollector(tabId).pushEvent(data, 'onCompleted');
}, filter);

chrome.tabs.onRemoved.addListener(() => {
  cleanup();
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

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.storage.local.get('hidden-panels', (data) => {
    const tabId = tab.id;
    let hiddenPanels = (data['hidden-panels'] || []);

    if (hiddenPanels.indexOf(tabId) === -1) {
      hiddenPanels = hiddenPanels.concat([tabId]);
    } else {
      hiddenPanels = without(hiddenPanels, tabId);
    }

    chrome.storage.local.set({ 'hidden-panels': hiddenPanels });
  });
});
