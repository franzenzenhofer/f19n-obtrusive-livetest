function(page) {
  var dom = page.getStaticDom();
  const what = 'static';
  var md = dom.querySelector('meta[name="description"]');

  if (md) {
    return this.createResult('HEAD', 'Meta description length: '+md.content.trim().length+this.partialCodeLink(md), 'info', what);
  }
  return null;
}
