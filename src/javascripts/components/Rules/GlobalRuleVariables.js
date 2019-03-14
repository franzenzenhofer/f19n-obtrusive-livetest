import React, { Component } from 'react';

export default class GlobalRuleVariables extends Component {
  render() {
    const { onChange, entries } = this.props;

    const renderInput = ({ label, name, value, url, msg }) => {
      return (
        <li key={`${name}`}><div>
          <label>
            <input id={name} type="text" onChange={onChange(name)} value={value} />&nbsp; {label} {url &&
              <a href={url} target="_blank">{url}</a>
            } {msg &&
              <span>- {msg}</span>
            }
          </label>
        </div></li>
      );
    };

    return (
      <div className="Header-subHeader Section sites">
        <div className="Wrapper">
          <h2>Global Variables</h2>
          <ul>
          {entries.map(renderInput)}
          </ul>
          <button className="Button Button--haptic" onClick={() => {}}>Apply</button>
        </div>
      </div>
    );
  }
}
