var domContLoadedCallback = (e) => {
  chrome.runtime.sendMessage({ event: 'DOMContentLoaded', data: { html: document.querySelector('html').innerHTML, location: document.location } });
  document.removeEventListener('DOMContentLoaded', domContLoadedCallback);
}

document.addEventListener('DOMContentLoaded', domContLoadedCallback, {once:true});

var loadCallback = (e) => {
  chrome.runtime.sendMessage({ event: 'load', data: { html: document.querySelector('html').innerHTML, location: document.location } });
  document.removeEventListener('load', loadCallback);
}

document.addEventListener('load', loadCallback, {once:true});

fetch(document.location.href)
  .then(
    function(response) {
      response.text().then(function(data) {
  chrome.runtime.sendMessage({ event: 'fetch', data: { html: data, location: document.location } });
      });
    }
  )

var robotstxtUrl = document.location.origin+"/robots.txt"
var fake_robots_txt_location_object = {
  "hash":"",
  "host":document.location.host,
  "hostname":document.location.hostname,
  "href": robotstxtUrl,
  "origin": document.location.origin,
  "pathname": "/robots.txt",
  "port":document.location.port,
  "protocol":document.location.protocol,
  "search":""
}

fetch(robotstxtUrl)
  .then(
    function(response) {
      var content_type = response && response.headers && response.headers.get("content-type") &&  response.headers.get("content-type").trim().toLowerCase();
      if(response.status !== 200) {
        chrome.runtime.sendMessage({ event: 'robotstxt', data: { status: response.status, statusText: response.statusText, ok: false, txt:"", location: fake_robots_txt_location_object, contentType: content_type }});
        return null;
      }
      if(content_type.indexOf('text/plain')===-1)
      {
        chrome.runtime.sendMessage({ event: 'robotstxt', data: { status: response.status, statusText: response.statusText, ok: false, txt:"", location: fake_robots_txt_location_object, contentType: content_type }});
        return null;
      }
      response.text().then(function(data) {
        chrome.runtime.sendMessage({ event: 'robotstxt', data: { status: response.status, statusText: response.statusText, ok: true, txt: data, location: fake_robots_txt_location_object, contentType: content_type } });
      });
    }
  )

  var soft404Url = document.location.href.substr(0, document.location.href.replace(document.location.search, '').lastIndexOf('/')+1)+'hudriwudri'+Math.floor(Math.random()*10000000);
  var fake_soft_404_location_object = {
    "hash":"",
    "host":document.location.host,
    "hostname":document.location.hostname,
    "href": soft404Url,
    "origin": document.location.origin,
    "pathname": soft404Url.replace(document.location.origin, ''),
    "port":document.location.port,
    "protocol":document.location.protocol,
    "search":""
  }

  fetch(soft404Url)
    .then(
      function(response) {
        var content_type = response && response.headers && response.headers.get("content-type") && response.headers.get("content-type").trim().toLowerCase();
        if(response.status !== 404) {
          chrome.runtime.sendMessage({ event: 'soft404test', data: { status: response.status, statusText: response.statusText, ok: false, location: fake_soft_404_location_object, contentType: content_type }});
          return null;
        }
        chrome.runtime.sendMessage({ event: 'soft404test', data: { status: response.status, statusText: response.statusText, ok: true, location: fake_soft_404_location_object, contentType: content_type }});
      }
    )
