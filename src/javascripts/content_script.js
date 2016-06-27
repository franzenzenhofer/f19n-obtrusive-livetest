const panelUrl = chrome.extension.getURL('panel.html');
const $panelWrapper = $(`<div class="f19n-panel-wrapper"><h4>Loading f19n Livetest ...</h4><iframe src='${panelUrl}'></iframe></div>`);
const $iframe = $panelWrapper.find('iframe');
let hidden = false;
let tabId = null;

$iframe.on('load', () => {
  $panelWrapper.find('h4').remove();
});

const check = (sites, url) => {
  const entry = sites.reverse().find((l) => {
    const regexp = `\^${l}\$`.replace(/\*/g, '[^ ]*').replace('!', '');
    return url.match(new RegExp(regexp));
  });
  return entry ? (entry.match(/^!.+/) !== null ? false : true) : false;
};

const fixAbsolutePositionedElements = () => {
  // TODO: Not the perfect solution in terms of performance. Maybe use TreeWalker.
  const wrapperWidth = $panelWrapper.width();
  $('*').each((index, element) => {
    if (!$(element).hasClass('f19n-panel-wrapper') && $(element).css('position') === 'fixed' && $(element).css('left') === '0px') {
      $(element).data('f19n-fixed-element', true).css({ left: wrapperWidth });
    }
  });
};

const unfixAbsolutePositionedElements = () => {
  $('[data-f19n-fixed-element]').css({ left: 0 });
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

chrome.storage.local.get((data) => {
  chrome.runtime.sendMessage('tabIdPls', (response) => {
    const hiddenPanels = data['hidden-panels'] || [];
    const enabledSites = data.sites;
    const enabledSite = check(enabledSites.split('\n'), document.location.href);
    tabId = response.tabId;
    hidden = hiddenPanels.indexOf(tabId) !== -1;
    hidden = hidden || !enabledSite;
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
