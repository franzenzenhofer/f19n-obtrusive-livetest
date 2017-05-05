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
