(page,done) =>
{
	let that = this; 
	
	let lable = "HEAD";
	let msg = "";
	let type = "info"; 
	let what = "Idle";

	let selector = "script[type*=json]";

	let dom = page.getIdleDom();
	let n = dom.querySelectorAll(selector);
	if(n.length>0)
	{
		let elements = "elements";
		if(n.length===1){elements = "element";};
		msg = msg + n.length+" Ld-Json Script "+elements+" found."+that.partialCodeLink(n);
		done(that.createResult(lable, msg, type, what, 600));return; 
	}

	done();return;

}