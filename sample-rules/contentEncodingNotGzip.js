function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.firstEventOfType('onHeadersReceived');
  var { responseHeaders } = onHeadersReceivedEvent;
  var encoding = responseHeaders['content-encoding'];
  return !encoding || encoding !== 'gzip' ? ruleResult(5, 'HTTP', `Content-Encoding: ${encoding}`, 'warning') : null;
}
