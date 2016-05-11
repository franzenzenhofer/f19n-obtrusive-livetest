function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.firstEventOfType('onHeadersReceived');
  var { responseHeaders } = onHeadersReceivedEvent;
  var contentLength = responseHeaders['content-length'];
  var encoding = responseHeaders['content-encoding'];
  var contentSizeInKb = contentLength / 1024;
  return encoding === 'gzip' && contentSizeInKb > 14.6 ? this.createResult(2, 'SPEED', `HTML size gzip: ${contentSizeInKb}`, 'warning') : null;
}
