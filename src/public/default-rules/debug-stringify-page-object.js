function(page,done){
	var debug = '%DEBUG%'; //must be set to true
  	if(debug==='true')
  	{
		done(this.createResult("DEBUG", "Complete Page Object "+this.stringifyLink(page), "info", 9000));
	}
	done();
	return null;
}