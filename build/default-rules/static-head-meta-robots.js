function(page, done) {
  var dom = page.getStaticDom();
  const what = 'static';
  var elements = dom.querySelectorAll('head>meta[name=robots]');
  var type = 'info';
  var msg ='';

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

    msg = 'Meta Robots: <a href="https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives">'+content+'</a>'+this.partialCodeLink(elements);

    done(this.createResult('HEAD', msg, type, what, 610));
  }

  if (elements.length > 1) {
    done(this.createResult('HEAD', "<a href='https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en#using-the-robots-meta-tag'>Multiple robots meta tags.</a>"+this.partialCodeLink(elements), 'warning', what));
  }

  done(this.createResult('HEAD', "<a href='https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en#using-the-robots-meta-tag'>No robots meta tag.</a>", 'info', what));
}
