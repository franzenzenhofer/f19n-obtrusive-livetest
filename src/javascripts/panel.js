import React from 'react';
import ReactDOM from 'react-dom';

import ResultList from './components/ResultList';

chrome.runtime.sendMessage('tabIdPls', (response) => {
  chrome.storage.local.get(String(response.tabId), (results) => {
    ReactDOM.render(<ResultList tabId={response.tabId} results={results[String(response.tabId)] || []} />, document.getElementById('app'));
  });
});
