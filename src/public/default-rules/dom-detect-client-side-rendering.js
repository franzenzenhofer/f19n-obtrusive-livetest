function(page) {
  var static_dom = page.getFetchedStaticDom();
  var idle_dom = page.getIdleDom();
  var status = 'info';
  var diff_size = (idle_dom.head.innerHTML.length+idle_dom.head.innerHTML.length)/(static_dom.head.innerHTML.length+static_dom.head.innerHTML.length)
//  console.log('detecting dynamic rendering');
//  console.log(page);
//  console.log(idle_dom.head.innerHTML);
//  console.log(static_dom.head.innerHTML);
//  console.log(idle_dom.body.innerHTML);
//  console.log(static_dom.body.innerHTML);
  var msg = '';
  if(diff_size>1)
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
    msg = "Idle-DOM equals Static-DOM. Either static page or cached client side rendering."
  }

  if (diff_percentage > 25)
  {
    msg = "Client Side Rendering! "+msg;
    status = "warning";
  }

  return this.createResult('DOM', msg, status);
}
