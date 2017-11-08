function(page, done) {
	let urls_all = [page.getURL("first"),page.getURL("last")];
	let urls = [...new Set(urls_all)]; 

	//in a loop over all URLs
	//get the robots.txt of the domain
	//cache it (so to fetch it only once in this rule)
	//create a gatekpeeper https://runkit.com/embed/rdfyl6vkcn5p
	//check if the URL is not allowed
	//if not, ask the gatekeeper why
	//return sensemaking why message with link to robots.txt
	//and link to google serach console robots.txt tester
	done();
}