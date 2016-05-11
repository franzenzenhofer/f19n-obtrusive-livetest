## Custom rules

A custom rule consists of one javascript function receiving an `EventCollection` as first argument and must return a valid rule result (see below).


### Example rules

Always returns the host of the visited site

```javascript
function(eventCollection) {
  var documentEndEvent = eventCollection.documentEndEvent();

  // Return if no documentEndEvent (and so location) found
  if (!documentEndEvent) { return null; }

  var { location } = documentEndEvent;
  var { createResult } = this;

  return createResult(1, 'GET', location.host);
}
```

Counts the occurrence of paragraph elements after document idle

```javascript
function(eventCollection) {
  var documentIdleEvent = eventCollection.documentIdleEvent();

  // Return if no documentIdleEvent (and so location) found
  if (!documentIdleEvent) { return null; }

  var { document } = documentIdleEvent;
  var { createResult } = this;
  
  var countElements = document.querySelectorAll('p').length;

  return createResult(1, 'STATS', `found ${countElements} paragraph elements`);
}
```

### EventCollection

The `EventCollection` holds all the occurred events during the page load. See [example data](src/javascripts/constants/sampleEvents.js).

#### List of possible events

- onBeforeNavigate
- onCommitted
- onBeforeSendHeaders
- onBeforeRequest
- onCompleted
- responseHeaders
- documentEnd
- documentIdle

#### Methods

An `EventCollection` instance provides the following methods to easely filter for relevant events.

##### firstEventOfType(type [STRING])

Returns the first event of the given type.
Some events can occur multiple times during a page request (for example `onHeadersReceived`, `onBeforeRequest`, `onCommitted`, …).

```javascript
function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.firstEventOfType('onHeadersReceived');
  …
}
```
