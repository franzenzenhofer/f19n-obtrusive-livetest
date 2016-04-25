import React, { Component } from 'react';
import ResultItem from '../components/ResultItem';

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
    this.setState({ results: data.newValue });
  }

  resultItems(resultData, index) {
    return <ResultItem {...resultData} key={`result-${index}`} />;
  }

  resultHeader() {
    return (
      <thead>
        <tr>
          <th className="type">Type</th>
          <th className="label">Label</th>
          <th className="message">Message</th>
        </tr>
      </thead>
    );
  }

  render() {
    return (
      <table>
        <tbody>
          {this.state.results.filter(r => r).map(this.resultItems.bind(this))}
        </tbody>
      </table>
    );
  }
}
