function(page, done) {
  var idom = page.getIdleDom();
  let selector = "a>img[alt='']";
  var elems = idom.querySelectorAll(selector);
  if (elems && elems.length>1)
  {
    var image_s = "images";
    if (elems.length===1) { image_s = "image"; }
    var msg = elems.length+" linked "+image_s+" without alt-text or other linked text found."+this.partialCodeLink(elems)+this.highlightLink(selector);
    done(this.createResult('BODY',msg,'warning','idle'));
  }
  done();
}
