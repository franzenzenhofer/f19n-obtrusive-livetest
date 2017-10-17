import React from 'react';

export default function Popup({ location, disabled, hidden, onToggleHidden }) {
  return (
    <div>
      <p>Never run tests on</p>
      <button onClick={onToggleHidden}>{hidden ? 'Run in the current tab' : 'Don\'t run in the current tab'}</button>
    </div>
  );
}
