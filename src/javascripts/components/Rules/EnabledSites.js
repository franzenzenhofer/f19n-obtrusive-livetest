import React, { Component } from 'react';

import Config from './../../config';

export default class EnabledSites extends Component {
  render() {
    const { enabled, onChange, sites } = this.props;
    return (
      <div className="Header-subHeader Section sites">
        <div className="Wrapper">
          <h2>Enabled sites - Whitelist / Blacklist</h2><div>Blacklisted URL-schemas start with !</div>
          <textarea disabled={!enabled} style={{ height: 100, width: '100%' }} value={sites} onChange={(e) => onChange(e.target.value)} />
          <p>
            <button className="Button Button--haptic" onClick={(e) => onChange(sites)}>Apply</button>
            &nbsp;
            <a href="#" onClick={() => confirm('Sure? All custom site configurations will be gone!') && onChange(Config.defaults.sites)}>Reset to default configuration</a>
          </p>
        </div>
      </div>
    );
  }
}
