chrome.runtime.sendMessage({ event: 'window_PerformanceNavigationTiming', data: { snapshot: window.PerformanceNavigationTiming, location: document.location } });

chrome.runtime.sendMessage({ event: 'window_performance', data: { snapshot: window.performance, location: document.location } });

chrome.runtime.sendMessage({ event: 'document_idle', data: { html: document.querySelector('html').innerHTML, location: document.location } });
