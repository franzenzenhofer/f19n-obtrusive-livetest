import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './components/Panel/Panel';
import resultStoreKey from './utils/resultStoreKey';

const handleClosePanelRequest = () => {
  chrome.runtime.sendMessage('tabIdPls', (response) => {
    const { tabId } = response;
    chrome.storage.local.get('hidden-panels', (data) => {
      const hiddenPanels = (data['hidden-panels'] || []).concat([tabId]);
      chrome.storage.local.set({ 'hidden-panels': hiddenPanels });
    });
  });
};

chrome.runtime.sendMessage('tabIdPls', (response) => {
  const { tabId, url } = response;
  const storeKey = resultStoreKey(tabId);
  chrome.storage.local.get(storeKey, (data) => {
    const results = data[storeKey] || [];
    ReactDOM.render(<Panel onClosePanelRequest={handleClosePanelRequest} storeKey={storeKey} results={results} url={url} />, document.getElementById('app'));
  });
});
