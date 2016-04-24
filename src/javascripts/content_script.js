import $ from 'npm-zepto';

$('*').each((index, element) => {
  if ($(element).css('position') === 'fixed') {
    $(element).css({ top: 100 });
  }
});

const $fso = $('<div class="FSOWidget"><iframe src=' + chrome.extension.getURL('ui.html') + '></iframe></div>');
$('body').append($fso);
