function(page, done) {
  //var static_dom = page.getFetchedStaticDom();
  var idle_dom = page.getIdleDom();
  var url = page.getURL("last");

  this.fetch(url, { responseFormat: 'text' }, (response) => {
      var parser = new DOMParser();
      var static_dom = parser.parseFromString(response.body, "text/html");
      var status = 'info';
      var diff_size = (idle_dom.head.innerHTML.length+idle_dom.head.innerHTML.length)/(static_dom.head.innerHTML.length+static_dom.head.innerHTML.length)
      var msg = '';
      if(diff_size > 1)
      {
        var diff_percentage = Math.round((diff_size -1) * 100);
        msg = "Idle-DOM is "+diff_percentage+"% bigger then the Static-DOM.";
      }
      else if (diff_size>1)
      {
        var diff_percentage = Math.round((1 - diff_size) * 100);
        msg = "Idle-DOM removed about "+diff_percentage+"% from Static-DOM."
      }
      else {
        msg = "Idle-DOM equals Static-DOM. Either static page or server side rendering cache."
      }

      if (diff_percentage >= 20)
      {
        msg = "Client Side Rendering! "+msg;
        status = "warning";
      }

      done(this.createResult('DOM', msg, status, null, 800));
    });
  //if(!(static_dom && idle_dom)){ return null; }
  //wait forever
  //done();
}
