function(page) {
  var dom = page.getStaticDom();
  var location = page.getLocation('static');
  var static_url = location.href
  //check if we got some data to work with
  if (!dom) { return null; }
    var alternates = dom.querySelectorAll('link[rel=alternate][hreflang]');
    var canonical = dom.querySelectorAll('link[rel=canonical]')[0];
    var type = 'info';
    var lable = "HEAD";
    if (alternates.length > 0)
    {
      this.createResult(1, lable, alternate.length+' link-rel-alternate found.', type);
    }
    else {
      this.createResult(1, lable, 'No link-rel-alternate-hreflang found.', type);
    }

  //return this.createResult(1, lable, 'Title: '+titletags[0].innerText, 'info');
  return null;
}
