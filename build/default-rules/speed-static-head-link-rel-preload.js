(page,done) =>
{
	let that = this; 
	
	let lable = "SPEED";
	let msg = "";
	let type = "info"; 
	let what = "static";
	let prio = 500;

	let dom = page.getStaticDom();
	let selector = "link[rel*=preload]";
	let n = dom.querySelectorAll(selector);

	if(n.length>0)
	{
		let elements = "elements";
		if(n.length===1){elements = "element";}
		msg = msg + n.length + " link[rel=preload] "+ elements +" found."+that.partialCodeLink(n);
		done(that.createResult(lable, msg, type, what, prio));
		return null; 
	}

	done(that.createResult(lable, "No link[rel=preload] elements found.", 'warning', what, prio));
	return null;
}