function(page, done) {
  var soft404 = page.getSoft404Status();
  if (soft404.ok === false)
  {
    var msg = "Soft 404 Error: <a href='"+soft404.location.href+"' target='_blank'>"+soft404.location.href+"</a> → HTTP "+soft404.status
    done(this.createResult('HTTP', msg, 'error'));
  }
}
