function(page, done){
  //warning the mobile friendly API is highly unstable (lots of 429 and 502)
  var that = this;
  //configuration no longer necessary if global key is set
  var key = '%GOOGLE_API_KEY%';//<-- add your Google API key, get one here https://developers.google.com/webmaster-tools/search-console-api/v1/configure 
  console.log('globals');
  const globals = that.getGlobals();
  console.log(globals);
  if(!globals.variables.google_mobile_friendly_test_key)
  {
    if(key==='%'+'GOOGLE_API_KEY%'){
      done(that.createResult('MOBILE', '"Mobile Friendly Test Async" rule not yet enabled! Set <a href="https://developers.google.com/webmaster-tools/search-console-api/v1/configure" target="_blank">Google API Key</a> in <a href="'+that.getGlobals().rulesUrl+'" target="_blank">Settings</a>.', "warning"));
      return;
    }
  }
  else
  {
    key = globals.variables.google_mobile_friendly_test_key;
  }
  var url2test = page.getURL('first');
  var mft ='https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run?key='+key;
  var mft_link="https://search.google.com/test/mobile-friendly?hl=en&url="+url2test;
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
  
      done(that.createResult('MOBILE', "<a href='"+mft_link+"' target='_blank'>Mobile Friendly Test</a> unfinished! Response Status: HTTP "+response.status, "unfinished"));
    }
  })
  .catch(function(err){
    done(that.createResult('MOBILE', "<a href='"+mft_link+"' target='_blank'>Mobile Friendly Test</a> unfinished! "+err, "unfinished"));
    });
}
