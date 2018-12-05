(page,done) =>
{
	let that = this;
	let lable = "BOOK";
	let msg = '<b>Please support this app!</b> Buy the awesome book<br>"<a href="https://www.fullstackoptimization.com/b/understanding-seo" target="_blank">Understanding SEO</a>" by the creator of this software. - New: <a href="https://gumroad.com/l/understanding-seo" target="_blank"><b>DRM-Free Ebook</b></a>. <br> You can disable this message in the <a href="'+that.getGlobals().rulesUrl+'" target="_blank" >Settings</a>.';
	let type = "promotion"; 
	let what = "";

	done(that.createResult(lable, msg, type, what));return; 

	
}