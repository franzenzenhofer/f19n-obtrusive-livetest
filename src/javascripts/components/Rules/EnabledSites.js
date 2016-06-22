import React, { Component } from 'react';

export default class EnabledSites extends Component {
  render() {
    return (
      <div className="Header-subHeader Section sites">
        <div className="Wrapper">
          <h2>Enabled sites</h2>
          <textarea style={{ height: 50, width: '100%' }} defaultValue={this.props.sites} onChange={(e) => this.props.onChange(e.target.value)} />
          <button className="Button Button--haptic" onclick={(e) => this.props.onChange(e.target.value)}>Apply</button>
        </div>
      </div>
    );
  }
}
