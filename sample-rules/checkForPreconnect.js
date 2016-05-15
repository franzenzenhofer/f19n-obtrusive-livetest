function(page) {
  var dom = page.getStaticDom();
  if (!dom) { return null; }
  var preconnect = dom.querySelectorAll('link[rel=preconnect]');

  if (preconnect.length > 0 ) {
    var hint_s = 'hints';
    if (preconnect.length === 1) { hint_s = 'hint';}
    return this.createResult(1, 'SPEED', '<a href="https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/" target="_top">'+preconnect.length+' preconnect '+hint_s+' found.</a>', 'info');
  }

  return this.createResult(1, 'SPEED', '<a href="https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/" target="_top">No preconnect hints found.</a>', 'warning');
}
