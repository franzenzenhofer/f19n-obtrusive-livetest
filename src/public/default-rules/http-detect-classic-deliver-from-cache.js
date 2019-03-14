function(page,done)
{
	const on_completed = page.firstEventOfType('onCompleted');
	if(on_completed && on_completed.fromCache && on_completed.fromCache===true)
	{
		done(this.createResult('HTTP', 'Page delivered via browser-cache! Some rules might not report or might fail. Try ⇧+↻ for hard refresh.', 'warning', null, 1000));
	}
	done();return;
} 