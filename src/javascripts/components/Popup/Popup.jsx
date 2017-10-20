import React from 'react';

export default function Popup({ location, disabled, hidden, onToggleSite, onToggleHidden }) {
  let sites = [];

  const withoutTld = location.host
    // Replace www. at the beginning if present
    .replace(/^www./, '')
    // Split by '.' to get domain parts
    .split('.')
    // Remove the last part probably the TLD
    .slice(0, -1);
  const tld = location.host.split('.').slice(-1)[0];
  const subdomainCombinations = withoutTld.map((part, index) => {
    return [`*.${withoutTld.slice(index).join('.')}.${tld}/*`, `${location.protocol}//*.${withoutTld.slice(index).join('.')}.${tld}*`];
  });

  sites = sites.concat(
    [[`${location.host}/*`, `${location.protocol}//${location.host}*`]],
    subdomainCombinations,
    [['this page', `${location.href}`]]
  );

  return (
    <div>
      <h3>{disabled ? 'Run tests on' : 'Never run tests on'}</h3>
      <ul>
        {sites.map(([text, site]) => <li><a href="#" onClick={() => onToggleSite(site)}>{text}</a></li>)}
      </ul>
      <button className="Button Button--haptic" onClick={onToggleHidden}>{hidden ? 'Run in the current tab' : 'Don\'t run in the current tab'}</button>
      <button className="Button Button--haptic" onClick={() => window.open(chrome.extension.getURL('rules.html'), '_blank')}>Settings</button>
    </div>
  );
}
