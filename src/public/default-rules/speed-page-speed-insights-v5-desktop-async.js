function(page, callback){
  var that = this;
  //configuration no longer necessary if global API key is set
  var key = '%GOOGLEAPIKEY_PSI_NEW%'; //<-- add your API key here https://developers.google.com/speed/docs/insights/v5/get-started 
  const globals = that.getGlobals();
  if(!globals.variables.google_page_speed_insights_key)
  {
    if(key==='%'+'GOOGLEAPIKEY_PSI_NEW%'){
    callback(that.createResult('SPEED', '<b>New</b> "Page Speed Insights v5 desktop" rule not yet enabled! Set <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank">Google API Key</a> in <a href="'+that.getGlobals().rulesUrl+'" target="_blank">Settings</a>.', "warning"));
    return;
    }
  }
  else
  {
    key = globals.variables.google_page_speed_insights_key;
  }
  var strategy = 'desktop';
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
        callback(that.createResult('SPEED', 'No Page Speed Insights v5 desktop data. (Response Status '+response.status+' '+response.text+')', "warning"));
        return;
      }
      response.json().then(function(data) {
        var lighthouse_score=data.lighthouseResult.categories.performance.score;
        var lighthouse_score=Math.round(lighthouse_score*100);
        

        
        if (lighthouse_score < 90) {
          type = "warning";
          color = "orange";
        }

        if (lighthouse_score < 50) {
          type = "error";
          color = "red";
        }

        callback(that.createResult(
          'SPEED', 
          'Page Speed Insights v5 Desktop: <span style="background-color:'+color+'; font-weight:bold;">&nbsp;'+lighthouse_score+'&nbsp;</span> <a href="https://developers.google.com/speed/pagespeed/insights/?tab=desktoph&l=en&url='+url+'" target="_blank">Page Speed Insights</a>', type));
      });
    }
  )
  .catch(function(err) {
    callback(that.createResult('SPEED', 'No Page Speed Insights v5 <b>desktop</b> data. '+err+' <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', "warning"));
  });

  //callback(this.createResult('test', "async test", "warning"));
  //return this.waitForAsync();
  //return('async');
}