function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.firstEventOfType('onHeadersReceived');
  if (!onHeadersReceivedEvent) { return null; }
  var { statusCode, responseHeaders: { location } } = onHeadersReceivedEvent;
  return Number(statusCode) !== 200 ? ruleResult(5, 'HTTP', `HTTP ${statusCode} -> ${location}`, 'warning') : null;
}
