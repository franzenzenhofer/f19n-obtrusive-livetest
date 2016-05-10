import $ from 'npm-zepto';

const $wrapper = $('<div class="f19n-panel-wrapper"><iframe src=' + chrome.extension.getURL('panel.html') + '></iframe></div>');
$('body').append($wrapper);

const wrapperWidth = $wrapper.width();

// TODO: Not the perfect solution in terms of performance. Maybe use TreeWalker.
$('*').each((index, element) => {
  if (!$(element).hasClass('f19n-panel-wrapper') && $(element).css('position') === 'fixed' && $(element).css('left') === '0px') {
    $(element).css({ left: wrapperWidth });
  }
});
