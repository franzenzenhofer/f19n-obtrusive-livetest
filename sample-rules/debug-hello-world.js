(page,done) =>
{
	let that = this; 
	
	let lable = "DEBUG";
	let msg = "Hello World";
	let type = "info"; 
	let what = "nothing";

	done(that.createResult(lable, msg, type, what));return; 
}
