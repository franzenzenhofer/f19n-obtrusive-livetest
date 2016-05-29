function(eventCollection) {
  var documentIdleEvent = eventCollection.documentIdleEvent();

  // Return if no documentIdleEvent (and so location & document) found
  if (!documentIdleEvent) { return null; }

  var { location, document } = documentIdleEvent;
  var text = null;
  var type = 'info';

  var canonical = document.querySelector('link[rel=canonical]');

  // If we found some link with rel=canonical check the href attribute
  if (canonical) {
    var href = canonical.getAttribute('href');
    text = `canonical: ${href}`;

    // Change type to warning if href does not match with location.href
    if (href != location.href) {
      text = `canonical: ${href} != ${location.href}`;
      type = 'warning';
    }
  }

  return text ? this.createResult(1, 'HEAD', text, type) : null;
}
