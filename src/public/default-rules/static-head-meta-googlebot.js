function(page) {
  var dom = page.getStaticDom();
  var elements = dom.querySelectorAll('head>meta[name=googlebot]');
  var type = 'info';
  var msg ='';
  const what = 'static';

  if (elements.length===1) {
    var content = elements[0].getAttribute('content');
    var instructions = content.split(',');
    instructions.forEach(function(v,i,robot_instructions){
        robot_instructions[i]=v.trim().toLowerCase();
    });
    if (instructions.indexOf('noindex')!=-1){type = 'warning';}
    //if (instructions.indexOf('index')!=-1){}
    if (instructions.indexOf('nofollow')!=-1){type = 'warning';}
    //if (instructions.indexOf('follow')!=-1){msg = msg + ' follow';}

    msg = 'Meta Googlebot: <a href="https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives">'+content+'</a>'+this.partialCodeLink(elements);

    return this.createResult('HEAD', msg, 'info', what);
  }

  if (elements.length > 1) {
    return this.createResult('HEAD', "<a href='https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en#using-the-robots-meta-tag'>Multiple googlebot meta tags.</a>"+this.partialCodeLink(elements), 'warning', what);
  }

  return null;
}
