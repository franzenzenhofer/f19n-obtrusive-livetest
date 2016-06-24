function(page) {
  var that = this
  var dom = page.getStaticDom();
  var location = page.getLocation('static');
  var static_url = location.href
  //check if we got some data to work with
  if (!dom) { return null; }
    var alternates = dom.querySelectorAll('link[rel=alternate][hreflang]');
    var canonical = dom.querySelectorAll('link[rel=canonical]')[0];
    var type = 'info';
    var lable = "HEAD";
    console.log(alternates);
    console.log(alternates.length);
    var linkstring = '';
    if (alternates.length > 0)
    {
        var alternates_array = Array.prototype.slice.call(alternates);
        //var codestring = ''
        //var purecodestring = ''
        alternates_array.forEach(
          function(value)
          {
            //console.log(value);
            //console.log(value.outerHTML);
            //purecodestring = purecodestring + value.outerHTML + "\n";
            //codestring = codestring + that.htmlEntitiesEncode(value.outerHTML) + "\n";
            linkstring = linkstring + '<a href="'+value.href+'" title="'+value.href+'" target="_top">'+value.hreflang+'</a> ';
            //console.log(that);
          }
        )
        //var rellist='<br><textarea readonly>'+codestring+'</textarea>';
      return this.createResult(lable, alternates.length+' link-rel-alternate found. '+this.partialCodeLink(canonical, alternates)+'<br>'+linkstring, type);
    }
    else {
      return this.createResult(lable, 'No link-rel-alternate-hreflang found.', type);
    }

  //return this.createResult(lable, 'Title: '+titletags[0].innerText, 'info');
  return null;
}
