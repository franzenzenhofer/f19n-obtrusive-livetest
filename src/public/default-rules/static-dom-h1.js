function(page) {
  var dom = page.getStaticDom();
  var h1 = dom.querySelectorAll('h1');

  if (h1.length>0) {
    if(h1.length === 1) {
      if(h1[0].innerText.trim()!='') { return this.createResult('DOM', 'H1: '+h1[0].innerText+this.partialCodeLink(h1), 'info', 'static');
      }
      else {
        return this.createResult('DOM', '&ltH1&gt is empty!'+this.partialCodeLink(h1), 'error', 'static');
      }
    }
    return this.createResult('DOM', 'Multiple &ltH1&gt found!'+this.partialCodeLink(h1), 'warning', 'static');
  }
  return this.createResult('DOM', 'No &ltH1&gt found!', 'error', 'static');
}
