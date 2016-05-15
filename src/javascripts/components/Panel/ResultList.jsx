import React, { Component } from 'react';
import ResultItem from './ResultItem';

import { sortBy } from 'lodash';

export default class ResultList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: props.results,
      filter: null,
    };

    const onStoreChange = this.onStoreChange.bind(this);
    chrome.storage.onChanged.addListener(onStoreChange);

    this.closePanelClick = this.closePanelClick.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  onStoreChange(data) {
    const storeKey = Object.keys(data)[0];
    if (storeKey && storeKey === this.props.storeKey) {
      this.setState({ results: data[storeKey].newValue });
    }
  }

  setFilter(label) {
    this.setState({ filter: label });
  }

  clearFilter() {
    this.setState({ filter: null });
  }

  resultItems(resultData, index) {
    return <ResultItem {...resultData} onLabelClick={() => this.setFilter(resultData.label)} key={`result-${index}`} />;
  }

  closePanelClick() {
    this.props.onClosePanelRequest();
  }

  render() {
    let results = this.state.results;

    results = results.filter(r => r.type && r.priority && r.message && r.label);
    results = this.state.filter ? results.filter(r => r.label === this.state.filter) : results;
    results = sortBy(results, ['priority']).reverse();

    const clearFilterLink = this.state.filter ? <a href="#" className="clear-filter" onClick={this.clearFilter}>clear filter</a> : null;

    return (
      <div className="f19n-panel">
        <div className="header">
          <h2 className="brand">f19n Live Test</h2>
          <div className="controls">
            <a className="close" onClick={this.closePanelClick}>x</a>
            {clearFilterLink}
            <a className="rules" target="_blank" href={chrome.extension.getURL('rules.html')}><button>Manage rules</button></a>
          </div>
        </div>
        <table className="results">
        <tr>
          <th>Type</th>
          <th>Label</th>
          <th>Message</th>
        </tr>
          {results.map(this.resultItems.bind(this))}
        </table>
      </div>
    );
  }
}
