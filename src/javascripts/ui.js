import React from 'react';
import ReactDOM from 'react-dom';

import ResultList from './components/ResultList';

chrome.storage.local.get('results', (data) => {
  ReactDOM.render(<ResultList results={data.results} />, document.getElementById('app'));
});
