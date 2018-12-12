function(page, done) {
  var url = page.getURL("last");
  var parser = document.createElement('a');
  parser.href = url;

/*
parser.protocol; // => "http:"
parser.hostname; // => "example.com"
parser.port;     // => "3000"
parser.pathname; // => "/pathname/"
parser.search;   // => "?search=test"
parser.hash;     // => "#hash"
parser.host;     // => "example.com:3000"
*/
  if(parser.pathname === '/')
  {
    //URL is in root, ending slash does not apply to root urls
    done();
  }
  if (url.indexOf('?')!=-1)
  {
      url = url.substr(0,url.indexOf('?'));
  }
  if (url.indexOf('#')!=-1)
  {
      url = url.substr(0,url.indexOf('#'));
  }
  var last_char = url.slice(-1);
  var new_url = "";
  var what_case = "";
  var what_case_opposite ="";
  var type = "info";
  if(last_char === '/')
  {
    new_url = url.substring(0,url.length-1);
    what_case = "without";
    what_case_opposite ="with";
  }
  else {
    new_url = url+"/";
    what_case = "with";
    what_case_opposite = "without";
  }
  //console.log(new_url);
  this.fetch(new_url, { responseFormat: 'text' }, (response) => {
    //console.log('fetch response');
    //console.log(response);
    if(response.status != 200)
    {
      type = 'warning';
      if(response.status == 404 ) {
        type = 'info';
      }
      else if(response.status == 410 ) {
        type = 'warning';
      }
      else if (response.status = 301) { //will never happen due to fetch API
        type = 'info';
      }
      else if (response.status = 302) { //will never happen due to fetch API
        type = 'error';
      }
      else if (response.status >= 500) {
        type = 'error';
      }
      done(this.createResult('URL', 'URL variation <b>'+what_case+'</b> trailingslash <a href="'+new_url+'" >'+new_url+'</a> returns HTTP '+response.status, type));
    }
    else {
      if(response.redirected == true )
      {

        if(response.url!=url) {
          type = 'error';
          done(this.createResult('URL', 'URL variation <b>'+what_case+'</b> trailingslash <a href="'+new_url+'" >'+new_url+'</a> triggers redirect to <a href="'+response.url+'" >'+response.url+"</a>.", type));
        }
        else {
          type = 'info';
          done(this.createResult('URL', 'URL variation <b>'+what_case+'</b> trailingslash <a href="'+new_url+'" >'+new_url+'</a> triggers redirect to <a href="'+response.url+'" >'+what_case_opposite+" trailingslash version</a> (OK).", type));
        }

      }
      else {
        //now we have to check for canonical
        var parser = new DOMParser();
        var static_dom = parser.parseFromString(response.body, "text/html");
        var c = static_dom.querySelectorAll('link[rel=canonical]');
        if(c.length === 1)
        {


          var found_canonical_url = c[0].href;
          //the canonical URL might be this URL or the variaton (with/without) trailing slash, both cases might be ok
          //any other case is not ok an triggers an error
          if(found_canonical_url!=url && found_canonical_url != new_url )
          {
            type="error";
            done(this.createResult('URL', 'URL variation <b>'+what_case+'</b> trailingslash <a href="'+new_url+'" >'+new_url+'</a> returns HTTP '+response.status+'. Canonical points to <a href="'+found_canonical_url+'">'+found_canonical_url+'</a>', type));
          }
          else {

            if(found_canonical_url==url)
            {
              type = "info";
            done(this.createResult('URL', 'URL variation <b>'+what_case+'</b> trailingslash <a href="'+new_url+'" target="_blank">'+new_url+'</a> returns HTTP '+response.status+'. Canonical points back to <a href="'+found_canonical_url+'">'+what_case_opposite+' trailingslash version</a> (OK).', type));
            }
            else //found_canonical_url != new_url
            {
              type = "warning";
              done(this.createResult('URL', 'URL variation <b>'+what_case+'</b> trailingslash <a href="'+new_url+'" target="_blank">'+new_url+'</a> returns HTTP '+response.status+'. Canonical points back to <a href="'+found_canonical_url+'"><b>'+what_case+'</b> trailingslash version</a>. Currently not on the canonical URL.', type));
            }
          }
        }
        else {
          done(this.createResult('URL', 'URL variation <b>'+what_case+'</b> trailingslash <a href="'+new_url+'">'+new_url+'</a> returns HTTP '+response.status+'. No valid canonical found!', 'error'));
        }
      }
    }
  });
}
