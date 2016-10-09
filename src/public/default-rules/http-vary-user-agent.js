function(page) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var u = page.getURL("last");
  var v = hh['vary'] || false;
  if (v!==false)
  {
    if(v.toLowerCase().indexOf('agent')!==-1)
    {
      return this.createResult('HTTP', "Vary: "+v+ this.partialCodeLink(hr), 'warning');
    }
  }
  return null
}
