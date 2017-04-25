function(page, done) {
	var dom = page.getIdleDom();
  const what = 'idle';
  var lable = 'HEAD';
	//if (some requirement)
	var meta_ks = dom.querySelectorAll('meta[name="keywords"]');
	if (meta_ks.length > 0) {

	  if(meta_ks > 1)
	  {
      	done(this.createResult(lable, 'Multiple unnecessary meta keywords tags found.'+this.partialCodeLink(meta_ks), 'warning', what));
	  }

	  //some category of stuff your are testing i.e.: 'DOM', 'HEAD', 'BODY', 'HTTP', 'SPEED', ...

	  var msg = 'Unnecessary meta keywords tag: '+meta_ks[0]['content'];
    //you can create a link showing only the partial code of a nodeList
    //msg = msg+' '+this.partialCodeLink(dom);
    msg = msg+this.partialCodeLink(meta_ks);

	  var type = 'warning'; //should be 'info', 'warning', 'error'

	  done(this.createResult(lable, msg, type, what));
	}
}
