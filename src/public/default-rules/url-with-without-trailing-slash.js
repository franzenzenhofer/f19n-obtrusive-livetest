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
    console.log('root url');
    done();
  }
  if (url.indexOf('?')!=-1)
  {
      url = url.substr(0,url.indexOf('?'));
  }
  var last_char = url.slice(-1);
  var new_url = "";
  var what_case = "";
  var type = "info";
  if(last_char === '/')
  {
    new_url = url.substring(0,url.length-1);
    what_case = "without";
  }
  else {
    new_url = url+"/";
    what_case = "with";
  }
  console.log(new_url);
  this.fetch(new_url, { responseFormat: 'text' }, (response) => {
    //console.log('fetch response');
    console.log(response);
    if(response.status != 200)
    {
      type = 'warning';
      if(response.status == 404) {
        type = 'info';
      }
      else if (response.status = 301) {
        type = 'info';
      }
      else if (response.status = 302) {
        type = 'error';
      }
      else if (response.status >= 500) {
        type = 'error';
      }
      done(this.createResult('URL', 'URL variation '+what_case+' trailingslash <a href="'+new_url+'" target="_blank">'+new_url+'</a> returns HTTP '+response.status, type));
    }
    else {
      //now we have to check for canonical
      done(this.createResult('URL', 'URL variation '+what_case+' trailingslash <a href="'+new_url+'" target="_blank">'+new_url+'</a> returns HTTP '+response.status+' (Check for canonical)', 'warning'));
    }
  });
}
