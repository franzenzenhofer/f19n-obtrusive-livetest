import React, { Component } from 'react';
import ResultItem from './ResultItem';

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

  clearFilter = () => {
    this.setState({ filter: null });
  }

  resultItems(resultData, index) {
    return <ResultItem {...resultData} onLabelClick={() => this.setFilter(resultData.label) } onTypeClick={() => this.setFilter(resultData.type)} key={`result-${index}`} />;
  }

  closePanelClick(e) {
    this.props.onClosePanelRequest();
    e.preventDefault();
  }


  render() {
    let results = this.state.results || [];

    //gets rid of results without required fields
    results = results.filter(r => r.type && r.message && r.label);
    results = this.state.filter ? results.filter(r => r.label === this.state.filter || r.type === this.state.filter) : results;
    var promotion_results = results.filter(r => r.type === "promotion");
    var error_results = results.filter(r => r.type === "error");
    var warning_results = results.filter(r => r.type === "warning");
    var pending_results = results.filter(r => r.type === "pending");
    var info_results = results.filter(r => (r.type !== "error" && r.type !== "warning" && r.type !== "pending" && r.type !== "promotion"));
    results = error_results.concat(warning_results, promotion_results, info_results, pending_results);

    const clearFilterLink = this.state.filter ? <a href="javascript://" className="clear-filter" onClick={this.clearFilter}>Clear filter</a> : null;

    setTimeout(() => {
      window.parent.postMessage({ rendered: true }, '*');
    }, 10);

    return (
      <div className="f19n-panel">
        <div className="Header">
          <div className="Header-brand u-cf">
          <svg className="ic u-floatLeft" viewBox="0 0 100 100"><circle fill="#1783E5" cx="50" cy="50" r="48"/><path fill="#E6E6E6" d="M74.5 83.2H38.2V20.4h36.3c2.7 0 4.8 2.1 4.8 4.8v53.1c0 2.7-2.2 4.9-4.8 4.9z"/><path fill="#B3B3B3" d="M40.2 26.4h35.5v4H40.2zM40.2 31.1h21.1v4H40.2zM40.2 40.8h35.5v4H40.2zM40.2 45.5h21.1v4H40.2zM40.2 54.6h35.5v4H40.2zM40.2 59.4h21.1v4H40.2zM40.2 68.9h35.5v4H40.2zM40.2 73.6h21.1v4H40.2z"/><path fill="#FFF" d="M42.2 79.9H27.6c-2.7 0-4.8-2.1-4.8-4.8V22c0-2.7 2.1-4.8 4.8-4.8h14.7v62.7z"/><path fill="#F05228" d="M32.7 22c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4S35.7 22 32.7 22zm3 6.9l-1.4 1.4-1.6-1.6-1.6 1.6-1.4-1.4 1.6-1.6-1.6-1.6 1.4-1.4 1.6 1.6 1.6-1.6 1.4 1.4-1.6 1.6 1.6 1.6z"/><path fill="#1783E5" d="M32.7 50.4c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7s-.3.7-.7.7c-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.7h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1zM32.7 64.6c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.8h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1z"/><path fill="#FAC917" d="M37.3 44.9l-4.5-7.7c-.3-.6-1.2-.5-1.5 0l-4.5 7.6c-.3.6.2 1.2.8 1.2h9c.7 0 1.1-.6.7-1.1zM32.7 40l-.1 4h-1l-.1-4h1.2zm-.1 5.3c-.1.1-.3.2-.5.2s-.4-.1-.5-.2c-.1-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4.1-.1.3-.2.5-.2s.4.1.5.2c.1.1.2.3.2.4 0 .1-.1.2-.2.4z"/><path fill="#666" d="M38.2 83.2v-3.3h4z"/></svg>
            <h2 className="u-floatLeft">Obtrusive Live Test</h2>
              <span className="u-floatRight" ><a  target="_blank"  href={chrome.extension.getURL('rules.html')}>
                <button className="Button Button--haptic u-floatLeft">&#9881; Settings</button>
              </a>
            <a onClick={this.closePanelClick} href="#">
              <svg className="ic ic-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/>
              </svg>
            </a></span>
          </div>
          <div className="Header-controls u-cf">
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
