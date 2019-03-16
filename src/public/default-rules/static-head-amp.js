function(page, done) {
  var dom = page.getStaticDom();
  var amp = dom.querySelector('head > link[rel=amphtml]');

  if (amp) {
    var href = amp.getAttribute('href');
    var text = `Link Rel Amphtml URL: <a href='${href}' target='_top'>${href}</a> ${this.partialCodeLink(amp)} <a href="https://validator.ampproject.org/#url=${href}">Validate</a>`;
    done(this.createResult('HEAD', text, 'info', 'static', 500));
  }
  done();
}
