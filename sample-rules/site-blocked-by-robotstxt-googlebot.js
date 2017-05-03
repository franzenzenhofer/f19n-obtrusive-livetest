function(page, done){
  var robotstxt = page.getRobotsTxtStatus();
  var robots = this.robotsParser(robotstxt.location.href, robotstxt.txt);
  var url = page.getURL("last");
  //var ua = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
  var ua = "Googlebot";
  if(robots.isAllowed(url, ua))
  {
    //return this.createResult('SITE', url+' not blocked by the robots.txt', 'info');
    //return null;
  }
  done(this.createResult('SITE', '<a href="'+url+'" target="_top">'+url+'</a> blocked by <a href="'+robotstxt.location.href+'" target="_blank">'+robotstxt.location.href+'</a>', 'error'));
}
