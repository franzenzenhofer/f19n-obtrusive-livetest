function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.firstEventOfType('onHeadersReceived');
  var { responseHeaders } = onHeadersReceivedEvent;
  return responseHeaders && responseHeaders['x-robots-tag'] ? this.createResult(10, 'HTTP', `X-Robots-Tag: ${responseHeaders['x-robots-tag']}`, 'warning') : null;
}
