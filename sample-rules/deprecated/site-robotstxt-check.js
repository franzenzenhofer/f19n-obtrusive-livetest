function(page, done) {
  var robotstxt = page.getRobotsTxtStatus();
  if (robotstxt.ok === false)
  {
    if (robotstxt.status === 404) {
      var msg = "No <a href='"+robotstxt.location.href+"' target='_blank'>robots.txt</a> found. <a href='"+robotstxt.location.href+"' target='_blank'>"+robotstxt.location.href+"</a> → HTTP "+robotstxt.status+" "+robotstxt.statusText;
      done(this.createResult('SITE', msg,'info'));
    }
      var msg = "<a href='"+robotstxt.location.href+"' target='_blank'>robots.txt</a> error! <a href='"+robotstxt.location.href+"' target='_blank'>"+robotstxt.location.href+"</a> → HTTP "+robotstxt.status+" "+robotstxt.statusText+" ("+robotstxt.contentType+")";
      done(this.createResult('SITE', msg,'error'));
  }
  done(this.createResult('SITE', "<a href='"+robotstxt.location.href+"' target='_blank'>robots.txt</a> found.", 'info'));
}
