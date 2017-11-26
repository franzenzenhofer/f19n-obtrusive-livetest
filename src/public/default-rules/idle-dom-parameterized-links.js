(page,done) =>
{
	let that = this; 
	
	let lable = "DOM";
	let msg = "";
	let type = "info"; 
	let what = "idle";

	let selector = "a[href*='?']";

	let dom = page.getIdleDom();
	let n = dom.querySelectorAll(selector);
	if(n.length>0)
	{
		msg = msg + n.length+" links with parameters found."+that.partialCodeLink(n)+that.highlightLink(selector, "Highlight paramterized links");
		//msg = msg + " <a href='javascript://' onclick=\"for(e of window.top.document.querySelectorAll('*[rel=nofollow]')){e.style.border='5px solid red';}\">Highlight Nofollow</a>";
		done(that.createResult(lable, msg, type, what));return; 
	}
	done();return;
	
}
