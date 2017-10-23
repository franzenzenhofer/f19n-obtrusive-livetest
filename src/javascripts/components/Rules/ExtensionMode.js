import React, { Component } from 'react';

export default class ExtensionMode extends Component {
  render() {
    const { mode, onChange } = this.props;
    return (
      <div className="Header-subHeader Mode-Section">
        <div className="Wrapper">
          <h2>Extension mode</h2>
          <div className="radios">
            <label>
              <input type="radio" onChange={() => onChange('ALL')} checked={mode === 'ALL'} />
              Run on every site
            </label>
            <label>
              <input type="radio" onChange={() => onChange('CUSTOM')} checked={mode === 'CUSTOM'} />
              Use custom configuration (black/whitelist)
            </label>
            <label>
              <input type="radio" onChange={() => onChange('DISABLED')} checked={mode === 'DISABLED'} />
              Disabled
            </label>
          </div>
        </div>
      </div>
    );
  }
}
