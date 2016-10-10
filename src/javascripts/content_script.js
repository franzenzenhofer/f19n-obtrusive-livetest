/* global $ */
import Frame from 'react-frame-component';
import Draggable from 'draggable';

import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './components/Panel/Panel';

import resultStoreKey from './utils/resultStoreKey';

const FRAME_TEMPLATE = `
  <html>
    <head>
      <link href="${chrome.extension.getURL('css/normalize.css')}" rel="stylesheet" type="text/css" />
      <link href="${chrome.extension.getURL('css/panel.css')}" rel="stylesheet" type="text/css" />
      <base target="_top" />
    <body>
      <div id="panel"></div>
    </body>
  </html>
`;

const $appRoot = $('<style>#f19n-panel-root:before { content: " "; cursor: move; position: absolute; left: 0; top: 0; width: calc(100% - 20px); height: 20px; background: transparent;}</style><div id="f19n-panel-root"></div>').css({
  position: 'fixed',
  top: '10px',
  left: '10px',
  width: '350px',
  zIndex: 99999,
  backgroundColor: 'white',
  borderColor: 'lightgray',
  border: '1px solid',
  maxHeight: '300px'
});
//  boxShadow: '0px 0px 8px rgba(0,0,0,1)',


const check = (sites, url) => {
  const entry = sites.reverse().find((l) => {
    const regexp = `\^${l}\$`.replace(/\*/g, '[^ ]*').replace('!', '');
    return url.match(new RegExp(regexp));
  });
  return entry ? (entry.match(/^!.+/) !== null ? false : true) : false;
};

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

const panelShouldBeVisible = (data, tabId) => {
  const hiddenPanels = data['hidden-panels'] || [];
  const enabledSites = data.sites;
  const enabledSite = check(enabledSites.split('\n'), document.location.href);
  let hidden = hiddenPanels.indexOf(tabId) !== -1;
  hidden = hidden || !enabledSite;
  return !hidden;
};

const getAppRootElement = () => {
  return document.getElementById('f19n-panel-root');
};

const getPanelPosition = (data, host) => {
  return data[`panel-position-${host}`] || [10, 10];
};

const showPanel = (url, tabId, onMount) => {
  if (!$('#f19n-panel-root').length) {
    $('body').append($appRoot.clone());

    const storeKey = resultStoreKey(tabId);
    chrome.storage.local.get(storeKey, (data) => {
      const results = data[storeKey] || [];
      const node = document.getElementById('f19n-panel-root');
      ReactDOM.render(<Frame contentDidMount={onMount} style={{ border: 'none', width: '100%', height: '100%' }} initialContent={FRAME_TEMPLATE} mountTarget="#panel"><Panel onClosePanelRequest={handleClosePanelRequest} storeKey={storeKey} results={results} url={url} /></Frame>, node);
    });
  }
  $(getAppRootElement()).find('a.close-panel').on('click', handleClosePanelRequest);
};

const hidePanel = () => {
  $(getAppRootElement()).find('a.close-panel').off('click', handleClosePanelRequest);
  $(getAppRootElement()).remove();
};

const getLimitBoundings = () => {
  return {
    x: [10, window.innerWidth - 10 - $(getAppRootElement()).width()],
    y: [10, window.innerHeight - 10 - $(getAppRootElement()).height()],
  };
};

const initializePanel = ({ position, host }) => {
  const setLimit = (draggablePanel) => {
    const limit = getLimitBoundings();
    draggablePanel.setOption('limit', limit);
  };

  const snapPanel = (draggablePanel) => {
    const panelOffset = $(getAppRootElement()).offset();
    const limit = getLimitBoundings();

    var { x, y } = draggablePanel.get();

    if (limit.x[1] <= panelOffset.left) {
      x = limit.x[1];
      //draggablePanel.set(limit.x[1], y);
      //chrome.storage.local.set({ [`panel-position-${host}`]: [limit.x[1], y] });
    }

    if (limit.y[1] <= panelOffset.top - $(window).scrollTop()) {
      y = limit.y[1];
      //draggablePanel.set(x, limit.y[1]);
      //chrome.storage.local.set({ [`panel-position-${host}`]: [x, limit.y[1]] });
    }

    if(y < limit.y[0]) { y = limit.y[0]; }
    if(x < limit.x[0]) { x = limit.x[0]; }

    draggablePanel.set(x, y);
    chrome.storage.local.set({ [`panel-position-${host}`]: [x, y] });
  };

  const draggablePanel = new Draggable(getAppRootElement(), {
    setPosition: false,
    onDragEnd: (element, x, y) => {
      chrome.storage.local.set({ [`panel-position-${host}`]: [x, y] });
    },
  });

  draggablePanel.set(position[0], position[1]);
  setLimit(draggablePanel);

  window.addEventListener('message', () => {
    const height = $(getAppRootElement()).find('iframe').get(0).contentDocument.querySelector('#panel').offsetHeight;
    $(getAppRootElement()).css({ height: Math.min(window.innerHeight - 20, height) });
    setLimit(draggablePanel);
    snapPanel(draggablePanel);
  });

  $(window).on('resize', () => {
    setLimit(draggablePanel);
    snapPanel(draggablePanel);
  });
};

const init = () => {
  chrome.storage.local.get((data) => {
    getTab(({ url, tabId }) => {
      const host = (new URL(url)).host;
      const visible = panelShouldBeVisible(data, tabId);
      const position = getPanelPosition(data, host);
      const onMount = () => {
        initializePanel({ position, host });
      };
      if (visible) {
        showPanel(url, tabId, onMount);
      } else {
        hidePanel();
      }
    });
  });
};

chrome.storage.onChanged.addListener((data) => {
  getTab(() => {
    if (Object.keys(data)[0] === 'hidden-panels') {
      init();
    }
  });
});

init();
