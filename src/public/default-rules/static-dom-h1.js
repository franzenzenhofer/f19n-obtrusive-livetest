function(page, done) {
  console.log('h1 h1');
  var dom = page.getStaticDom();
  let selector = 'h1';
  var h1 = dom.querySelectorAll(selector);
  if (h1.length>0) {
    if(h1.length === 1) {
      if(h1[0].innerText.trim()!='') {
        done(this.createResult('DOM', 'H1: '+h1[0].innerText+this.partialCodeLink(h1)+this.highlightLink(selector, "Highlight H1", '5px solid green'), 'info', 'static'));
        return null;
      }
      else {
        done(this.createResult('DOM', '&ltH1&gt is empty!'+this.partialCodeLink(h1), 'error', 'static'));
        return null;
      }
    }
    done(this.createResult('DOM', 'Multiple &ltH1&gt found!'+this.partialCodeLink(h1)+this.highlightLink(selector, "Highlight H1"), 'warning', 'static'));
    return null;
  }
  done(this.createResult('DOM', 'No &ltH1&gt found!', 'error', 'static'));
  return null;
}
