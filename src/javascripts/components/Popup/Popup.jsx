import React from 'react';

export default function Popup({ location, disabled, hidden, onToggleSite, onToggleHidden }) {
  const sites = [
    [`${location.host}/*`, `${location.protocol}//${location.host}*`],
    [`*.${location.host.replace(/^www./, '')}/*`, `${location.protocol}//*${location.host.replace(/^www./, '')}*`],
    ['this page', `${location.href}`],
  ];
  return (
    <div>
      <p>{disabled ? 'Run tests on' : 'Never run tests on'}</p>
      <ul>
        {sites.map(([text, site]) => <li><a href="#" onClick={() => onToggleSite(site)}>{text}</a></li>)}
      </ul>
      <button onClick={onToggleHidden}>{hidden ? 'Run in the current tab' : 'Don\'t run in the current tab'}</button>
      <button onClick={() => window.open(chrome.extension.getURL('rules.html'), '_blank')}>Settings</button>
    </div>
  );
}
