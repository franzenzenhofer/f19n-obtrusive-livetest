function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.firstEventOfType('onHeadersReceived');
  if (!onHeadersReceivedEvent) { return null; }
  var { statusCode, responseHeaders: { location } } = onHeadersReceivedEvent;
  return Number(statusCode) !== 200 ? this.createResult(5, 'HTTP', `HTTP ${statusCode} -> ${location}`, 'warning') : null;
}
