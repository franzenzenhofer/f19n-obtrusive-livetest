(page,done)=>
{
	let that = this;
	let dom = page.getStaticDom();
	let og_url = (dom.querySelector('meta[property="og:url"]')&&dom.querySelector('meta[property="og:url"]').content);

	let c = (dom.querySelector('link[rel=canonical]')&&dom.querySelector('link[rel=canonical]').href);
	let l = page.getLocation().href;
	let scu = "https://graph.facebook.com/?id=";

	let url = (og_url || c || l);
	if(url)
	{
		fetch(scu+url).then(
   			(response) => {
      			if (response.status !== 200) { done(that.createResult("fb", "Could not fetch Facebook share count."+' <a href="https://developers.facebook.com/tools/debug/sharing/?q='+url+'" target="_blank">Fb Debugger</a>', "unfinished"));return; }
      			response.json().then((data) => {
      				
      				let msg = "Facebook share count: "+data.share.share_count+" shares, "+data.share.comment_count+" comment. "+that.stringifyLink(data)+' <a href="https://developers.facebook.com/tools/debug/sharing/?q='+url+'" target="_blank">Fb Debugger</a>';
      					done(that.createResult('Fb', msg, 'info'));
      			});
        		//	done(that.createResult('SPEED', 'No Page Speed Insights mobile data. (Response Status '+response.status+' '+response.text+')', "warning"));
        	return;
      		}
      	)

	}
	else
	{
		done();return;
	}
}