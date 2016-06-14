//this tests look for
//the canoncial tag
//multiple canonicals

function(page) {
  var dom = page.getStaticDom();
  var c = dom.querySelectorAll('link[rel=canonical]');
  var location = page.getLocation();
  console.log(c)
  if (c.length > 0) {
    if (c.length === 1)
    {
      var href = c[0].getAttribute('href');
      if (href != location.href)
      {
        //TODO check if it's a relative canoncial
        if (location.href.substring(0,4) != 'http')
        {
          var text = `${location.href} → <a href="https://support.google.com/webmasters/answer/139066?hl=en">Canonical</a> → <a href='${href}' target='_top'>${href}</a><br><a href="https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html">Canonical is relative, should be absolute.</a>`;
        }
        else
        {
          var text = `${location.href} → <a href="https://support.google.com/webmasters/answer/139066?hl=en">Canonical</a> → <a href='${href}' target='_top'>${href}</a>`;
        }
        return this.createResult('HEAD', text, 'warning');
      }
      else {
        var text = `<a href="https://support.google.com/webmasters/answer/139066?hl=en">Canonical</a>: <a href='${href}' target='_top'>${href}</a>`;
        return this.createResult('HEAD', text, 'info');
      }
    }
    else {
      return this.createResult('HEAD', '<a href="https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html" target="_top">Multiple canonical found within the static HTML.</a>', 'error');
    }
  }
  else {
    return this.createResult('HEAD', '<a href="https://support.google.com/webmasters/answer/139066?hl=en" target="_top">No canonical found within the static HTML.</a>', 'error');
  }
  return null;
}
