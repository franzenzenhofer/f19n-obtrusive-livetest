import React from 'react';
import ReactDOM from 'react-dom';

import rulesStore from './store/rules';

import Rules from './components/Rules/Rules';

chrome.storage.local.get((data) => {
  rulesStore.all((rules) => {
    const { sites, mode, globalRuleVariables, googleApiAccessToken } = data;
    ReactDOM.render(
      <Rules
        rules={rules}
        sites={sites}
        mode={mode}
        globalRuleVariables={globalRuleVariables}
        googleApiAccessToken={googleApiAccessToken}
      />,
      document.getElementById('app')
    );
  });
});
