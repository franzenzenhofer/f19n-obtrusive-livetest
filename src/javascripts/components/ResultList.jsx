import React, { Component } from 'react';
import ResultItem from '../components/ResultItem';

import { sortBy } from 'lodash';

export default class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: props.results,
    };
    const onStoreChange = this.onStoreChange.bind(this);
    chrome.storage.onChanged.addListener(onStoreChange);
  }

  onStoreChange(data) {
    const tabId = Object.keys(data)[0];
    if (tabId && Number(tabId) === this.props.tabId) {
      this.setState({ results: data[tabId].newValue });
    }
  }

  resultItems(resultData, index) {
    return <ResultItem {...resultData} key={`result-${index}`} />;
  }

  render() {
    let results = this.state.results;
    results = results.filter(r => r.type && r.priority && r.message && r.label);
    results = sortBy(results, ['priority']).reverse();

    return (
      <div className="fso-panel">
        <div className="header">
          <h2 className="brand">FSO Live Test</h2>
          <div className="controls">
            <a className="close">close panel</a>
            <a className="rules" target="_blank" href={chrome.extension.getURL('rules.html')}>rules</a>
          </div>
        </div>
        <div className="results">
          {results.map(this.resultItems.bind(this))}
        </div>
      </div>
    );
  }
}
