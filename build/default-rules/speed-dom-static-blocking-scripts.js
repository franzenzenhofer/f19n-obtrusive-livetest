(page,done) =>
{
	let that = this; 
	
	let lable = "SPEED";
	let msg = " blocking scripts";
	let type = "info"; 
	let what = "static";

	let dom = page.getStaticDom();
	let selector = 'script[src]';
	let scripts = dom.querySelectorAll(selector);
	let blocking = [];
	let async = [];
	let defer = [];
	for(let s of scripts){
		let s_str = s.outerHTML;
		if((s_str.search(/defer/i)===-1)&&(s_str.search(/async/i)===-1))
		{
			blocking.push(s);
		}
		else
		{
			if(s_str.search(/defer/i)!==-1)
			{
				defer.push(s);
			}
			if(s_str.search(/async/i)!==-1)
			{
				async.push(s);
			}
		}
	}

	if(blocking.length<1)
	{
		done();return;
	}

	if(blocking.length>1){type="warning";}
	if (blocking.length>9){type="error";} //just decided that if you have 10 or more blocking scripts then your site is broken



	msg = blocking.length + msg + that.partialCodeLink(blocking);

	if(async.length>0)
	{
		msg = msg + " " + async.length+" async scripts."+that.partialCodeLink(async);
	}

	if(defer.length>0)
	{
		msg = msg + " " + async.length+" defer scripts."+that.partialCodeLink(defer);
	}

	if(blocking.length!==scripts.length)
	{
		msg = msg + " All "+scripts.length+" scripts:"+that.partialCodeLink(scripts);
	}

	done(that.createResult(lable, msg, type, what, 550));return; 
}
