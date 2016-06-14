import React from 'react';
import ReactDOM from 'react-dom';

import Rules from './components/Rules/Rules';

chrome.storage.local.get('rules', (data) => {
  let { rules } = data;
  rules = rules || [];
  ReactDOM.render(<Rules rules={rules} />, document.getElementById('app'));
});
