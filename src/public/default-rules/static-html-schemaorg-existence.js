function(page, done) {
  var dom = page.getStaticDom();
  const what = 'static';
  var any = dom.querySelectorAll('*[itemtype]');
  var url = page.getURL();

  if (any && any.length > 1) {
    var a=[];
    any.forEach(function(e){
      a.push(e.getAttribute('itemtype').trim().replace('http.*org/',''));
    });
    done(this.createResult('HTML', 'Schema.org: '+a.join(', ')+ '<br><a href="https://search.google.com/structured-data/testing-tool?hl=en&url='+url+'" target="_blank">Structured Data Testing Tool</a>', 'info', what));
  }
}
