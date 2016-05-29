function(page) {
  var sc = page.getStatusCode();
  var url = page.getURL();
  if (sc) {
    var text = `${url} → <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes" target="_top">HTTP ${sc}</a>`;
    var label = 'info';
    if (sc < 200) { label = 'warning'; }
    if (sc >= 300) { label = 'warning'; }
    if (sc >= 400) { label = 'error'; }
    return this.createResult(1, 'HTTP', text, label);
  }
  return null;
}
