function(page, callback){
  //warning the mobile friendly API is highly unstable (lots of 429 and 502)
  var that = this;
  var key = '';//<-- add your Google API key here
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
    console.log(response);
    if(response.status == 200)
    {
      response.json().then(function(data){
        if(data.mobileFriendliness=="MOBILE_FRIENDLY")
        {
          callback(that.createResult('MOBILE', "Page is <a href='"+mft_link+"' target='_blank'>Mobile Friendly</a>.", "info"));
        }
        else {
          callback(that.createResult('MOBILE', "Page is <a href='"+mft_link+"' target='_blank'>"+data.mobileFriendliness+"</a>.", "error"));
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
      callback(that.createResult('MOBILE', "<a href='"+mft_link+"' target='_blank'>Mobile Friendly Test</a> failed! Response Status: "+response.status+' '+response.text(), "warning"));
    }
  })
  .catch(function(err)
    //TODO failes test should be lables as such, not a warning
    callback(that.createResult('MOBILE', "<a href='"+mft_link+"' target='_blank'>Mobile Friendly Test</a> failed! "+err, "warning"));
  });
  return this.waitForAsync();
}
