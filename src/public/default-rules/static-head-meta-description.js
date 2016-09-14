function(page) {
	var dom = page.getStaticDom();

	//if (some requirement)
	var meta_ds = dom.querySelectorAll('meta[name="Description"],meta[name="description"]');
	if (meta_ds.length > 0) {

	  if(meta_ds > 1)
	  {
      return this.createResult('BODY', 'Multiple meta description found.', 'error');
	  }

	  //some category of stuff your are testing i.e.: 'DOM', 'HEAD', 'BODY', 'HTTP', 'SPEED', ...
	  var lable = 'BODY';
	  var msg = 'Meta description: '+meta_ds[0]['content'];
	  //you can create a link showing only the partial code of a nodeList
	  //msg = msg+' '+this.partialCodeLink(dom);
	  var type = 'info'; //should be 'info', 'warning', 'error'

	  return this.createResult(lable, msg, type);
	}
	return this.createResult('BODY', 'No meta description found.', 'error');
}
