/* global $ */
import Draggable from 'draggable';

const header = `
  <div class="Header">
    <div class="Header-brand u-cf">
      <svg class="ic u-floatLeft" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6E772F" d="M11.7 17.2L2 15l10.2-2.4L22 15"/><path fill="#4F5429" d="M11.7 21.7L2 19.5V15l9.7 2.2"/><path fill="#8E9A34" d="M22 19.5l-10.3 2.2v-4.5L22 15"/><g><path fill="#6E772F" d="M11.7 12L2 9.7l10.2-2.3L22 9.8"/><path fill="#4F5429" d="M11.7 16.5L2 14.2V9.7l9.7 2.3"/><path fill="#8E9A34" d="M22 14.3l-10.3 2.2V12L22 9.8"/></g><g><path fill="#6E772F" d="M11.7 6.9L2 4.6l10.2-2.3L22 4.7"/><path fill="#4F5429" d="M11.7 11.4L2 9.1V4.6l9.7 2.3"/><path fill="#8E9A34" d="M22 9.2l-10.3 2.2V6.9L22 4.7"/></g></svg>
      <h2 class="u-floatLeft">Loading …</h2>
      <a class="u-floatRight close-panel" href="#">
        <svg class="ic ic-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      </a>
    </div>
  </div>
`;

const panelUrl = chrome.extension.getURL('panel.html');
const $panelWrapper = $(`<div class="f19n-panel-wrapper">${header}<iframe src='${panelUrl}'></iframe></div>`);
const $iframe = $panelWrapper.find('iframe');

$iframe.on('load', () => {
  $panelWrapper.find('h2').text('Obtrusive Live Test');
  $(window).trigger('resize');
});

const getTab = (callback) => {
  chrome.runtime.sendMessage('tabIdPls', (response) => {
    callback(response);
  });
};

const handleClosePanelRequest = () => {
  getTab(({ tabId }) => {
    chrome.storage.local.get('hidden-panels', (data) => {
      const hiddenPanels = (data['hidden-panels'] || []).concat([tabId]);
      chrome.storage.local.set({ 'hidden-panels': hiddenPanels });
    });
  });
};

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

const getPanelPosition = (data, host) => {
  return data[`panel-position-${host}`] || [10, 10];
};

const showPanel = () => {
  if (!$('.f19n-panel-wrapper').length) {
    $('body').append($panelWrapper);
  }
  $panelWrapper.find('a.close-panel').on('click', handleClosePanelRequest);
};

const hidePanel = () => {
  $panelWrapper.remove();
  $panelWrapper.find('a.close-panel').off('click', handleClosePanelRequest);
};

const getLimitBoundings = () => {
  return {
    x: [10, window.innerWidth - 10 - $panelWrapper.width()],
    y: [10, window.innerHeight - 10 - $panelWrapper.height()],
  };
};

const initializePanel = ({ position, host }) => {
  const setLimit = (draggablePanel) => {
    const limit = getLimitBoundings();
    draggablePanel.setOption('limit', limit);
  };

  const snapPanel = (draggablePanel) => {
    const panelOffset = $panelWrapper.offset();
    const limit = getLimitBoundings();

    const { x, y } = draggablePanel.get();

    if (limit.x[1] <= panelOffset.left) {
      draggablePanel.set(limit.x[1], y);
      chrome.storage.local.set({ [`panel-position-${host}`]: [limit.x[1], y] });
    }

    if (limit.y[1] <= panelOffset.top - $(window).scrollTop()) {
      draggablePanel.set(x, limit.y[1]);
      chrome.storage.local.set({ [`panel-position-${host}`]: [x, limit.y[1]] });
    }
  };

  const draggablePanel = new Draggable($panelWrapper.get(0), {
    setPosition: false,
    onDragEnd: (element, x, y) => {
      chrome.storage.local.set({ [`panel-position-${host}`]: [x, y] });
    },
  });

  draggablePanel.set(position[0], position[1]);
  setLimit(draggablePanel);

  window.addEventListener('message', (result) => {
    const { height } = result.data;
    $iframe.css({ height: Math.min(window.innerHeight - 20, height) });
    setLimit(draggablePanel);
    snapPanel(draggablePanel);
  });

  $(window).on('resize', () => {
    setLimit(draggablePanel);
    snapPanel(draggablePanel);
  });
};

chrome.storage.local.get((data) => {
  getTab(({ url, tabId }) => {
    const host = (new URL(url)).host;
    const visible = panelShouldBeVisible(data, tabId);
    const position = getPanelPosition(data, host);
    initializePanel({ position, host });
    if (visible) { showPanel(); }
  });
});

chrome.storage.onChanged.addListener((data) => {
  getTab(({ tabId }) => {
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
