function(page,done)
{
	let that=this;
	let p = page.getLocation('idle').protocol;
	console.log(p);
	if(p!=='http:'){ done();return; }
	let dom = page.getIdleDom();
	let inputs = dom.querySelectorAll('input,textarea');
	if(inputs.length>0)
	{
		let text =  "Unsecure http:// connection (not http<b>s</b>://) with user data elements."+that.partialCodeLink(inputs);
		let type = 'warning';
		let what = 'idle';
		done(that.createResult('DOM', text, type, what)); return;
	}
	done();return;
}
