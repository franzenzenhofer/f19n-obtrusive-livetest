function(page, done) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var u = page.getURL("last");
  var encoding = hh['content-encoding'] || "";
  if (encoding.indexOf('gzip')===-1)
  {
    done(this.createResult('HTTP', u+" no GZIP compression! - <a href='https://checkgzipcompression.com/?url="+u+"' target='_blank'>Test</a>"+ this.partialCodeLink(hr), 'error'));
  }
}
