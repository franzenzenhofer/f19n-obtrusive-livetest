import $ from 'npm-zepto';

const panelUrl = chrome.extension.getURL('panel.html');
const $panelWrapper = $(`<div class="f19n-panel-wrapper"><iframe src='${panelUrl}'></iframe></div>`);
let hidden = false;
let tabId = null;

const fixAbsolutePositionedElements = () => {
  // TODO: Not the perfect solution in terms of performance. Maybe use TreeWalker.
  const wrapperWidth = $panelWrapper.width();
  $('*').each((index, element) => {
    if (!$(element).hasClass('f19n-panel-wrapper') && $(element).css('position') === 'fixed' && $(element).css('left') === '0px') {
      $(element).data('f19n-fix-original-left', $(element).css('left')).css({ left: wrapperWidth });
    }
  });
};

const unfixAbsolutePositionedElements = () => {
  $('[data=f19n-fix-original-left]').each((index, element) => {
    const originalLeft = $(element).data('f19n-fix-original-left');
    $(element).removeData('f19n-fix-original-left').css({ left: originalLeft });
  });
};

const showPanel = () => {
  if (!$('.f19n-panel-wrapper').length) {
    $('html').addClass('show-f19n-panel');
    $('body').append($panelWrapper);
    fixAbsolutePositionedElements();
  }
};

const hidePanel = () => {
  $('html').removeClass('show-f19n-panel');
  $panelWrapper.remove();
  unfixAbsolutePositionedElements();
};

const initialize = () => {
  if (!hidden) {
    $('html').addClass('show-f19n-panel');
  }
};

chrome.storage.local.get('hidden-panels', (data) => {
  chrome.runtime.sendMessage('tabIdPls', (response) => {
    const hiddenPanels = data['hidden-panels'] || [];
    tabId = response.tabId;
    hidden = hiddenPanels.indexOf(tabId) !== -1;
    initialize(hidden);
  });
});

chrome.storage.onChanged.addListener((data) => {
  if (Object.keys(data)[0] === 'hidden-panels') {
    const hiddenPanels = data['hidden-panels'].newValue || [];
    hidden = hiddenPanels.indexOf(tabId) !== -1;
    if (hidden) {
      hidePanel();
    } else {
      showPanel();
    }
  }
});

$(() => {
  if (!hidden) {
    showPanel();
  }
});
