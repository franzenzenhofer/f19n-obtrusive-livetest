(page,done) =>
{
	let that = this; 
	
	let lable = "BODY";
	let msg = "";
	let type = "info"; 
	let what = "idle, static";

	let selector = "a[href*='?']";

	let dom = page.getIdleDom();
	let sdom = page.getStaticDom();
	let n = dom.querySelectorAll(selector);
	let n_static = sdom.querySelectorAll(selector);

	let n_array = []
	n.forEach(function (elem, index) {
    	n_array.push(elem.getAttribute('href'));
	});
	let static_extra_elems = [];
	n_static.forEach(function (elem, index) {

    	if(!n_array.includes(elem.getAttribute('href')))
    	{
    		static_extra_elems.push(elem);
    	}
	});

	if(n.length>0)
	{
		msg = msg + n.length+" links with parameters found."+that.partialCodeLink(n)+that.highlightLink(selector, "Highlight paramterized links");
		//msg = msg + " <a href='javascript://' onclick=\"for(e of window.top.document.querySelectorAll('*[rel=nofollow]')){e.style.border='5px solid red';}\">Highlight Nofollow</a>";
		if(static_extra_elems.length>0)
		{
			msg = msg + " Additonal "+static_extra_elems.length+" parametrized links found only in the static HTML."+that.partialCodeLink(static_extra_elems);
		}
		if(n.length+static_extra_elems.length>10)
		{
			type = "warning";
		}
		done(that.createResult(lable, msg, type, what, 500));return; 
	}
	done();return;
	
}
