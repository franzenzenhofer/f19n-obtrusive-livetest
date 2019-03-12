var perf = window.performance;

chrome.runtime.sendMessage({ event: 'window_performance', data: { snapshot: 
	{
		'performance': perf,
		'navigation': performance.getEntriesByType('navigation'),
		'paint': performance.getEntriesByType("paint")
	}, location: document.location } });

chrome.runtime.sendMessage({ event: 'document_idle', data: { html: document.querySelector('html').innerHTML, location: document.location } });
