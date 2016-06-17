import React from 'react';
import ReactDOM from 'react-dom';

import rulesStore from './store/rules';

import Rules from './components/Rules/Rules';

chrome.storage.local.get((data) => {
  rulesStore.all((rules) => {
    let { sites } = data;
    sites = sites || '*://*';
    ReactDOM.render(<Rules rules={rules} sites={sites} />, document.getElementById('app'));
  });
});
