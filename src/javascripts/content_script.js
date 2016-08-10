/* global $ */
import Draggable from 'Draggable';

const panelUrl = chrome.extension.getURL('panel.html');
const $panelWrapper = $(`<div class="f19n-panel-wrapper"><h4>Loading f19n Livetest ...</h4><iframe src='${panelUrl}'></iframe></div>`);
const $iframe = $panelWrapper.find('iframe');

// $iframe.on('load', () => {
//   $panelWrapper.find('h4').remove();
// });

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
  let hidden = hiddenPanels.indexOf(tabId) !== -1;
  hidden = hidden || !enabledSite;
  return !hidden;
};

const getTabId = (callback) => {
  chrome.runtime.sendMessage('tabIdPls', (response) => {
    callback(response.tabId);
  });
};

const getPanelPosition = (data, tabId) => {
  return data[`panel-position-${tabId}`] || [10, 10];
};

const showPanel = () => {
  if (!$('.f19n-panel-wrapper').length) {
    $('body').append($panelWrapper);
  }
};

const hidePanel = () => {
  $panelWrapper.remove();
};

const initializePanel = ({ position, tabId }) => {
  const setLimit = (draggablePanel) => {
    const limit = { x: [10, window.innerWidth - 10 - $panelWrapper.width()], y: [10, window.innerHeight - 10 - $panelWrapper.height()] };
    draggablePanel.setOption('limit', limit);
  };

  const draggablePanel = new Draggable($panelWrapper.get(0), {
    setPosition: false,
    onDragEnd: (element, x, y) => {
      chrome.storage.local.set({ [`panel-position-${tabId}`]: [x, y] });
    },
  });

  draggablePanel.set(position[0], position[1]);
  setLimit(draggablePanel);

  $(window).on('resize', () => {
    setLimit(draggablePanel);
  });
};

chrome.storage.local.get((data) => {
  getTabId((tabId) => {
    const visible = panelShouldBeVisible(data, tabId);
    const position = getPanelPosition(data, tabId);
    initializePanel({ position, tabId });
    if (visible) { showPanel(); }
  });
});

chrome.storage.onChanged.addListener((data) => {
  getTabId((tabId) => {
    if (Object.keys(data)[0] === 'hidden-panels') {
      const hiddenPanels = data['hidden-panels'].newValue || [];
      const hidden = hiddenPanels.indexOf(tabId) !== -1;
      if (hidden) {
        hidePanel();
      } else {
        showPanel();
      }
    }
  });
});
