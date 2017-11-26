function(page, done) {
  var that = this;
  var url_s = page.getURL("last");
  var url = new URL(url_s);
  var maindomain = url.hostname;
  if (((maindomain.match(/\./g) || []).length) > 2)
  {
    maindomain = maindomain.substring(maindomain.indexOf('.'));
  }
  var static_dom = page.getStaticDom();
  var idle_dom = page.getIdleDom();
  var msg = "";
  var status = "info";

  var isInternalUrl = (x) =>
  {
    var partOfDomain = (u, n) => {
      try
      {
        var turl = new URL(u);
      }
      catch(e)
      {
        return true;
      }
      if (turl.hostname.includes(n))
      {
        return true;
      }
      else {
        return false;
      }
    }
    var href = x.getAttribute('href');
    //console.log(maindomain);
    if(!href.includes('//')) {  return true; }
    if(href.includes(maindomain)) {
      return partOfDomain(href,maindomain)
    }
    return false;
  };

  var static_paramstuff  = Array.from(static_dom.querySelectorAll("[href*='?']"));
  var idle_paramstuff = Array.from(idle_dom.querySelectorAll("[href*='?']"));
  static_paramstuff = static_paramstuff.filter(isInternalUrl);
  idle_paramstuff = idle_paramstuff.filter(isInternalUrl);
  //idle_paramstuff.filter((x) => !((x.href+"").includes('://')));
  var diff_idle_paramstuff = [];
  var found = false;
  for (var ei of idle_paramstuff) {
    //console.log(ei);
    found = false;
    for (var es of static_paramstuff )
    {
      if(ei.href === es.href && (ei.outerHTML.toString() === es.outerHTML.toString()))
      {
        found = true;
      }
    }
    if(!found)
    {
      diff_idle_paramstuff.push(ei);
    }

  }
  //console.log('diff');
  //console.log(diff_idle_paramstuff);

  if (static_paramstuff .length == 0 && idle_paramstuff.length == 0 && diff_idle_paramstuff == 0)
  {
    done();
  }
  else {
    //todo: better message
    msg = static_paramstuff .length+" parameterized internal ressources found in the static DOM "+this.partialCodeLink(static_paramstuff )+", additonal "+diff_idle_paramstuff.length+" parameterized internal ressources found in the idle DOM "+this.partialCodeLink(diff_idle_paramstuff);//+this.highlightLink("[href*='?']", "Highlight all paramterized links.");
    done(this.createResult('DOM', msg, status));
  }
}
