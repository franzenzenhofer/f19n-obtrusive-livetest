function(page, done) {
  var sc = page.getStatusCode();
  var rawHttpHeader = page.getRawHttpHeaders();
  var url = page.getURL();
  var text = "";
  if (sc) {
    var type = 'info';
    var anchor = '';
    if (sc < 200) { type = 'warning'; anchor='#1xx_Informational_response';}
    if (sc <= 200) { anchor='#2xx_Success';}
    if (sc >= 300) { type = 'warning'; anchor='#3xx_Redirection'; }
    if (sc === 304) {
      type = 'info'; 
      text = `${url} → <a href="https://httpstatuses.com/304" target="_blank">HTTP ${sc}</a>`;
    }
    if (sc >= 400) { type = 'error'; anchor="#4xx_Client_errors";}
    if (sc >= 500) { type ='error'; anchor="#5xx_Server_errors" }
    if(text==='')
    {
      text = `${url} → <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes${anchor}" target="_blank">HTTP ${sc}</a>`;
    }
    text = text + this.partialCodeLink(rawHttpHeader);
    done(this.createResult('HTTP', text, type)); return;
  }
  done();
}
