import $ from 'npm-zepto';

$('*').each((index, element) => {
  if ($(element).css('position') === 'fixed') {
    $(element).css({ top: 100 });
  }
});

$('body').append($('<div class="FSOWidget">SFO Livetest</div>'));
