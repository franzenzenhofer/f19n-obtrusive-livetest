//simple documented hello world

//page includes the page object, a collection of events during the pageload, including HTTP headers and the DOM during different stages of the pageload
//see /sample-rules/debug-stringify-page-object.js if you want to inspect the page object

//done is a callback that needs to get called for returning visible message to the application

//the function must be an anonymous function
//can be
//function(page,done) 
//or an arrow function
(page,done) =>
{
	//this includes the rule context, a collection of useful & necessary methods to create rules
	//see /src/javascripts/utils/RuleContext.js
	let that = this; 
	//as rules can get quite complex it's quite usefull to sace "this" in an unrelated variable

	//mandatory
	//lable is the second row of the result panel
	let lable = "DEBUG";

	//mandatory
	//msg is the actual output in the result panel of an rule, can include HTML,js,css
	let msg = "<span style='background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet); '><b>Hello</b> <a onclick='alert(\"Hello World\")' href='#'>World</a></span>";

	//optional
	//type determines the icon and color of the rule feedback
	let type = "info"; //normal gray, blue info icon //default value
	//let type = "warning"; //yellow background, yellow triangle icon
	//let type = "error"; //red background, red links, red (x) icon
	//let type = "unfinished"; // slightly transparent rule, no icon, indicaged that the rule has not finished

	//small lable in front of the message, normaly used to indicate what DOM has bennt tested 
	//let what = "static"; //info that the static dom was tested
	//let what = "idle"; //info that the idle dom was tested
	let what = "nothing"; //but actually can inlcude anything // default blank

	//we need to call, otherwise the rule will never finish (alsways display "WAIT")
	//createResult is a method from the /src/javascripts/utils/RuleContext.js to return sensemaking (then visible) to the application
	done(that.createResult(lable, msg, type, what));

	//stop rule execution completely
	return; 
}
