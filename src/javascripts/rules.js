import React from 'react';
import ReactDOM from 'react-dom';

import Rules from 'Rules';

chrome.storage.local.get('rules', (results) => {
  ReactDOM.render(<Rules rules={results.rules || []} />, document.getElementById('app'));
});
