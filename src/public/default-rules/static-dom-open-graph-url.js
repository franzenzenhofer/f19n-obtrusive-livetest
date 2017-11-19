(page,done) =>
{
	let that = this;
	let dom = page.getStaticDom();
	let og_url = dom.querySelector('meta[property="og:url"]');
	let c = (dom.querySelector('link[rel=canonical]')&&dom.querySelector('link[rel=canonical]').href);
	let l = page.getLocation().href;
	if(og_url && og_url.content)
	{
		if(c && og_url.content && c.trim() !== og_url.content.trim())
		{
			done(that.createResult('DOM', 'Open Graph (Facebook) URL: <a href="'+og_url.content+'" target="_blank">'+og_url.content+'</a> does not equal canonical(<a href="'+c+'" target="_blank">'+c+'"</a>)'+that.partialCodeLink(og_url), 'warning'));return;
		} else if(l && og_url.content && l.trim() !== og_url.content.trim())
		{
			done(that.createResult('DOM', 'Open Graph (Facebook) URL: <a href="'+og_url.content+'" target="_blank">'+og_url.content+'</a> does not equal document location (<a href="'+l+'" target="_blank">'+l+'</a>)'+that.partialCodeLink(og_url), 'warning'));return;
		}
		done(that.createResult('DOM', 'Open Graph (Facebook) URL: <a href="'+og_url.content+'" target="_blank">'+og_url.content+'"</a> (OK)'+that.partialCodeLink(og_url)+' <a href="https://developers.facebook.com/tools/debug/sharing/?q='+og_url.content+'" target="_blank">Fb Debugger</a>', 'info'));return;
	}
	done();
}