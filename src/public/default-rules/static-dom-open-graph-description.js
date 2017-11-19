(page,done) =>
{
	let that = this;
	let dom = page.getStaticDom();
	let og_description = dom.querySelector('meta[property="og:description"]');
	if(og_description && og_description.content)
	{
		done(that.createResult('DOM', 'Open Graph (Facebook) description: "'+og_description.content+'"'+that.partialCodeLink(og_description), 'info'));return;
	}
	done();
}