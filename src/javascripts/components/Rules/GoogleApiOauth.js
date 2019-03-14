import React, { Component } from 'react';

export default class GoogleApiOauth extends Component {
  render() {
    const { onRevoke, onConnect, connected } = this.props;

    return (
      <div className="Header-subHeader Section sites">
        <div className="Wrapper">
          <h2>Connect with Google</h2>
          {!connected && <button className="Button Button--haptic" onClick={onConnect}>Sign in with Google</button>}
          {connected && <button className="Button Button--haptic" onClick={onRevoke}>Revoke Google access</button>}
        </div>
      </div>
    );
  }
}
