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
        <div className="Header">
          <div className="Header-brand u-cf">
            <svg className="ic u-floatLeft" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6E772F" d="M11.7 17.2L2 15l10.2-2.4L22 15"/><path fill="#4F5429" d="M11.7 21.7L2 19.5V15l9.7 2.2"/><path fill="#8E9A34" d="M22 19.5l-10.3 2.2v-4.5L22 15"/><g><path fill="#6E772F" d="M11.7 12L2 9.7l10.2-2.3L22 9.8"/><path fill="#4F5429" d="M11.7 16.5L2 14.2V9.7l9.7 2.3"/><path fill="#8E9A34" d="M22 14.3l-10.3 2.2V12L22 9.8"/></g><g><path fill="#6E772F" d="M11.7 6.9L2 4.6l10.2-2.3L22 4.7"/><path fill="#4F5429" d="M11.7 11.4L2 9.1V4.6l9.7 2.3"/><path fill="#8E9A34" d="M22 9.2l-10.3 2.2V6.9L22 4.7"/></g></svg>
            <h2 className="u-floatLeft">Obtrusive Live Test</h2>
            <a className="u-floatRight" onClick={this.closePanelClick}>
              <svg className="ic ic-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/>
              </svg>
            </a>
          </div>
          <div className="Header-controls u-cf">
            <a className="Button u-floatLeft" target="_blank" href={chrome.extension.getURL('rules.html')}>Manage Rules</a>
            <span className="u-floatRight">{clearFilterLink}</span>
          </div>
        </div>
        <table className="ResultsTable ResultsTable--striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>Label</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {results.map(this.resultItems.bind(this))}
          </tbody>
        </table>
      </div>
    );
  }
}
