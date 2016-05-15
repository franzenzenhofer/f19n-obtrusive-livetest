(eventCollection) ->
  documentIdleEvent = eventCollection.documentIdleEvent()

  until documentIdleEvent then  return null
  { location, document } = documentIdleEvent

  amp = document.querySelector('link[rel=amp]')

  if (amp)
    href = amp.getAttribute('href');
    text = "amp: ${href}"
  console.log(amp)
  return @createResult(1, 'HEAD', text, 'info')
  #return text ? this.createResult(1, 'HEAD', text, type) : null;
