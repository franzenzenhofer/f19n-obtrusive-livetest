import React from 'react';
import ReactDOM from 'react-dom';

import Popup from './components/Popup/Popup';

const check = (sites, url) => {
  const entry = sites.reverse().find((l) => {
    const regexp = `\^${l}\$`.replace(/\*/g, '[^ ]*').replace('!', '');
    return url.match(new RegExp(regexp));
  });
  return entry ? (entry.match(/^!.+/) !== null ? false : true) : false;
};

const panelShouldBeVisible = (data, tabId, path) => {
  const hiddenPanels = data['hidden-panels'] || [];
  const enabledSites = data.sites;
  const enabledSite = check(enabledSites.split('\n'), path);
  const hidden = hiddenPanels.indexOf(tabId) !== -1;
  return { hidden, disabled: !enabledSite };
};

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

    chrome.storage.local.set({ sites: sites.join('\n') }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
        self.close();
      });
    });
  });
};

chrome.tabs.query({ active: true }, (res) => {
  const { url, id: tabId } = res[0];
  chrome.storage.local.get((data) => {
    const { disabled, hidden } = panelShouldBeVisible(data, tabId, url);
    const location = document.createElement('a');
    location.href = url;
    ReactDOM.render(<Popup location={location} disabled={disabled} hidden={hidden} onToggleSite={(site) => toggleSite(site, disabled)} onToggleHidden={() => toggleHidden(tabId)} />, document.getElementById('app'));
  });
});
