function(page,done)
{
	let that = this;
	let dom = page.getStaticDom();
	let og_title = dom.querySelector('meta[property="og:title"]');
	if(og_title && og_title.content)
	{
		done(that.createResult('DOM', 'Open Graph (Facebook) title: "'+og_title.content+'"'+that.partialCodeLink(og_title), 'info'));return;
	}
	done();
}