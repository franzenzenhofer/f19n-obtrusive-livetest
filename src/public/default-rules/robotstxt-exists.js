function (page, done) {
	//console.log('robots.txt exists')
	let url = page.getURL("last")
	if(!url){ done(); return; }
	let u = new URL(url);
	let r = u.origin+'/robots.txt'
	let rl = "<a href='"+r+"' target='_blank'>"+u.origin+'/robots.txt'+"</a>";
	let msg = "";
	let type = "info";
          //TODO: set the robots.txt body of that domain in a global map so to prevent unnecessary fetched
	this.fetch(r, { responseFormat: 'text' }, (response) => {
	  if(response.redirected == true )
      {
      	type="warning";
      	msg=rl+" redirects to "+"<a href='"+response.url+"' target='_blank'>"+response.url+"</a>";
      }
      else
      {
      	if(response.status===200)
      	{
      		if((response.body.includes('<div')) || (response.body.includes('<body')) || (response.body.includes('<DIV')) || (response.body.includes('href="')) || (response.body.includes("href='")))
      		{
      			type="error";
      			msg= rl+"returns HTTP "+response.status+", but looks like it is an HTML page.";
      		}
                  else if(response.body.trim()==="")
                  {
                        type="info";
                        msg=rl+" returns HTTP "+response.status+" but no content (<b>blank robots.txt</b>)";  
                  }
      		else
      		{
      			type="info";
      			msg=rl+" returns HTTP "+response.status;
                        //TODO ad stats about how much rules, user agents and so on
      		}
      	}
      	else
      	{
      		type="warning";
      		msg=rl+" returns HTTP "+response.status;
      	}
      }
      if(msg!="")
	  {
	  	 msg = msg + " <a href='https://www.google.com/webmasters/tools/robots-testing-tool?hl=en&authuser=0&siteUrl="+u.origin+"/' target='_blank'>GSC</a>";
		 done(this.createResult('SITE', msg, type));
	  }
	  done();
	});
}