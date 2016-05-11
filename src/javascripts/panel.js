import React from 'react';
import ReactDOM from 'react-dom';

import ResultList from './components/ResultList';

import resultStoreKey from './utils/resultStoreKey';

let tabId = null;

const handleClosePanelRequest = () => {
  chrome.storage.local.get('hidden-panels', (data) => {
    const hiddenPanels = (data['hidden-panels'] || []).concat([tabId]);
    chrome.storage.local.set({ 'hidden-panels': hiddenPanels });
  });
};

chrome.runtime.sendMessage('tabIdPls', (response) => {
  tabId = response.tabId;
  const storeKey = resultStoreKey(tabId);
  chrome.storage.local.get(storeKey, (data) => {
    const results = data[storeKey] || [];
    ReactDOM.render(<ResultList onClosePanelRequest={handleClosePanelRequest} storeKey={storeKey} results={results} />, document.getElementById('app'));
  });
});
