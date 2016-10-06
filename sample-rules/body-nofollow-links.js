function(eventCollection) {
  // Get the last documentIdleEvent from the event collection
  var documentIdleEvent = eventCollection.documentIdleEvent();
  const what = "idle";

  // Return if no documentIdleEvent (and so location & document) found
  if (!documentIdleEvent) { return null; }

  var { location, document } = documentIdleEvent;

  // Helper method to normalize url and extract domain
  function domain(url) {
    return url.replace('http://', '').replace('https://', '').split('/')[0];
  };

  // Find all <a>-tags with rel=nofollow pointing to another domain
  var outgoingLinks = Array.prototype.filter.call(document.querySelectorAll('a[href^=http][rel=nofollow]'), function(link) {
    var href = link.getAttribute('href');
    return domain(href) != domain(location.href);
  });

  return outgoingLinks.length > 0 ? this.createResult('LINKS', `${outgoingLinks.length} outgoing links with rel nofollow`, 'info', what) : null;
}
