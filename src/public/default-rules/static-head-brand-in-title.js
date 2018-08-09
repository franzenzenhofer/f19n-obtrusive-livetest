(page,done) =>
{
	let lable = "HEAD";
	let msg = "";
	let type = "warning"; 
	let what = "static";
	let dom = page.getStaticDom();
	let url = page.getURL('last');
	let u = new URL(url);
	let host = u.host;
	let extractBrand = (host) =>
	{
		let parts = host.split('.');
		let longest = parts.reduce(function (a, b) { return a.length > b.length ? a : b; });
		return longest;
	} 
	let brand = extractBrand(host);
	if(!dom){done();}
	let titletags = dom.querySelectorAll('head > title');
 	let title = titletags[0].innerText.trim();
 	
 	if(title.toLowerCase().includes(brand.toLowerCase())) {done();}
 	msg = "Meta-Title does not include the brand \""+brand+"\"."
	done(this.createResult(lable, msg + this.partialCodeLink(titletags[0]), type, what));
}