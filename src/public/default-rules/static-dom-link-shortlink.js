function(page,done)
{
	let that = this;
	let dom = page.getStaticDom();
	let url = page.getURL('last');
	let shortlink_elem = dom.querySelector('link[rel="shortlink"]');
	if(!shortlink_elem){done();return;}
	let shortlink = shortlink_elem.href;
	let type = "info";
	if(shortlink_elem && shortlink)
	{
		if(shortlink!=url)
		{
			type = "warning";
		}
		done(that.createResult('DOM', 'Shortlink detected: <a href="'+shortlink+'" target="_top">'+shortlink+'</a>'+that.partialCodeLink(shortlink_elem), type));return;
	}
	done();
}