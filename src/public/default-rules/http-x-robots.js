function(page) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var u = page.getURL("last");
  var xr = hh['x-robots-tag'] || false;
  if (xr!==false)
  {
    return this.createResult('HTTP', "X-Robots-Tag HTTP Header: "+xr+ this.partialCodeLink(hr), 'warning');
  }
  return null
}
