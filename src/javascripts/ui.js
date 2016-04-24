import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ResultItem from './components/ResultItem';

class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: props.results,
    };
    const onStoreChange = this.onStoreChange.bind(this);
    chrome.storage.onChanged.addListener(onStoreChange);
  }

  onStoreChange(data) {
    console.log('update', data); 
    this.setState({ results: data.results.newValue });
  }

  resultItems(resultData, index) {
    return <ResultItem {...resultData} key={`result-${index}`} />;
  }

  resultHeader() {
    return (
      <tr>
        <th>Type</th>
        <th>Label</th>
        <th>Message</th>
      </tr>
    );
  }

  render() {
    return (
      <table>
        <thead>
          {this.resultHeader()}
        </thead>
        <tbody>
          {this.state.results.filter(r => r).map(this.resultItems.bind(this))}
        </tbody>
      </table>
    );
  }
}

chrome.storage.local.get('results', (data) => {
  ReactDOM.render(<ResultList results={data.results} />, document.getElementById('app'));
});
