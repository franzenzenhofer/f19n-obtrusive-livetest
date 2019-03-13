import { isEmpty, fromPairs, xor, difference, without } from 'lodash';
import update from 'react-addons-update';

import EventCollector from './utils/EventCollector';
import resultStoreKey from './utils/resultStoreKey';
import { runRule } from './utils/Sandbox';
import { createResult } from './utils/RuleContext';

import syncDefaultRules from './utils/syncDefaultRules';
import { activeForTab } from './utils/activeForTab';

import extensionLiveReload from './utils/extensionLiveReload';

import Config from './config';

const filter = {
  urls: ['http://*/*', 'https://*/*'],
  types: ['main_frame'],
};

const collector = {};
const currentTabCollectorId = {};

if (process.env.NODE_ENV === 'development') extensionLiveReload();

const setDefaults = (callback = null) => {
  const { panelPosition, sites, globalRuleVariables } = Config.defaults;
  chrome.storage.local.get((data) => {
    if (!data.sites) {
      chrome.storage.local.set({ sites }, callback);
    }
    if (!data.panelPosition) {
      chrome.storage.local.set({ panelPosition }, callback);
    }
    if (!data.globalRuleVariables) {
      chrome.storage.local.set({ globalRuleVariables }, callback);
    }
  });
};

const ifPanelOpenForTab = ({ id, url }, callback) => {
  activeForTab({ id, url }).then(({ disabled, hidden }) => {
    if (!hidden && !disabled) {
      callback();
    }
  });
};

chrome.runtime.onInstalled.addListener(() => {
  syncDefaultRules();
  setDefaults();
});

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
    const openTabHosts = tabs.map(t => (new URL(t.url)).host);

    chrome.storage.local.get(null, (data) => {
      const savedPanelPositionHosts = Object
        .keys(data)
        .filter(key => key.match(/panel-position-(.+)/))
        .map(key => key.split('panel-position-')[1]);
      const savedTabResultIds = Object
        .keys(data)
        .filter(key => key.match(/results-\d+/))
        .map(key => key.split('-')[1])
        .map(key => Number(key));
      const tabIdsToRemove = xor(openTabIds, savedTabResultIds);
      const panelPositionsToRemove = xor(openTabHosts, savedPanelPositionHosts);
      const hiddenPanels = data['hidden-panels'] || [];
      chrome.storage.local.remove(tabIdsToRemove.map(id => resultStoreKey(id)));
      chrome.storage.local.remove(panelPositionsToRemove.map(host => `panel-position-${host}`));
      chrome.storage.local.set({ 'hidden-panels': difference(hiddenPanels, tabIdsToRemove) });
      tabIdsToRemove.forEach((id) => { delete collector[id]; });
    });
  });
};

const findOrCreateCollector = (tabId) => {
  collector[tabId] = collector[tabId] || new EventCollector({
    onStart: (events, id) => {
      currentTabCollectorId[tabId] = id;
    },
    onFinished: (events, id) => {
      // Fetch rules from storage
      chrome.storage.local.get('rules', (data) => {
        // Take only enabled rules
        const enabledRules = (data.rules || []).filter(r => r.status === 'enabled');
        const storeKey = resultStoreKey(tabId);

        let storeLocked = false;

        const initialRulesResult = enabledRules.map((enabledRule) => {
          return Object.assign(createResult('WAIT', `Running <b>${enabledRule.name}</b>`, 'pending'), { name: enabledRule.name });
        });

        const updateStore = (key, res) => {
          if (storeLocked) {
            setTimeout(() => { updateStore(key, res); }, 1);
          } else {
            storeLocked = true;
            chrome.storage.local.get(key, (d) => {
              const results = d[key] || [];
              const indexToReplace = results.findIndex(result => result.name === res.name);
              if (indexToReplace !== -1) {
                results[indexToReplace] = res;
              } else {
                results.push(res);
              }
              chrome.storage.local.set({ [key]: results }, () => { storeLocked = false; });
            });
          }
        };

        chrome.storage.local.set({ [storeKey]: initialRulesResult }, () => {
          enabledRules.forEach((rule) => {
            const r = new Promise((resolve) => {
              runRule(rule, events, (result) => {
                if (currentTabCollectorId[tabId] === id) {
                  resolve(result);
                }
              });
            });

            r.then((res) => {
              if (!isEmpty(res)) {
                updateStore(storeKey, res);
              }
            });

            return r;
          });
        });
      });
    },
  });

  return collector[tabId];
};

//include fix that when pages put a history state update to itself it does not trigger a re-evaluation
chrome.webNavigation.onHistoryStateUpdated.addListener((data) => {
  let old_url = '';
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    if (data.frameId === 0) {
      if(old_url !== url)
      {
        findOrCreateCollector(id).pushEvent(data, 'onHistoryStateUpdated');
        old_url = url;
      }
    }
  });
}, filter);

chrome.webNavigation.onBeforeNavigate.addListener((data) => {
  //cleanup();
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    if (data.frameId === 0) {
      findOrCreateCollector(id).pushEvent(data, 'onBeforeNavigate');
    }
  });
}, filter);

chrome.webNavigation.onCommitted.addListener((data) => {
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    if (data.frameId === 0) {
      findOrCreateCollector(id).pushEvent(data, 'onCommitted');
    }
  });
}, filter);

chrome.webRequest.onBeforeSendHeaders.addListener((data) => {
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    findOrCreateCollector(id).pushEvent(data, 'onBeforeSendHeaders');
  });
}, filter);

chrome.webRequest.onBeforeRequest.addListener((data) => {
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    findOrCreateCollector(id).pushEvent(data, 'onBeforeRequest');
  });
}, filter);

chrome.webRequest.onBeforeRedirect.addListener((data) => {
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    findOrCreateCollector(id).pushEvent(data, 'onBeforeRedirect');
  });
}, filter);

chrome.webRequest.onResponseStarted.addListener((data) => {
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    findOrCreateCollector(id).pushEvent(data, 'onResponseStarted');
  });
}, filter);

chrome.webRequest.onHeadersReceived.addListener((data) => {
  const { tabId: id, url, responseHeaders } = data;
  ifPanelOpenForTab({ id, url }, () => {
    const eventData = update(
      data,
      {
        responseHeaders: { $set: normalizeHeaders(responseHeaders) },
        rawResponseHeaders: { $set: hashFromNameValuePairArray(responseHeaders) },
      }
    );
    findOrCreateCollector(id).pushEvent(eventData, 'onHeadersReceived');
  });
}, filter, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener((data) => {
  const { tabId: id, url } = data;
  ifPanelOpenForTab({ id, url }, () => {
    findOrCreateCollector(id).pushEvent(data, 'onCompleted');
  });
}, filter);

chrome.tabs.onRemoved.addListener(() => {
  cleanup();
});

chrome.tabs.onActivated.addListener(() => {
  //cleanup();
});


/*chrome.tabs.onUpdated.addListener((a,b,c,d) => {
  //cleanup();
  if(b&&b.status&&b.status!=='loading')
  {
    cleanup();
  }

});*/

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  if (request === 'tabIdPls') {
    callback({ tabId: sender.tab.id, url: sender.tab.url });
  }

  if (request.event === 'requestSetIcon') {
    const { path, tabId } = request.data;
    chrome.browserAction.setIcon({ path, tabId });
  }

  if (request.event === 'DOMContentLoaded') {
    const { id, url } = sender.tab;
    ifPanelOpenForTab({ id, url }, () => {
      findOrCreateCollector(id).pushEvent(request.data, 'DOMContentLoaded');
    });
  }

  if (request.event === 'document_end') {
    const { id, url } = sender.tab;
    ifPanelOpenForTab({ id, url }, () => {
      findOrCreateCollector(id).pushEvent(request.data, 'documentEnd');
    });
  }

  if (request.event === 'document_idle') {
    const { id, url } = sender.tab;
    ifPanelOpenForTab({ id, url }, () => {
      findOrCreateCollector(id).pushEvent(request.data, 'documentIdle');
    });
  }

  if (request.event === 'window_performance') {
    const { id, url } = sender.tab;
    ifPanelOpenForTab({ id, url }, () => {
      findOrCreateCollector(id).pushEvent(request.data, 'windowPerformance');
    });
  }

  //onHistoryStateUpdated

});


// FIXME: Remove. Never gets called since we introduced the extension-popup
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.storage.local.get('hidden-panels', (data) => {
    const tabId = tab.id;
    let hiddenPanels = (data['hidden-panels'] || []);

    if (hiddenPanels.indexOf(tabId) === -1) {
      hiddenPanels = hiddenPanels.concat([tabId]);
    } else {
      hiddenPanels = without(hiddenPanels, tabId);
      chrome.tabs.reload(tabId);
    }

    chrome.storage.local.set({ 'hidden-panels': hiddenPanels });
  });
});
