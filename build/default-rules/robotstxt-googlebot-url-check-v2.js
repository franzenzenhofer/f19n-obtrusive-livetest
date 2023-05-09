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
		let my_user_agent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

		var checkForEndgame = function()
		{
			if(urls_tested===urls.length)
	    	{
	    		is_done = true;
	    		endgame();
	    	}
	    	else
	    	{
	    		
	    	}
		}

		var endgame = function()
		{
		
			
			if(msgA.length>0)
			{
				msg = "Robots.txt: "+msgA.join('<br>');
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
	      				let robot = that.simpleRobotTxt(response.body,u, my_user_agent);
	      				
	    					if(robot.disallowed)
	    					{
	    						msgA.push('<a href="'+u+'" target="_blank">'+u+'</a> is <b>disallow</b>ed by <a href="'+r+'" target="_blank">'+r+'</a>.');
	    						type="warning";
	    					}
	    					if(robot.allowed && robot.rulematch)
	    					{
	    						msgA.push('<a href="'+u+'" target="_blank">'+u+'</a> is explecit <b>allow</b>ed by <a href="'+r+'" target="_blank">'+r+'</a>.');
	    					}
	    					if(robot.noindex)
	    					{
	    						msgA.push('<a href="'+u+'" target="_blank">'+u+'</a> is set to <b>noindex</b> by <a href="'+r+'" target="_blank">'+r+'</a>.');
	    						type="warning";
	    					}
	    					if(robot.conflict)
	    					{
	    						msgA.push('<a href="'+u+'" target="_blank">'+u+'</a> has <b>conflict</b>ing <b>disallow/allow</b> rules in <a href="'+r+'" target="_blank">'+r+'</a>.');
	    						type="error";
	    					}
	    					if(robot.user_agent_match_collision)
	    					{
	    						msgA.push('Two or more similar specific "User-agent:" groups match for "'+my_user_agent+'". Could not sensemaking parse <a href="'+r+'" target="_blank">'+r+'</a>.');
	    						type="error";	
	    					}
	    					if(robot.rule_match)
	    					{
	    						msgA[msgA.length-1]=msgA[msgA.length-1]+that.partialStringifyLink(robot)+" "+"<a href='https://www.google.com/webmasters/tools/robots-testing-tool?hl=en&authuser=0&siteUrl="+uo.origin+"/' target='_blank'>GSC</a>";
	    					}
	    					urls_tested++;
	    				
							checkForEndgame();

					} else { urls_tested++; checkForEndgame(); }//else //no valid robots.txt, let other f19n rules work this out
				} else { urls_tested++; checkForEndgame(); } //else //no valid robots.txt
			});
		}
	setTimeout(function(){if(!is_done){endgame();}},max_wait_time);
}