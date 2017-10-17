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

const panelShouldBeVisible = (data, tabId) => {
  const hiddenPanels = data['hidden-panels'] || [];
  const enabledSites = data.sites;
  const enabledSite = check(enabledSites.split('\n'), document.location.href);
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
}

chrome.tabs.query({ active: true }, (res) => {
  const { url, id: tabId } = res[0];
  chrome.storage.local.get((data) => {
    const { disabled, hidden } = panelShouldBeVisible(data, tabId);
    const location = document.createElement('a');
    location.href = url;
    ReactDOM.render(<Popup location={location} disabled={disabled} hidden={hidden} onToggleHidden={() => toggleHidden(tabId)} />, document.getElementById('app'));
  });
});
