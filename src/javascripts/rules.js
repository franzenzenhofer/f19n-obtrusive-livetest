import React from 'react';
import ReactDOM from 'react-dom';

import Rules from './components/Rules/Rules';

chrome.storage.local.get((data) => {
  let { rules, sites } = data;
  rules = rules || [];
  sites = sites || '*://*';
  ReactDOM.render(<Rules rules={rules} sites={sites} />, document.getElementById('app'));
});
