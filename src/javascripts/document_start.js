var domContLoadedCallback = (e) => {
  chrome.runtime.sendMessage({ event: 'DOMContentLoaded', data: { html: document.querySelector('html').innerHTML, location: document.location } });
  document.removeEventListener('DOMContentLoaded', domContLoadedCallback);
}

document.addEventListener('DOMContentLoaded', domContLoadedCallback, {once:true});

document.addEventListener('load', (e)=>{
  chrome.runtime.sendMessage({ event: 'load', data: { html: document.querySelector('html').innerHTML, location: document.location } });
});

fetch(document.location.href)
  .then(
    function(response) {
      response.text().then(function(data) {
  chrome.runtime.sendMessage({ event: 'Fetch', data: { html: data, location: document.location } });
      });
    }
  )
