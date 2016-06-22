function(page) {
  var sc = page.getStatusCode();
  var url = page.getURL();
  if (sc) {
    var type = 'info';
    var anchor = '';
    if (sc < 200) { type = 'warning'; anchor='#1xx_Informational';}
    if (sc <= 200) { anchor='#2xx_Success';}
    if (sc >= 300) { type = 'warning'; anchor='#3xx_Redirection'; }
    if (sc >= 400) { type = 'error'; anchor="#4xx_Client_Error";}
    if (sc >= 500) { type ='error'; anchor="#5xx_Server_Error" }
    var text = `${url} → <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes${anchor}" target="_top">HTTP ${sc}</a>`;
    return this.createResult('HTTP', text, type);
  }
  return null;
}
