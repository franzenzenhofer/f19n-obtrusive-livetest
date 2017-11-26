(page,done) =>
{
	let that = this; 
	//var hh = page.getHttpHeaders("last");
  	var hr = page.getRawHttpHeaders("last");
  	var hr_stringy = JSON.stringify(hr, null, 2);
	let lable = "HTTP";
	let msg = "Unavailable after HTTP header found.";
	let type = "warning"; 
	
	if (hr_stringy.search(/unavailable_after/ig)===-1)
	{
		done();return;
	}
	msg = msg + that.partialCodeLink(hr); 


	done(that.createResult(lable, msg, type));return; 
}
