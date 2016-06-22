function(page) {
  var dom = page.getStaticDom();
  var amp = dom.querySelector('link[rel=amphtml]');

  if (amp) {
    var href = amp.getAttribute('href');
    var text = `Amp: <a href='${href}' target='_top'>${href}</a> `;//+this.dataUrlCodeLink(amp, 'VPC');
    return this.createResult('HEAD', text, 'info');
  }
  return null;
}
