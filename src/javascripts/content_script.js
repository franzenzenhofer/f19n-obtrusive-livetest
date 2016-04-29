import $ from 'npm-zepto';

const $wrapper = $('<div class="fso-panel-wrapper"><iframe src=' + chrome.extension.getURL('ui.html') + '></iframe></div>');
$('body').append($wrapper);

const wrapperWidth = $wrapper.width();

// TODO: Not the perfect solution in terms of performance. Maybe use TreeWalker.
$('*').each((index, element) => {
  if (!$(element).hasClass('fso-panel-wrapper') && $(element).css('position') === 'fixed' && $(element).css('left') === '0px') {
    $(element).css({ left: wrapperWidth });
  }
});
