import React from 'react';
import ReactDOM from 'react-dom';

import ResultList from './components/ResultList';

chrome.runtime.sendMessage('tabIdPls', (response) => {
  chrome.storage.local.get(String(response.tabId), (results) => {
    ReactDOM.render(<ResultList results={results[String(response.tabId)]} />, document.getElementById('app'));
  });
});
