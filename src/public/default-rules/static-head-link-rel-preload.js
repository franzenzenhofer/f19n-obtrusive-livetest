(page,done) =>
{
	let that = this; 
	
	let lable = "HEAD";
	let msg = "";
	let type = "info"; 
	let what = "static";

	let selector = "link[rel*=preload]";

	let dom = page.getStaticDom();
	let n = dom.querySelectorAll(selector);
	if(n.length>0)
	{
		let elements = "elements";
		if(n.length===1){elements = "element";};
		msg = msg + n.length+" link[rel=preload] "+elements+" found."+that.partialCodeLink(n);
		done(that.createResult(lable, msg, type, what));return; 
	}
	//there is a bug in there somewhere
	//done(that.createResult(lable, "No link[rel=preload] used.", "warning", what));return;
	done(that.createResult(lable, "No link[rel=preload] used.", "warning", what));return; 



}
//todo the same for itemtype