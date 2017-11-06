import React from 'react';
import ReactDOM from 'react-dom';

import Popup from './components/Popup/Popup';

import { activeForTab } from './utils/activeForTab';

const toggleHidden = (tabId) => {
  chrome.storage.local.get((data) => {
    const hiddenPanels = data['hidden-panels'] || [];
    const newHiddenPanels = hiddenPanels.indexOf(tabId) === -1 ? hiddenPanels.concat(tabId) : hiddenPanels.filter(hp => Number(hp) !== Number(tabId));
    chrome.storage.local.set({ 'hidden-panels': newHiddenPanels }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
        self.close();
      });
    });
  });
};

const toggleSite = (site, disabled) => {
  chrome.storage.local.get((data) => {
    const newMode = data.mode !== 'CUSTOM' ? 'CUSTOM' : data.mode;

    const sites = (data.sites || '').split('\n');
    const escapedSite = site.replace(/\*/g, '\\*').replace(/\/$/, '');
    const siteIndex = sites.findIndex(s => s.match(new RegExp(`!?${escapedSite}`)));

    if (siteIndex !== -1) {
      const entry = sites[siteIndex];
      if (entry.match(/^!/)) {
        sites.splice(siteIndex, 1);
      } else {
        sites[siteIndex] = `!${entry}`;
      }
    } else {
      sites.push(`${disabled ? '' : '!'}${site.replace(/\/$/, '')}`);
    }

    chrome.storage.local.set({ sites: sites.join('\n'), mode: newMode }, () => {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
        self.close();
      });
    });
  });
};

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (res) => {
  const { id, url } = res[0];
  activeForTab({ url, id }).then(({ hidden, disabled }) => {
    const location = document.createElement('a');
    location.href = url;
    ReactDOM.render(<Popup location={location} disabled={disabled} hidden={hidden} onToggleSite={(site) => toggleSite(site, disabled)} onToggleHidden={() => toggleHidden(id)} />, document.getElementById('app'));
  });
});
