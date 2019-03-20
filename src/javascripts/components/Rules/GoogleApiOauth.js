import React, { Component } from 'react';

export default class GoogleApiOauth extends Component {
  render() {
    const { onRevoke, onConnect, connected } = this.props;

    return (
      <div className="Header-subHeader Section sites">
        <div className="Wrapper">
          <h2>Google OAuth - Connect this App with Google Search Console and Google Analytics</h2>
          {!connected && <div><button className="Button Button--haptic" onClick={onConnect}>Sign in with Google</button> - Currently not connected!</div>}
          {connected && <div><button className="Button Button--haptic" onClick={onRevoke}>Revoke Google access</button> - You are currently connected.</div>}
        </div>
      </div>
    );
  }
}
