function(page, done){
  var hh = page.getHttpHeaders("last");
  //console.log(hh);
  //console.log(hh['vary']);
  if(hh)
  {
  var vary = hh['vary'] || "";
  var isvary = function(){if(vary.toLowerCase().indexOf("agent")===-1){ return false} return true}();
  }
  else
  {
    var vary = "";
    var isvary = false;
  }
  var u = page.getURL("last");
  var idle_dom = page.getIdleDom();
  var medias = idle_dom.querySelectorAll("link[rel=alternate][media][href]");
  var meta_viewports = idle_dom.querySelectorAll('meta[name=viewport]');

  if(!(isvary || (medias && medias.length>0) || (meta_viewports && meta_viewports.length > 0)))
  {
    done(this.createResult('HTTP DOM', "No common mobile setup (<a href='https://developers.google.com/webmasters/mobile-sites/mobile-seo/' target='_blank'>responsive, dynamic serving, different URL</a>) discovered! <a href='https://www.google.com/webmasters/tools/mobile-friendly/?hl=en&url="+u+"' target='_blank'>Mobile Friendly Test</a>", "error"));
    return null;
  }
  done();
}
