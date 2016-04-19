chrome.runtime.sendMessage({ event: "document_end", data: { html: document.querySelector('html').innerHTML, location: document.location } });
