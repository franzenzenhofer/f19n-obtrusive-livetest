function(page) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var u = page.getURL("last");
  var v = hh['vary'] || false;
  if (v!==false)
  {
    if(v.toLowerCase().indexOf('agent')!==-1)
    {
      return this.createResult('HTTP', " Vary: "+v+" - <a href='https://developers.google.com/webmasters/mobile-sites/mobile-seo/dynamic-serving' target='_blank'>Dynamic serving</a> detected." +this.partialCodeLink(hr), 'warning');
    }
  }
  return null
}
