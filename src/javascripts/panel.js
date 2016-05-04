import React from 'react';
import ReactDOM from 'react-dom';

import ResultList from './components/ResultList';
import Sandbox from './lib/Sandbox';

const callbacks = {};

window.addEventListener('message', (result) => {
  callbacks[result.data.runId](result.data);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { body, name, command, args } = request;
  if (command === 'runRule') {
    const runId = Math.round(Math.random() * 10000000);
    callbacks[runId] = sendResponse;
    Sandbox.postMessage({ command: 'runRule', name, body, args, runId }, '*');
  }
  return true;
});

chrome.runtime.sendMessage('tabIdPls', (response) => {
  chrome.storage.local.get(String(response.tabId), (results) => {
    ReactDOM.render(<ResultList results={results[String(response.tabId)] || []} />, document.getElementById('app'));
  });
});
