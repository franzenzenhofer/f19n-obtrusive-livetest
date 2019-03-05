function(page, done) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var u = page.getURL("last");

  var hsts_set = true;
  var hsts_duration = "";
  var color = 'lightgreen';
  var type = 'info';

  if(!hh){done();return;} //wenn keine header, keine aussage

  var hsts = hh['strict-transport-security'] || "";
  
  if (hsts.indexOf('max-age')===-1)
  {
    hsts_set = false;
  } else {
    var max_age = hsts.match(/max-age=(\d+)/);
    console.log(max_age);
    if (max_age) {
      hsts_duration = max_age[0];
      if (max_age[1] < 31536000) {
        color = 'orange';
        type = 'warning';
      }
    }
  }


  if(hsts_set == false)
  {
    done(this.createResult('HTTP', "no <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' target='_blank'>HSTS header</a> set! - <a href='https://hstspreload.org/?domain="+u+"' target='_blank'>Test</a>"+ this.partialCodeLink(hr), 'error'));
  }
  
  if(hsts_set == true)
  {
    done(this.createResult('HTTP', "<a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' target='_blank'>HSTS header</a> is set. - with a duration of: <span style='background-color:"+color+";font-weight:bold;'>" + hsts_duration + "</span>" + this.partialCodeLink(hr), type));
  }

  done();
}


