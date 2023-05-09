(page,done) =>
{
	let lable = "HEAD";
	let msg = "Meta-Title length: ";
	let type = "info"; 
	let what = "static";
	let dom = page.getStaticDom();
	if(!dom){done();}
	let titletags = dom.querySelectorAll('head > title');
 	let title = titletags[0].innerText.trim();
 	msg = msg + title.length

 	if(title.length < 40)
 	{
 		msg = msg + " (short title)";
 		type = "warning";
 	}
 	if(title.length == 0)
 	{
 		msg = msg + " (blank title)";
 		type = "error";
 	}
 	if(title.length > 120)
 	{
 		msg = msg + " (long title)";
 		type = "warning";
 	}
 	if(title.length > 240)
 	{
 		msg = msg + " (very long title)";
 		type = "warning";
 	}
	done(this.createResult(lable, msg + this.partialCodeLink(titletags[0]), type, what));
}