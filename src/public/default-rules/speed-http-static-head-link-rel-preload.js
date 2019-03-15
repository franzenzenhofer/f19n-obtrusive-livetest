(page,done) =>
{
	let that = this; 
	
	let lable = "SPEED";
	let msg = "";
	let type = "warning"; 
	let what = "static";
	let prio = 500;

	let dom = page.getStaticDom();
	let selector = "link[rel*=preload]";
	let n = dom.querySelectorAll(selector);

	var hh = page.getHttpHeaders("last");
	if(!hh){done();return;} //wenn keine header, keine aussage
	var hr = page.getRawHttpHeaders("last");

	var nr_of_preloads_in_http = 0;
	var http_msg = "";
	for (var key in hh) {
		if(hh[key].includes('preload'))
		{
			nr_of_preloads_in_http++;
			
		}
	}

	

	if(nr_of_preloads_in_http>0)
	{
		type = "info";
		let elements = "elements";
		if(nr_of_preloads_in_http===1){elements = "element";}
		http_msg = nr_of_preloads_in_http+" Link preload "+elements+" found in the HTTP header. "+that.partialCodeLink(hh);
	}

	if(n.length>0)
	{
		type = "info";
		let elements = "elements";
		if(n.length===1){elements = "element";}
		msg = msg + n.length + " link[rel=preload] "+ elements +" found."+that.partialCodeLink(n);
		//done(that.createResult(lable, msg, type, what, prio));
		//return null; 
	}
	else
	{
		msg = "No link[rel=preload] elements found.";
	}
	
	if(n.length===0&&nr_of_preloads_in_http>0)
	{
		msg="";
	}

	done(that.createResult(lable, msg+" "+http_msg, type, what, prio));
	return null;
}