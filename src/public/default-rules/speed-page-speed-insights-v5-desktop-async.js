function(page, callback){
  var that = this;
  var key = '%GOOGLEAPIKEY_PSI_NEW%'; //<-- add your API key here https://developers.google.com/speed/docs/insights/v2/first-app#APIKey din't forget to enable it for Google Page Speed Insights
  if(key==='%'+'GOOGLEAPIKEY_PSI_NEW%'){
    callback(that.createResult('SPEED', '"Page Speed Insights v5 desktop" rule not yet enabled! Set <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank">Google API Key</a> in <a href="'+that.getGlobals().rulesUrl+'" target="_blank">Settings</a>.', "warning"));
    return;
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
        callback(that.createResult('SPEED', 'No Page Speed Insights desktop data. (Response Status '+response.status+' '+response.text+')', "warning"));
        return;
      }
      response.json().then(function(data) {
        var mobile_lighthouse_score=data.lighthouseResult.categories.performance.score;
        var mobile_lighthouse_score=mobile_lighthouse_score*100;
        
        if (data.loadingExperience.hasOwnProperty('metrics')){
          var first_contentful_paint_data=data.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.percentile;
          var first_input_delay_data=data.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.percentile;
          
          var first_contentful_paint_score=data.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category;
          var first_input_delay_score=data.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category;
        }
        
        if (mobile_lighthouse_score < 90) {
          type = "error";
          color = "orange";
        }

        if (mobile_lighthouse_score < 50) {
          type = "error";
          color = "red";
        }

        if(first_contentful_paint_data > 1000) {
          fcp_color = "orange";
        }
        if(first_contentful_paint_data > 2500) {
          fcp_color = "red";
        }

        if(first_input_delay_data > 50) {
          fid_color = "orange";
        }
        if(first_input_delay_data > 250) {
          fid_color = "red";
        }

        callback(that.createResult(
          'SPEED', 
          '<b>Desktop Page Speed Insights (v5)/Desktop</b><br>Lighthouse Score: <span style="background-color:'+color+'; font-weight:bold;">&nbsp;'+mobile_lighthouse_score+'&nbsp;</span><br>First Contentful Paint (FCP): <span style="background-color:'+fcp_color+';font-weight:bold;">&nbsp;'+first_contentful_paint_data+'&nbsp;</span> <span style="background-color:'+fcp_color+';font-weight:bold;">&nbsp;'+first_contentful_paint_score+'&nbsp;</span><br>First Input Delay (FID): <span style="background-color:'+fid_color+';font-weight:bold;">&nbsp;'+first_input_delay_data+'&nbsp;</span> <span style="background-color:'+fid_color+';font-weight:bold;">&nbsp;'+first_input_delay_score+'&nbsp;</span><br><a href="https://developers.google.com/speed/pagespeed/insights/?hl=en&url='+url+'" target="_blank">Page Speed Insights</a>', type));
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