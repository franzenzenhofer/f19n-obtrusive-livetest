(page,done) =>
{
	let that = this; 

	const all_header_received_events = page.eventsOfType('onHeadersReceived');
    const all_on_completed = page.eventsOfType('onCompleted');
    const all_onHistoryStateUpdated_events = page.eventsOfType('onHistoryStateUpdated');

    	let lable = "HTTP";
		let msg = "Page delivered an webapp internal JS logic (URL change via JS History (URL) State update)! Most rules will fail. Try ⇧+↻ for hard refresh. This is not an error with this page, but with the test execution of this app.";
		let type = "error"; //we set error as we need this response at the top
		let what = "";



    if(all_header_received_events.length>0||all_on_completed.length>0)
    {
    	done();return;
    }
	else if(all_onHistoryStateUpdated_events.length>0)
	{
		//we go with the default values
	}
	else
	{
		msg = "Unkown error! Could not collect the lifecycle of the page. Collected data:"+this.stringifyLink(page);
		type = "error";
	}
	done(that.createResult(lable, msg, type, what, 1000));return; 
}
