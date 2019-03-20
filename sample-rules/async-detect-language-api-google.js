(page,done) =>
{
	let that = this; 
	
	let lable = "DEBUG";
	let msg = "Hello World";
	let type = "info"; 
	let what = "nothing";
	let key = '%GOOGLE_API_KEY%'; if(key==='%'+'GOOGLE_API_KEY%'){ done();return;}
	let dom = page.getIdleDom();

	let u = 'https://translation.googleapis.com/language/translate/v2/detect?key='+key;

	let stringistring = dom.body.innerText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');

 fetch(u,
  {
      method: "POST",
	    mode: 'cors',
	    headers: new Headers({
		      'Content-Type': 'application/json'
	    }),
      body: JSON.stringify({
		      "q": stringistring
	   })
  }).then(function(response){
  	
    if(response.status == 200)
    {
      response.json().then(function(data){
      	
        if(data.mobileFriendliness=="MOBILE_FRIENDLY")
        {
          //done(that.createResult('MOBILE', "Page is <a href='"+mft_link+"' target='_blank'>Mobile Friendly</a>.", "info"));
        }
        else {
          //done(that.createResult('MOBILE', "Page is <a href='"+mft_link+"' target='_blank'>"+data.mobileFriendliness+"</a>.", "error"));
        }
      });
    }
   });

	//done(that.createResult(lable, msg, type, what));return; 
}
