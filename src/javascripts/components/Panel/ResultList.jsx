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

    const byPriority = (a, b) => {
      return Number(b.priority) - Number(a.priority);
    };

    // Get rid of results without required fields
    results = results.filter(r => r.type && r.message && r.label);

    // Show only results for current filter if set
    results = this.state.filter ? results.filter(r => r.label === this.state.filter || r.type === this.state.filter) : results;

    var promotion_results = results.filter(r => r.type === "promotion").sort(byPriority);
    var error_results = results.filter(r => r.type === "error").sort(byPriority);
    var warning_results = results.filter(r => r.type === "warning").sort(byPriority);
    var pending_results = results.filter(r => r.type === "pending").sort(byPriority);
    var info_results = results.filter(r => (r.type !== "error" && r.type !== "warning" && r.type !== "pending" && r.type !== "promotion")).sort(byPriority);

    results = error_results.concat(warning_results, promotion_results, info_results, pending_results);

    const clearFilterLink = this.state.filter ? <a href="javascript://" className="clear-filter" onClick={this.clearFilter}>Clear filter</a> : null;

    setTimeout(() => {
      window.parent.postMessage({ rendered: true }, '*');
    }, 10);

    return (
      <div className="f19n-panel">
        <div className="Header">
          <div className="Header-brand u-cf">
            <svg className="ic ic--panelHead u-floatLeft" width="16" height="16" viewBox="0 0 100 100"><clipPath id="a"><path d="m56.8 37 .9.4c-.3-.2-.7-.3-1.1-.3l-.9-.4c.4.1.8.2 1.1.3z"/></clipPath><clipPath id="b"><path d="m53.6 46.5-.9-.5c-1-.5-1.7-1.7-1.7-3.3 0-2.6 1.6-5.1 3.7-5.8.3-.1.6-.1.9-.1l.9.4c-.3 0-.6 0-.9.1-2.1.6-3.7 3.2-3.7 5.8 0 1.6.7 2.9 1.7 3.4z"/></clipPath><clipPath id="c"><path d="m57.3 71.5.9.3c-.2-.1-.5-.1-.8-.1l-.9-.3c.3 0 .6 0 .8.1z"/></clipPath><clipPath id="d"><path d="m56.2 75.1-.9-.3h.2l.9.3c-.1 0-.1 0-.2 0z"/></clipPath><clipPath id="e"><path d="m55.7 73.6.9.3c.1 0 .2.2.2.4 0 .3-.2.7-.5.8l-.9-.3c.3-.1.5-.4.5-.8.1-.2 0-.4-.2-.4z"/></clipPath><clipPath id="f"><path d="m56.1 75.1-.9-.3h.1z"/></clipPath><clipPath id="g"><path d="m54.5 81.2-.9-.3c-1.1-.4-1.9-1.6-1.8-3.3 0-2.6 1.7-5.2 3.7-6 .4-.1.8-.2 1.1-.2l.9.3c-.3 0-.7.1-1.1.2-2.1.8-3.7 3.5-3.7 6-.1 1.8.7 3 1.8 3.3z"/></clipPath><clipPath id="h"><path d="m56.2 62.1-.9-.3c.1-.2.1-.3.2-.4l.9.3c0 .1-.1.2-.2.4z"/></clipPath><clipPath id="i"><path d="m55.9 62.4-.9-.3c.1 0 .3-.2.4-.3l.9.3c-.2.1-.3.2-.4.3z"/></clipPath><clipPath id="j"><path d="m55.2 61 .9.3s.1 0 .1.1l-1-.4c.1.1.1 0 0 0z"/></clipPath><clipPath id="k"><path d="m55.7 62.4-.9-.3h.1l.9.3s0 0-.1 0z"/></clipPath><clipPath id="l"><path d="m55.6 62.4-.9-.3h.1l.9.3z"/></clipPath><clipPath id="m"><path d="m55.5 54.6.9.3h-.1c-.3 0-.6.2-.7.6l-.9-.3c.1-.3.5-.6.7-.6z"/></clipPath><clipPath id="n"><path d="m52.4 63.9-.9-.3c-.2-.1-.4-.4-.2-.8l.9.3c-.2.4 0 .7.2.8z"/></clipPath><circle cx="50" cy="50" fill="#c1c799" r="50"/><path d="m84.7 74.1-34.7 10.3v-13.7l34.7-10.3z" fill="#859900"/><path d="m50 84.4-34.7-10.3v-13.7l34.7 10.3z" fill="#434d00"/><path d="m50 70.7-34.7-10.3 34.7-10.4 34.7 10.4z" fill="#647300"/><path d="m84.7 56.9-34.7 10.3v-13.8l34.7-10.3z" fill="#859900"/><path d="m50 67.2-34.7-10.3v-13.8l34.7 10.3z" fill="#434d00"/><path d="m50 53.4-34.7-10.3 34.7-10.3 34.7 10.3z" fill="#647300"/><path d="m84.7 39.6-34.7 10.4v-13.8l34.7-10.3z" fill="#859900"/><path d="m50 50-34.7-10.4v-13.7l34.7 10.3z" fill="#434d00"/><path d="m50 36.2-34.7-10.3 34.7-10.3 34.7 10.3z" fill="#647300"/><g enableBackground="new"><g fill="#4d0008"><path d="m56.7 44.1-.8-.4.9-1.5.9.4z"/><path d="m56.6 41.6-.9-.5 1.1-1.7.9.5z"/><path d="m57.7 42.6-.9-.4-1.1-1.1.9.5z"/><path d="m54.5 44.8-.8-.5 1.1-1.7.8.5z"/><path d="m57.7 39.9-.9-.5-.9-.9.8.5z"/></g><g clipPath="url(#a)" enableBackground="new"><path d="m56.6 37.2-.9-.4h.4l.9.4c-.1 0-.3 0-.4 0" fill="#590009"/><path d="m57 37.2-.9-.4c.1 0 .3.1.4.1l.9.4c-.1 0-.3 0-.4-.1" fill="#5c0009"/><path d="m57.4 37.3-.9-.4c.1 0 .2.1.3.1l.9.4c-.1 0-.2 0-.3-.1" fill="#5f0009"/></g><path d="m55.6 40.7-.8-.5-1.1-1 .8.5z" fill="#4d0008"/><g clipPath="url(#b)" enableBackground="new"><path d="m53.6 46.5-.9-.5c-1-.5-1.7-1.7-1.7-3.3 0-2.5 1.5-5 3.5-5.7l.9.4c-2 .7-3.5 3.2-3.5 5.7 0 1.6.7 2.9 1.7 3.4" fill="#500008"/><path d="m55.5 37.4-.9-.4c.1 0 .1 0 .2-.1.2 0 .3-.1.4-.1l.9.4c-.1 0-.3.1-.4.1-.1.1-.2.1-.2.1" fill="#530008"/><path d="m56.1 37.2-.9-.4h.5l.9.4c-.2 0-.3 0-.5 0" fill="#560008"/><path d="m56.6 37.2-.9-.4z" fill="#590009"/></g><path d="m56.6 37.2c1.6 0 2.7 1.4 2.7 3.6 0 2.6-1.6 5.1-3.7 5.8-.3.1-.6.1-.9.1-1.6 0-2.8-1.4-2.8-3.6 0-2.6 1.6-5.1 3.7-5.8.4 0 .7-.1 1-.1zm1.1 5.4-1.1-1 1.1-1.7-1-.9-1.1 1.7-1.1-1-1 1.5 1.1 1-1.1 1.7 1 .9 1.1-1.7 1.1 1z" fill="#85000d"/></g><g enableBackground="new"><path d="m57.2 78.4-.9-.3-.1-.8.9.3z" fill="#004680"/><path d="m56.8 77.7-.9-.3v-1.7l.9.3z" fill="#004680"/><path d="m55.5 79.1-.9-.3 1.7-.7.9.3z" fill="#004985"/><path d="m56.8 76-.9-.3v-.8l.9.3z" fill="#004680"/><g clipPath="url(#c)" enableBackground="new"><path d="m57.5 71.7-.9-.3h.4l.9.3c-.2 0-.3 0-.4 0" fill="#005194"/><path d="m57.9 71.7-.9-.3c.1 0 .2 0 .4.1l.9.3c-.2 0-.3-.1-.4-.1" fill="#005499"/></g><g clipPath="url(#d)" enableBackground="new"><path d="m56.2 75.1-.9-.3z" fill="#005194"/><path d="m56.2 75.1-.9-.3h.1z" fill="#004e8f"/><path d="m56.3 75.1-.9-.3h.1z" fill="#004c8a"/><path d="m56.4 75.1-.9-.3z" fill="#004985"/></g><g clipPath="url(#e)" enableBackground="new"><path d="m56.4 75.1-.9-.3z" fill="#004c8a"/><path d="m56.4 75.1-.9-.3c.3-.1.5-.4.5-.8 0-.2-.1-.4-.2-.4l.9.3c.1 0 .2.2.2.4-.1.3-.3.7-.5.8" fill="#004985"/></g><g clipPath="url(#f)" enableBackground="new"><path d="m56.1 75.1-.9-.3z" fill="#005499"/><path d="m56.2 75.1-.9-.3h.1z" fill="#005194"/></g><path d="m55.5 76.5-.9-.3.4-.1.9.3z" fill="#004985"/><g clipPath="url(#g)" enableBackground="new"><path d="m54.5 81.2-.9-.3c-1.1-.4-1.9-1.6-1.8-3.3 0-2.6 1.7-5.2 3.7-6l.9.3c-2.1.8-3.7 3.5-3.7 6-.1 1.8.7 3 1.8 3.3" fill="#004985"/><path d="m56.4 71.9-.9-.3c.2-.1.4-.1.6-.2l.9.3c-.2.1-.4.1-.6.2z" fill="#004c8a"/><path d="m57 71.7-.9-.3h.5l.9.3c-.2 0-.4 0-.5 0" fill="#004e8f"/><path d="m57.5 71.7-.9-.3z" fill="#005194"/></g><path d="m57.5 71.7c1.5 0 2.6 1.3 2.6 3.4 0 2.6-1.7 5.2-3.7 6-.4.1-.8.2-1.1.2-1.5 0-2.6-1.3-2.6-3.4 0-2.6 1.7-5.2 3.7-6 .4-.1.7-.2 1.1-.2zm-2 7.4 1.7-.6-.1-.8-.3.1v-1.7-.9l-1.2.5v.9l.3-.1v1.7l-.3.1zm.9-5.2c-.2.1-.4.4-.5.8 0 .3.1.4.3.4h.2c.3-.1.5-.4.5-.8 0-.3-.1-.4-.3-.4-.1-.1-.2-.1-.2 0" fill="#007bdf"/></g><g enableBackground="new"><g clipPath="url(#h)" enableBackground="new"><path d="m56.2 62.1-.9-.3c.1-.2.1-.3.2-.4l.9.3c0 .1-.1.2-.2.4" fill="#858500"/></g><path d="m56.4 61.7-.9-.3-.2-.3.9.3z" fill="#808000"/><g clipPath="url(#i)" enableBackground="new"><path d="m55.9 62.4-.9-.3z" fill="#8a8a00"/><path d="m55.9 62.3-.9-.2c.1-.1.3-.2.3-.3l.9.3c-.1.1-.2.2-.3.2" fill="#858500"/></g><g clipPath="url(#j)" enableBackground="new"><path d="m56.2 61.4-.9-.3s-.1 0-.1-.1l1 .4c0-.1 0 0 0 0" fill="#858500"/></g><g clipPath="url(#k)" enableBackground="new"><path d="m55.7 62.4-.9-.3z" fill="#949400"/><path d="m55.7 62.4-.9-.3h.1z" fill="#8f8f00"/><path d="m55.8 62.4-.9-.3h.1z" fill="#8a8a00"/></g><g clipPath="url(#l)" enableBackground="new"><path d="m55.6 62.4-.9-.3z" fill="#990"/><path d="m55.7 62.4-.9-.3h.1z" fill="#949400"/></g><path d="m55.6 61.2-.9-.3.7-.2.9.3z" fill="#868600"/><path d="m56.3 61-.9-.3.1-3.5.9.3z" fill="#808000"/><g clipPath="url(#m)" enableBackground="new"><path d="m55.5 55.5-.9-.3c.1-.3.3-.5.5-.5l.9.3c-.2 0-.4.2-.5.5" fill="#858500"/><path d="m56.1 54.9-.9-.3h.1l.9.3c-.1 0-.1 0-.1 0" fill="#8a8a00"/><path d="m56.2 54.9-.9-.3h.1z" fill="#8f8f00"/><path d="m56.2 54.9-.9-.3h.1l.8.3c.1 0 .1 0 0 0z" fill="#949400"/><path d="m56.3 54.9-.9-.3h.1z" fill="#990"/></g><path d="m52.2 63-.9-.2 3.3-7.6.9.3z" fill="#808000"/><g clipPath="url(#n)" enableBackground="new"><path d="m52.4 63.9-.9-.3c-.2-.1-.4-.4-.2-.8l.9.3c-.2.4 0 .7.2.8" fill="#858500"/></g><path d="m59.5 60.6c.3.3 0 .9-.5 1.1l-6.2 2.2c-.1 0-.1 0-.2 0-.3 0-.5-.4-.4-.9l3.3-7.6c.1-.3.5-.6.7-.6.1 0 .2.1.3.2zm-3.2.4.2-3.4-.8.3v3.4zm-.1 1.1c.1-.2.1-.3.2-.4l-.1-.3s-.1-.1-.2-.1h-.1c-.1.1-.3.2-.4.3s-.1.2-.2.4l.1.3s.1.1.2.1h.1c.2-.1.3-.2.4-.3" fill="#dfdf00"/></g><g enableBackground="new" opacity=".6"><path d="m73.6 54.6v3.3l-11.9 3.7v-3.3z" fill="#748500"/><path d="m61.7 61.6-.6-.3v-3.3l.6.3z" fill="#434d00"/><path d="m61.7 58.3-.6-.3 11.9-3.7.6.3z" fill="#465100"/></g><g enableBackground="new" opacity=".6"><path d="m81.7 47.4v3.3l-20 6.3v-3.3z" fill="#748500"/><path d="m61.7 57-.6-.3v-3.3l.6.3z" fill="#434d00"/><path d="m61.7 53.7-.6-.3 20-6.3.6.3z" fill="#465100"/></g><g enableBackground="new" opacity=".6"><path d="m73.6 38v3.3l-11.9 3.7v-3.3z" fill="#748500"/><path d="m61.7 45-.6-.3v-3.3l.6.3z" fill="#434d00"/><path d="m61.7 41.7-.6-.3 11.9-3.7.6.3z" fill="#465100"/></g><g enableBackground="new" opacity=".6"><path d="m81.7 30.8v3.3l-20 6.3v-3.3z" fill="#748500"/><path d="m61.7 40.4-.6-.3v-3.3l.6.3z" fill="#434d00"/><path d="m61.7 37.1-.6-.3 20-6.3.6.3z" fill="#465100"/></g><g enableBackground="new" opacity=".6"><path d="m73.6 71.7v3.3l-11.9 3.7v-3.3z" fill="#748500"/><path d="m61.7 78.7-.6-.3v-3.3l.6.3z" fill="#434d00"/><path d="m61.7 75.4-.6-.3 11.9-3.7.6.3z" fill="#465100"/></g><g enableBackground="new" opacity=".6"><path d="m81.7 64.5v3.3l-20 6.3v-3.3z" fill="#748500"/><path d="m61.7 74.1-.6-.3v-3.3l.6.3z" fill="#434d00"/><path d="m61.7 70.8-.6-.3 20-6.3.6.3z" fill="#465100"/></g></svg>
            <h2 className="u-floatLeft">Franz Enzenhofer SEO Live Test</h2>
              <span className="u-floatRight" ><a  target="_blank"  href={chrome.extension.getURL('rules.html')}>
                <button className="Button Button--haptic u-floatLeft">&#9881; Settings</button>
              </a>
            <a onClick={this.closePanelClick} href="#">
              <button className="Button Button--haptic u-floatLeft">Close</button>
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
