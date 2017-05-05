function(page, callback){
  var that = this;
  var key = '%GOOGLEAPIKEY%'; //<-- add your API key here https://developers.google.com/speed/docs/insights/v2/first-app#APIKey din't forget to enable it for Google Page Speed Insights
  var strategy = 'mobile';
  var url = page.getURL('first');
  var type = 'info';
  var color = 'lightgreen';
  var m_color = 'lightgreen';
  var psi ='https://www.googleapis.com/pagespeedonline/v2/runPagespeed?strategy='+strategy+'&url='+url+'&key='+key;

  fetch(psi)
  .then(
    function(response) {
      if (response.status !== 200) {
        callback(that.createResult('SPEED', 'No Page Speed Insights mobile data. (Response Status '+response.status+' '+response.text+')', "warning"));
        return;
      }
      response.json().then(function(data) {
        var mobile_speed_score=data.ruleGroups.SPEED.score;
        var mobile_usability_score=data.ruleGroups.USABILITY.score;

        if (mobile_speed_score < 80) {
          type = "error";
          color = "orange";
        }

        if (mobile_speed_score < 60) {
          type = "error";
          color = "red";
        }

        if(mobile_usability_score < 80) {
          m_color = "orange";
        }
        if(mobile_usability_score < 80) {
          m_color = "red";
        }
        callback(that.createResult('SPEED', 'Mobile Page Speed Insights Score: <span style="background-color:'+color+'; font-weight:bold;">&nbsp;'+mobile_speed_score+'&nbsp;</span> (Mobile Usability Score: <span style="background-color:'+m_color+'; font-weight:bold;">&nbsp;'+mobile_usability_score+'&nbsp;</span>) <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', type));
      });
    }
  )
  .catch(function(err) {
    callback(that.createResult('SPEED', 'No Page Speed Insights <b>mobile</b> data. '+err+' <a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', "warning"));
  });

  //callback(this.createResult('test', "async test", "warning"));
  //return this.waitForAsync();
  //return('async');
}
