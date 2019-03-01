(page,done) =>
{
	let that = this;
	let lable = "PLZ";
	let msg = 'Wohoo, more than 1000 active users! So, so cool! But only <a href="https://chrome.google.com/webstore/detail/full-stack-optimization-l/jbnaibigcohjfefpfocphcjeliohhold?hl=en" target="_blank">6 reviews</a> 😢. <b>Please <span style="background: linear-gradient(to right, red, orange, green, cyan, blue, violet); -webkit-background-clip: text;-webkit-text-fill-color: transparent;">review</span> this app in the <a href="https://chrome.google.com/webstore/detail/full-stack-optimization-l/jbnaibigcohjfefpfocphcjeliohhold" target="_blank">Google Chrome Store</a>!</b> 👍 Thx! <br> You can disable this message in the <a href="'+that.getGlobals().rulesUrl+'" target="_blank" >Settings</a>.';
	let type = "promotion"; 
	let what = "";

	done(that.createResult(lable, msg, type, what));return; 

	
}