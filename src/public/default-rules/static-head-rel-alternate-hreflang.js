function(page, done) {
  var that = this
  var dom = page.getStaticDom();
  const what = 'static';
  var location = page.getLocation('static');
  var static_url = location.href
  //check if we got some data to work with
  if (!dom) { return null; }
    var alternates = dom.querySelectorAll('link[rel=alternate][hreflang]');
    var canonical = dom.querySelectorAll('link[rel=canonical]')[0];
    var type = 'info';
    var lable = "HEAD";
    var linkstring = '';
    if (alternates.length > 0)
    {
        var alternates_array = Array.prototype.slice.call(alternates);
        //var codestring = ''
        //var purecodestring = ''
        alternates_array.forEach(
          function(value)
          {

            //purecodestring = purecodestring + value.outerHTML + "\n";
            //codestring = codestring + that.htmlEntitiesEncode(value.outerHTML) + "\n";
            linkstring = linkstring + '<a href="'+value.href+'" title="'+value.href+'" target="_top">'+value.hreflang+'</a> ';
            
          }
        )
        //var rellist='<br><textarea readonly>'+codestring+'</textarea>';
      done(this.createResult(lable, alternates.length+' link-rel-alternate found. '+this.partialCodeLink(canonical, alternates)+'<br>'+linkstring, type, what, 710));
    }
    else {
      //return this.createResult(lable, 'No link-rel-alternate-hreflang found.', type, what);
      //return null;
    }

  //return this.createResult(lable, 'Title: '+titletags[0].innerText, 'info');
  //return null;
  done();
}
