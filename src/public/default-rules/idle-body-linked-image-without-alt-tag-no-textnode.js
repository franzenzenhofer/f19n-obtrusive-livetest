function(page, done) {
  var idom = page.getIdleDom();
  var elems = idom.querySelectorAll('a>img[alt=""]');
  if (elems && elems.length>1)
  {
    var image_s = "images";
    if (elems.length===1) { image_s = "image"; }
    var msg = elems.length+" linked "+image_s+" without alt-text or other linked text found."+this.partialCodeLink(elems);
    done(this.createResult('BODY',msg,'warning','idle'));
  }
}
