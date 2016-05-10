import React from 'react';
import ReactDOM from 'react-dom';

import ResultList from './components/ResultList';

import resultStoreKey from './utils/resultStoreKey';

chrome.runtime.sendMessage('tabIdPls', (response) => {
  const storeKey = resultStoreKey(response.tabId);
  chrome.storage.local.get(storeKey, (data) => {
    const results = data[storeKey];
    ReactDOM.render(<ResultList storeKey={storeKey} results={results || []} />, document.getElementById('app'));
  });
});
