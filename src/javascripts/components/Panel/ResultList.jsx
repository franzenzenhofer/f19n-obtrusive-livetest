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
    return <ResultItem {...resultData} onLabelClick={() => this.setFilter(resultData.label) } onTypeClick={() => this.setFilter(resultData.type) } key={`result-${index}`} />;
  }

  closePanelClick() {
    this.props.onClosePanelRequest();
  }

  render() {
    let results = this.state.results;

    //gets rid of results without required fields
    results = results.filter(r => r.type && r.message && r.label);
    results = this.state.filter ? results.filter(r => r.label === this.state.filter || r.type === this.state.filter) : results;

    const clearFilterLink = this.state.filter ? <a href="javascript://" className="clear-filter" onClick={this.clearFilter}>Clear filter</a> : null;

    setTimeout(() => {
      window.parent.postMessage({ height: document.querySelector('#app').offsetHeight }, '*');
    }, 100);

    return (
      <div className="f19n-panel">
        <div className="Header">
          <div className="Header-controls u-cf">
            <a className="Button u-floatLeft" target="_blank" href={chrome.extension.getURL('rules.html')}>Manage rules</a>
            <span className="u-floatRight">{clearFilterLink}</span>
          </div>
        </div>
        <table className="ResultsTable ResultsTable--striped">
          <tbody>
            {results.map(this.resultItems.bind(this))}
          </tbody>
        </table>
      </div>
    );
  }
}

/*

<!--<thead>
  <tr>
    <th>Type</th>
    <th>Label</th>
    <th>Message</th>
  </tr>
</thead>-->

*/
