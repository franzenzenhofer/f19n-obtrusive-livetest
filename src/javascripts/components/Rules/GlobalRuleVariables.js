import React, { Component } from 'react';

export default class GlobalRuleVariables extends Component {
  render() {
    const { onChange, entries } = this.props;

    const renderInput = ({ label, name, value }) => {
      return (
        <div className="" key={`${name}`}>
          <label>{label}
            <input type="text" onChange={onChange(name)} value={value} />
          </label>
        </div>
      );
    };

    return (
      <div className="Header-subHeader Section sites">
        <div className="Wrapper">
          <h2>Global rule variables</h2>
          {entries.map(renderInput)}
          <button className="Button Button--haptic" onClick={() => {}}>Apply</button>
        </div>
      </div>
    );
  }
}
