function (page, done) {
	
	let url = page.getURL("last")
	if(!url){ done(); return; }
	let u = new URL(url);
	let r = u.origin+'/robots.txt'
	let rl = "<a href='"+r+"' target='_blank'>"+u.origin+'/robots.txt'+"</a>";
	let msg = "";
	let type = "info";
      //TODO: set the robots.txt body of that domain in a global map so to prevent unnecessary fetched
	this.fetch(r, { responseFormat: 'text' }, (response) => {
	//if(response.redirected == false )
      //even a redirected sitemap can be valid
      if(true)
      {
      	if(response.status===200)
      	{
      		if(!((response.body.includes('sitemap:')) || (response.body.includes('Sitemap:')) || (response.body.includes('SITEMAP:'))))
      		{
      			type="warning"
      			msg= rl+' includes no "Sitemap:"" reference.';
      		}
                  else
                  {
                        let count = (response.body.match(/sitemap\:/ig) || []).length;
                        type="info"
                        msg= rl+' includes '+count+' "Sitemap:" references.';
                  }
      	}
      }
      if(msg!="")
	  {
	  	 msg = msg + " <a href='https://www.google.com/webmasters/tools/sitemap-list?hl=en&siteUrl="+u.origin+"/#MAIN_TAB=1&CARD_TAB=-1' target='_blank'>GSC</a>"
		 done(this.createResult('SITE', msg, type));return;
	  }
	  done();
	});
}