/* global $, document, window */
import Frame from 'react-frame-component';
import Draggable from 'draggable';

import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './components/Panel/Panel';
import { activeForTab } from './utils/activeForTab';
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

// this  defines the area where the dragevent can start
const $appRoot = $('<style>#f19n-panel-root:before { content: " "; cursor: move; position: absolute; left: 0; top: 0; width: calc(100% - 90px); height: 20px; background: transparent;}</style><div id="f19n-panel-root"></div>').css({
  position: 'fixed',
  width: '350px',
  zIndex: 900002,
  backgroundColor: 'white',
  borderColor: 'lightgray',
  border: '1px solid',
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

const getAppRootElement = () => {
  return document.getElementById('f19n-panel-root');
};

const getLimitBoundings = (prev = false) => {
  return {
    x: [10, (prev ? window.prevInnerWidth : window.innerWidth) - 10 - $(getAppRootElement()).width()],
    y: [10, (prev ? window.prevInnerHeight : window.innerHeight) - 10 - $(getAppRootElement()).height()],
  };
};

const getPanelPosition = (data, host) => {
  return data[`panel-position-${host}`] || [getLimitBoundings().x[1], getLimitBoundings().y[0]];
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

const setPrevWindowSize = () => {
  window.prevInnerWidth = window.innerWidth;
  window.prevInnerHeight = window.innerHeight;
};

const initializePanel = ({ position, host }) => {
  const setLimit = (draggablePanel) => {
    const limit = getLimitBoundings();
    draggablePanel.setOption('limit', limit);
  };

  const snapPanel = (draggablePanel) => {
    const panelOffset = $(getAppRootElement()).offset();
    const limit = getLimitBoundings();
    const prevLimit = getLimitBoundings(true);

    let { x, y } = draggablePanel.get();

    const sizeUpX = prevLimit.x[1] < limit.x[1];
    const sizeUpY = prevLimit.y[1] < limit.y[1];

    if (limit.x[1] <= panelOffset.left || (sizeUpX && prevLimit.x[1] === x)) {
      x = limit.x[1];
    }

    if (limit.y[1] <= panelOffset.top - $(window).scrollTop() || (sizeUpY && prevLimit.y[1] === y)) {
      y = limit.y[1];
    }

    if (y < limit.y[0]) { y = limit.y[0]; }
    if (x < limit.x[0]) { x = limit.x[0]; }

    draggablePanel.set(x, y);
    chrome.storage.local.set({ [`panel-position-${host}`]: [x, y] });
  };

  const draggablePanel = new Draggable(getAppRootElement(), {
    setPosition: false,
    onDragEnd: (element, x, y) => {
      chrome.storage.local.set({ [`panel-position-${host}`]: [x, y] });
    },
  });

  const getPanelIFrameHeight = () => {
    return $(getAppRootElement()).find('iframe').get(0).contentDocument.querySelector('#panel').offsetHeight + 28;
  }

  draggablePanel.set(position[0], position[1]);
  setLimit(draggablePanel);

  window.addEventListener('message', () => {
    $(getAppRootElement()).css({ height: Math.min(window.innerHeight - 20, getPanelIFrameHeight()) });
    setLimit(draggablePanel);
    snapPanel(draggablePanel);
  });

  $(window).on('resize', () => {
    $(getAppRootElement()).css({ height: Math.min(window.innerHeight - 20, getPanelIFrameHeight()) });
    setLimit(draggablePanel);
    snapPanel(draggablePanel);
    setPrevWindowSize();
  });
};

const init = () => {
  setPrevWindowSize();
  chrome.storage.local.get((data) => {
    getTab(({ url, tabId }) => {
      activeForTab({ id: tabId, url }).then(({ hidden, disabled }) => {
        const host = (new URL(url)).host;
        const visible = !hidden && !disabled;
        const position = getPanelPosition(data, host);
        const onMount = () => {
          initializePanel({ position, host });
        };
        if (visible) {
          chrome.runtime.sendMessage({ event: 'requestSetIcon', data: { tabId, path: chrome.extension.getURL('images/icon.png') } });
          showPanel(url, tabId, onMount);
        } else {
          chrome.runtime.sendMessage({ event: 'requestSetIcon', data: { tabId, path: chrome.extension.getURL('images/icon-inactive.png') } });
          hidePanel();
        }
      });
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
