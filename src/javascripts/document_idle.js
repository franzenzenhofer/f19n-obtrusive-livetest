chrome.runtime.sendMessage({ event: 'document_idle', data: { html: document.querySelector('html').innerHTML, location: document.location } });
