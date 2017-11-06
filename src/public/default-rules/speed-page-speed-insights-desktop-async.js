function(page, callback){
  var that = this;
  var key = '%GOOGLEAPIKEY%'; //<-- add your API key here https://developers.google.com/speed/docs/insights/v2/first-app#APIKey din't forget to enable it for Google Page Speed Insights
  if(key==='%'+'GOOGLEAPIKEY%'){
    callback(that.createResult('SPEED', '"Page Speed Insights desktop" rule not yet enabled! Set <a href="https://developers.google.com/speed/docs/insights/v2/first-app#APIKey " target="_blank">Google API Key</a> in Settings.', "warning"));
    return;
  }
  var strategy = 'desktop';
  var url = page.getURL('first');
  var type = 'info';
  var color = 'lightgreen';
  var m_color = 'lightgreen';
  var psi ='https://www.googleapis.com/pagespeedonline/v2/runPagespeed?strategy='+strategy+'&url='+url+'&key='+key;



  fetch(psi)
  .then(
    function(response) {
      if (response.status !== 200) {
        callback(that.createResult('SPEED', 'No Page Speed Insights desktop data. (Response Status '+response.status+' '+response.text+')', "warning"));
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

        callback(that.createResult('SPEED', 'Desktop Page Speed Insights Score: <span style="background-color:'+color+'; font-weight:bold;">&nbsp;'+desktop_speed_score+'&nbsp;</span> <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&tab=desktop&url='+url+'" target="_blank">Page Speed Insights</a>', type));
      });
    }
  )
  .catch(function(err) {
    callback(that.createResult('SPEED', 'No Page Speed Insights <b>desktop</b> data. '+err+' <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', "warning"));
  });

  //callback(this.createResult('test', "async test", "warning"));
  //return this.waitForAsync();
  //return('async');
}
