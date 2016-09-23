function(page) {
  var dom = page.getStaticDom();
  var amp = dom.querySelector('link[rel=amphtml]');

  if (amp) {
    var href = amp.getAttribute('href');
    var text = `Amp: <a href='${href}' target='_top'>${href}</a> ${this.partialCodeLink(amp)} <a href="https://validator.ampproject.org/#url=${href}">Validate</a>`; 
    return this.createResult('HEAD', text, 'info');
  }
  return null;
}
