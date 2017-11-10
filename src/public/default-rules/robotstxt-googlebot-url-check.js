function(page, done) {
		var that = this;
		let urls_all = [page.getURL("first"),page.getURL("last")];
		let urls = [...new Set(urls_all)]; 
		let msg = "";
		let msgA = [];
		let type = "note";
		let urls_tested = 0;
		let is_done = false;
		let max_wait_time = 5000;

		var checkForEndgame = function()
		{
			if(urls_tested===urls.length)
	    	{
	    		endgame();
	    	}
	    	else
	    	{
	    		console.log('URLS TESTEd'+urls_tested);
	    	}
		}

		var endgame = function()
		{
			is_done = true;
			if(msgA.length>0)
			{
				msg = msgA.join('<br>');
				done(that.createResult('URL', msg, type));
			}
			else
			{
				done();return;
			}
		}

		//in a loop over all URLs
		for(let u of urls)
		{
			let uo = new URL(u);
			let r = uo.origin+"/robots.txt";
			that.fetch(r, { responseFormat: 'text' }, (response) => {
				
				if(response.status===200)
				{
					//a robots.txt must either inlcude a user-agent reference or a sitemap reference to be valid
					if((response.body.includes('sitemap:')) ||
					   (response.body.includes('Sitemap:')) ||
					   (response.body.includes('SITEMAP:')) ||
					   (response.body.includes('user-agent:')) ||
					   (response.body.includes('User-agent:')) ||
					   (response.body.includes('USER-AGENT:')) ||
					   (response.body.includes('User-Agent:')))
	      			{
	      				try{
							var Robotstxt = that.robotsTxt('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
						}
						catch(e)
						{
							//wehardcrash
							console.log(e);
							done(that.createResult('URL', 'Could not finish robots.txt disallow check.', 'warning'));
							return;
						}
						Robotstxt.on('ready', function (gk) 
						{
	    					if(gk.isDisallowed(u))
	    					{
	    						type = "warning";
	    						let why = gk.why(u);
	    						let tmsg = "<i>"+why.url+"</i> is <b>disallowed</b> by \""+why.rules[0].line+"\" in line-number "+why.rules[0].linenumber+" in <a href='"+r+"' target='_blank'>"+r+"</a> for Googlebot"; 
	    						if(why.rules.length>1)
	    						{
	    							tmsg = tmsg + "("+why.rules.length+" robots.txt rules match) ";
	    						}
	    						tmsg = tmsg+" "+that.partialStringifyLink(why);
	    						tmsg = tmsg+" "+"<a href='https://www.google.com/webmasters/tools/robots-testing-tool?hl=en&authuser=0&siteUrl="+uo.origin+"/' target='_blank'>GSC</a>";
	    						msgA.push(tmsg);
	    					}
	    					urls_tested++;
							checkForEndgame();
						});
						Robotstxt.parse(response.body);
					} else { urls_tested++; checkForEndgame(); }//else //no valid robots.txt, let other f19n rules work this out
				} else { urls_tested++; checkForEndgame(); } //else //no valid robots.txt
			});
		}
	setTimeout(function(){if(!is_done){endgame();}},max_wait_time);
}