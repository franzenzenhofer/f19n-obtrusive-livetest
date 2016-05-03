import React from 'react';
import ReactDOM from 'react-dom';

import ResultList from './components/ResultList';
import Sandbox from './lib/Sandbox';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { body, name, command, args } = request;
  if (command === 'runRule') {
    window.addEventListener('message', (a) => {
      sendResponse(a.data);
    });
    Sandbox.postMessage({ command: 'runRule', name, body, args }, '*');
  }
  return true;
});

chrome.runtime.sendMessage('tabIdPls', (response) => {
  chrome.storage.local.get(String(response.tabId), (results) => {
    ReactDOM.render(<ResultList results={results[String(response.tabId)] || []} />, document.getElementById('app'));
  });
});
