function(page, callback){
  var that = this;
  //configuration no longer necessary if global API key is set
  var key = '%GOOGLEAPIKEY%'; //<-- add your API key here https://developers.google.com/speed/docs/insights/v2/first-app#APIKey din't forget to enable it for Google Page Speed Insights
  const globals = that.getGlobals();
  if(!globals.variables.google_page_speed_insights_key)
  {
    if(key==='%'+'GOOGLEAPIKEY%'){
    callback(that.createResult('SPEED', '"<i>Old</i> Page Speed Insights desktop v2" rule not yet enabled! Set <a href="https://developers.google.com/speed/docs/insights/v4/first-app#APIKey" target="_blank">Google API Key</a> in <a href="'+that.getGlobals().rulesUrl+'" target="_blank">Settings</a>.', "warning"));
    return;
    }
  }
  else
  {
    key = globals.variables.google_page_speed_insights_key;
  }
  var strategy = 'desktop';
  var url = page.getURL('first');
  var type = 'info'; //as this is the old API, everything is INFO
  var color = 'lightgreen';
  var m_color = 'lightgreen';
  var psi ='https://www.googleapis.com/pagespeedonline/v2/runPagespeed?strategy='+strategy+'&url='+url+'&key='+key;



  fetch(psi)
  .then(
    function(response) {
      if (response.status !== 200) {
        callback(that.createResult('SPEED', 'No <i>old</i> Page Speed Insights v2 desktop data. (Response Status '+response.status+' '+response.text+')', "info"));
        return;
      }
      response.json().then(function(data) {
      	//console.log(data);

        var desktop_speed_score=data.ruleGroups.SPEED.score;

        if (desktop_speed_score < 85) {
          type = "error";
          color = "orange";
        }

        if (desktop_speed_score < 60) {
          type = "error";
          color = "red";
        }

        callback(that.createResult('SPEED', '<i>Old</i> Desktop Page Speed Insights v2 Score: <span style="background-color:'+color+'; font-weight:bold;">&nbsp;'+desktop_speed_score+'&nbsp;</span> <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&tab=desktop&url='+url+'" target="_blank">Page Speed Insights</a>', "info"));
      });
    }
  )
  .catch(function(err) {
    callback(that.createResult('SPEED', 'No <i>old</i> Page Speed Insights v2 <b>desktop</b> data. '+err+' <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', "info"));
  });

  //callback(this.createResult('test', "async test", "warning"));
  //return this.waitForAsync();
  //return('async');
}
