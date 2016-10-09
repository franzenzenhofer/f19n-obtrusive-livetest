function(page) {
  var hh = page.getHttpHeaders("last");
  var u = page.getURL("last");
  var encoding = hh['content-encoding'] || "";
  if (encoding.indexOf('gzip')===-1)
  {
    //return null
    //return this.createResult('HEAD', 'test', 'error');
    return this.createResult('HTTP', u+" no GZIP compression! - <a href='https://checkgzipcompression.com/?url="+u+"' target='_blank'>Test</a>", 'error');
  }
  return null

}
