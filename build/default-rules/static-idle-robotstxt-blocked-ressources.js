(page, done) => {
	var that = this;
	let url = page.getURL("last");
	let u = new URL(url);
	let r = u.origin+"/robots.txt";

	let is_done = false;
  	let max_wait_time = 15000;


	let my_user_agent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

	let lable = "DOM";
	let msg = "";
	let type = "info"; 
	let what = "static & idle";

	let getInternalSrcAttributesFromDom = (dom) =>
	{
		let all_internal_links_slector = "*[src^='"+u.origin+"'], *[src^='/'], *[src^='./'], *[src^='../']"; 
		var n_raw = dom.querySelectorAll(all_internal_links_slector);
		var n = [];
  		for(let a of n_raw)
  		{
  			if(a.getAttribute("src").startsWith("//"))
  			{
  				if(a.getAttribute("src").startsWith("//"+u.host))
  				{
  					n.push(u.protocol+a.getAttribute("src"));
  				}
  			}
  			else
  			{
  				if(a.getAttribute("src").startsWith(u.origin))
  				{
  					n.push(a.getAttribute("src"));
  				}
  				else
  				{
  					n.push(u.origin+a.getAttribute("src"));
  				}
  			}
  		}
  		return n;
	}

	let rA = [];
	
	let endgame = (blocked_stuff, was_timeout = false) =>
	{
		if(blocked_stuff.length===0)
		{
			//nothing blocked
			if(was_timeout)
			{
					type = "warning";
					done(that.createResult(lable, "Could not check for robots.txt disallowed ressources. <a href='"+r+"' target='_blank'>"+r+"</a> fetch timeout!", type, what));return; 
			}
			else
			{
					done(that.createResult());return; 
			}
		}
		msg = msg + blocked_stuff.length+ " internal resources blocked via <a href='"+r+"' target='_blank'>"+r+"</a>."+that.partialCodeLink(blocked_stuff);
		type = "warning";
		done(that.createResult(lable, msg, type, what));return; 
	}


	that.fetch(r, { responseFormat: 'text' }, (response) => {
				if(response.status===200)
				{
					
					if((response.body.includes('disallow:')) ||
					   (response.body.includes('Disallow:')) ||
					   (response.body.includes('DISALLOW:'))) 
	      				{

	      					let sdom = page.getStaticDom();
							let idom = page.getIdleDom();
							let sA = getInternalSrcAttributesFromDom(sdom);
							let iA = getInternalSrcAttributesFromDom(idom);

							sA.push(...iA);
							const uniA = [...(new Set(sA))];

	      					for (let s of uniA)
	      					{
	      						let robot = that.simpleRobotTxt(response.body,s, my_user_agent);
	      						if(robot.disallowed)
	    						{
	    							let blocked_string = robot.url+" - "+robot.matches[0][1][0].rule+" - Line "+robot.matches[0][1][0].linenumber;
	    							rA.push(blocked_string);
	    							type="warning";
	    						}
	      					}
	      					is_done = true;
	      					endgame(rA);

	      				}
	      		} else 
	      		{
	      			is_done = true;
	      			endgame([]);
	      		}

	      	});
setTimeout(function(){if(!is_done){endgame([],true);}},max_wait_time);

}