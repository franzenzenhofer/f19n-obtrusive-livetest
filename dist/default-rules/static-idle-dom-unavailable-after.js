(page,done) =>
{
	let that = this; 
	let dom = page.getStaticDom();
	let lable = "DOM";
	let msg = " unavailable after meta information found:";
	let type = "warning"; 
	let what = "static";
	let selector ="meta[content^=unavailable_after]";
	let m = dom.querySelectorAll(selector);
	//via https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/is-crawlable.js 
	function isUnavailable(directive) {
  const parts = directive.split(':');

  if (parts.length <= 1 || parts[0] !== 'unavailable_after') {
    return false;
  }

  const date = Date.parse(parts.slice(1).join(':'));

  return !isNaN(date) && date < Date.now();
}
	if (!m || (m && m.length < 1))
	{
		done();return;
	}


	msg = m.length + msg +" "+ m[0].content +that.partialCodeLink(m); 

	if(isUnavailable(m[0].content))
	{
		type = "error";
		msg = msg + "Date already in the past!";
	}

	done(that.createResult(lable, msg, type, what));return; 
}
