import React from 'react';
import ReactDOM from 'react-dom';

import Rules from './components/Rules/Rules';

chrome.storage.local.get('rules', (results) => {
  ReactDOM.render(<Rules rules={results.rules || []} />, document.getElementById('app'));
});
