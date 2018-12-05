function(page, callback){
  var that = this;
  var key = '%GOOGLEAPIKEY_PSI_NEW%'; //<-- add your API key here https://developers.google.com/speed/docs/insights/v5/get-started
  if(key==='%'+'GOOGLEAPIKEY_PSI_NEW%'){
    callback(that.createResult('SPEED', '<b>New</b> "Page Speed Insights v5 mobile" rule not yet enabled! Set <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank">Google API Key</a> in <a href="'+that.getGlobals().rulesUrl+'" target="_blank">Settings</a>.', "warning"));
    return;
  }
  var strategy = 'mobile';
  var url = page.getURL('first');
  var type = 'info';
  var color = 'lightgreen';
  var fcp_color = 'lightgreen';
  var fid_color = 'lightgreen';
  var psi ='https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url='+encodeURIComponent(url)+'&strategy='+strategy+'&key='+key;

  fetch(psi)
  .then(
    function(response) {
      if (response.status !== 200) {
        callback(that.createResult('SPEED', 'No Page Speed Insights mobile v5 data. (Response Status '+response.status+' '+response.text+')', "warning"));
        return;
      }
      response.json().then(function(data) {
        var mobile_lighthouse_score=data.lighthouseResult.categories.performance.score;
        var mobile_lighthouse_score=Math.round(mobile_lighthouse_score*100);
        
        
        if (mobile_lighthouse_score < 90) {
          type = "warning";
          color = "orange";
        }

        if (mobile_lighthouse_score < 50) {
          type = "error";
          color = "red";
        }

        callback(that.createResult(
          'SPEED', 
          'Page Speed Insights v5 Mobile: <span style="background-color:'+color+'; font-weight:bold;">&nbsp;'+mobile_lighthouse_score+'&nbsp;</span> <a href="https://developers.google.com/speed/pagespeed/insights/?tab=mobile&hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', type));
      });
    }
  )
  .catch(function(err) {
    callback(that.createResult('SPEED', 'No Page Speed Insights v5 <b>mobile</b> data. '+err+' <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', "warning"));
  });

  //callback(this.createResult('test', "async test", "warning"));
  //return this.waitForAsync();
  //return('async');
}