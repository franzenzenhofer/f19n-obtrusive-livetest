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
  let count = function (needle, haystack)
  {
        if(needle && haystack)
        {

              let nr = (haystack.match(new RegExp(needle, 'gi')) || []).length;
              console.log(needle+" "+nr);
              return nr;
        }
        else
        {
              return 0;
        }
  }
      

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
            let nr_disallow = count('disallow\:',response.body);
            let nr_allow = count('allow\:',response.body)-nr_disallow;
            let nr_noindex = count('noindex\:',response.body);
            let nr_user_agent = count('user-agent\:',response.body);
            let nr_crawl_delay = count('crawl-delay\:',response.body);
            let nr_host = count('host\:',response.body);
            let cmsgA = [];

            if(nr_user_agent>0) {cmsgA.push(nr_user_agent+"*User-agent ");}
            if(nr_disallow>0) {cmsgA.push(nr_disallow+"*Disallow ");}
            if(nr_allow>0) {cmsgA.push(nr_allow+"*Allow ");}
            if(nr_noindex>0) {cmsgA.push(nr_noindex+"*Noindex ");}
            if(nr_crawl_delay>0) {cmsgA.push(nr_crawl_delay+"*Crawl-delay ");}
            if(nr_host>0) {cmsgA.push(nr_host+"*Host ");}
            if(cmsgA.length>0){msg = msg+" ("+cmsgA.join(', ')+")";}
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