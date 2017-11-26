(page,done) =>
{
	let that = this; 
	
	let lable = "DOM";
	let msg = "";
	let type = "warning"; 
	let what = "idle";

	let selector = "*[rel=nofollow]";

	let dom = page.getIdleDom();
	let n = dom.querySelectorAll(selector);
	if(n.length>0)
	{
		msg = msg + n.length+" elements with rel=nofollow found."+that.partialCodeLink(n)+that.highlightLink(selector, "Highlight Nofollow");
		//msg = msg + " <a href='javascript://' onclick=\"for(e of window.top.document.querySelectorAll('*[rel=nofollow]')){e.style.border='5px solid red';}\">Highlight Nofollow</a>";
		done(that.createResult(lable, msg, type, what));return; 
	}
	done();return;
	
}
