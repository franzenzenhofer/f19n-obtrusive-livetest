function(page, done){
  //warning the mobile friendly API is highly unstable (lots of 429 and 502)
  var that = this;
  var key = '%GOOGLE_API_KEY%';//<-- add your Google API key, get one here https://developers.google.com/webmaster-tools/search-console-api/v1/configure 
  var url2test = page.getURL('first');
  var mft ='https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run?key='+key;
  var mft_link="https://search.google.com/search-console/mobile-friendly?hl=en&url="+url2test;
  fetch(mft,
  {
      method: "POST",
	    mode: 'cors',
	    headers: new Headers({
		      'Content-Type': 'application/json'
	    }),
      body: JSON.stringify({
		      url: url2test
	   })
  }).then(function(response){
    if(response.status == 200)
    {
      response.json().then(function(data){
        if(data.mobileFriendliness=="MOBILE_FRIENDLY")
        {
          done(that.createResult('MOBILE', "Page is <a href='"+mft_link+"' target='_blank'>Mobile Friendly</a>.", "info"));
        }
        else {
          done(that.createResult('MOBILE', "Page is <a href='"+mft_link+"' target='_blank'>"+data.mobileFriendliness+"</a>.", "error"));
        }
      });
    }

    if(response.status !== 200)
    {
      //check for 429
      //check for 500
      //everything else
      //TODO a lowest priority sorting for failed tests
      console.log(response);
      done(that.createResult('MOBILE', "<a href='"+mft_link+"' target='_blank'>Mobile Friendly Test</a> unfinished! Response Status: HTTP "+response.status, "unfinished"));
    }
  })
  .catch(function(err){
    done(that.createResult('MOBILE', "<a href='"+mft_link+"' target='_blank'>Mobile Friendly Test</a> unfinished! "+err, "unfinished"));
    });
  return this.waitForAsync();
}
