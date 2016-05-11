import React, { Component } from 'react';
import ResultItem from './ResultItem';

import { sortBy } from 'lodash';

export default class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: props.results,
    };
    const onStoreChange = this.onStoreChange.bind(this);
    chrome.storage.onChanged.addListener(onStoreChange);
    this.closePanelClick = this.closePanelClick.bind(this);
  }

  onStoreChange(data) {
    const storeKey = Object.keys(data)[0];
    if (storeKey && storeKey === this.props.storeKey) {
      this.setState({ results: data[storeKey].newValue });
    }
  }

  resultItems(resultData, index) {
    return <ResultItem {...resultData} key={`result-${index}`} />;
  }

  closePanelClick() {
    this.props.onClosePanelRequest();
  }

  render() {
    let results = this.state.results;
    results = results.filter(r => r.type && r.priority && r.message && r.label);
    results = sortBy(results, ['priority']).reverse();

    return (
      <div className="f19n-panel">
        <div className="header">
          <h2 className="brand">f19n Live Test</h2>
          <div className="controls">
            <a className="close" onClick={this.closePanelClick}>close panel</a>
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
