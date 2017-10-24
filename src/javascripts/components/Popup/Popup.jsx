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
      <header>
        <svg className="logo" viewBox="0 0 100 100"><circle fill="#1783E5" cx="50" cy="50" r="48"></circle><path fill="#E6E6E6" d="M74.5 83.2H38.2V20.4h36.3c2.7 0 4.8 2.1 4.8 4.8v53.1c0 2.7-2.2 4.9-4.8 4.9z"></path><path fill="#B3B3B3" d="M40.2 26.4h35.5v4H40.2zM40.2 31.1h21.1v4H40.2zM40.2 40.8h35.5v4H40.2zM40.2 45.5h21.1v4H40.2zM40.2 54.6h35.5v4H40.2zM40.2 59.4h21.1v4H40.2zM40.2 68.9h35.5v4H40.2zM40.2 73.6h21.1v4H40.2z"></path><path fill="#FFF" d="M42.2 79.9H27.6c-2.7 0-4.8-2.1-4.8-4.8V22c0-2.7 2.1-4.8 4.8-4.8h14.7v62.7z"></path><path fill="#F05228" d="M32.7 22c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4S35.7 22 32.7 22zm3 6.9l-1.4 1.4-1.6-1.6-1.6 1.6-1.4-1.4 1.6-1.6-1.6-1.6 1.4-1.4 1.6 1.6 1.6-1.6 1.4 1.4-1.6 1.6 1.6 1.6z"></path><path fill="#1783E5" d="M32.7 50.4c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7s-.3.7-.7.7c-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.7h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1zM32.7 64.6c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.8h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1z"></path><path fill="#FAC917" d="M37.3 44.9l-4.5-7.7c-.3-.6-1.2-.5-1.5 0l-4.5 7.6c-.3.6.2 1.2.8 1.2h9c.7 0 1.1-.6.7-1.1zM32.7 40l-.1 4h-1l-.1-4h1.2zm-.1 5.3c-.1.1-.3.2-.5.2s-.4-.1-.5-.2c-.1-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4.1-.1.3-.2.5-.2s.4.1.5.2c.1.1.2.3.2.4 0 .1-.1.2-.2.4z"></path><path fill="#666" d="M38.2 83.2v-3.3h4z"></path></svg>
        <h1>Obtrusive Live Test</h1>
      </header>
      <h3>{disabled ? 'Run tests on' : 'Never run tests on'}</h3>
      <ul>
        {sites.map(([text, site]) => <li><a href="#" onClick={() => onToggleSite(site)}>{text}</a></li>)}
      </ul>
      <div className="popup-actions">
        <button className="Button Button--haptic" onClick={onToggleHidden}>{hidden ? 'Run in the current tab' : 'Don\'t run in the current tab'}</button>
        <button className="Button Button--haptic" onClick={() => window.open(chrome.extension.getURL('rules.html'), '_blank')}>Settings</button>
      </div>
    </div>
  );
}
