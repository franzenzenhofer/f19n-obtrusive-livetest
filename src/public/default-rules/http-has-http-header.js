function(page, done) {
  var hh = page.getHttpHeaders("last");
  if(!hh){
    done(this.createResult('HTTP', "<b>No HTTP-header</b> found, most likely due to <b>caching</b>! HTTP-header depending tests might fail or not get reported!", 'warning'));
  }
  done();
}
