## Custom rules

A custom rule consists of one javascript function receiving an `EventCollection` as first argument and must return a valid rule result (see below).

- [EventCollection](#eventcollection)
- [RuleContext](#rulecontext) (rule helper methods)


### Some example rules (more [here](/sample-rules))

Always returns the host of the visited site

```javascript
function(eventCollection) {
  var documentEndEvent = eventCollection.documentEndEvent();

  // Return if no documentEndEvent (and so location) found
  if (!documentEndEvent) { return null; }

  var { location } = documentEndEvent;

  return { priority: 1, label: 'DEBUG', type: 'info', message: `Loaded ${location.href}` };
}
```

Counts the occurrence of paragraph elements after document idle

```javascript
function(eventCollection) {
  var documentIdleEvent = eventCollection.documentIdleEvent();

  // Return if no documentIdleEvent (and so location) found
  if (!documentIdleEvent) { return null; }

  var { document } = documentIdleEvent;
  
  var countElements = document.querySelectorAll('p').length;

  return this.createResult(1, 'STATS', `found ${countElements} paragraph elements`);
}
```

## EventCollection

The `EventCollection` holds all the occurred events during the page load.

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

##### events()

Returns the full unfiltered list of events.

```javascript
function(eventCollection) {
  var allEvents = eventCollection.events();
  return this.createResult(1, 'DEBUG', `Events count: ${allEvents.length}`);
}
```

##### eventsOfType(type [STRING])

Returns a list (Array) of events for the given type.

```javascript
function(eventCollection) {
  var allOnCommittedEvents = eventCollection.eventsOfType('onCommitted');
  return this.createResult(1, 'DEBUG', `onCommitted count: ${allOnCommittedEvents.length}`);
}
```

##### firstEventOfType(type [STRING])

Returns the first event of the given type.
Some events can occur multiple times during a page request (for example `onHeadersReceived`, `onBeforeRequest`, `onCommitted`, …).

```javascript
function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.firstEventOfType('onHeadersReceived');
  var statusCode = onHeadersReceivedEvent.statusCode;
  return this.createResult(1, 'DEBUG', `First statusCode: ${statusCode}`);
}
```

##### lastEventOfType(type [STRING])

Like `firstEventOfType` except it returns the last event of the given type.

```javascript
function(eventCollection) {
  var onHeadersReceivedEvent = eventCollection.lastEventOfType('onHeadersReceived');
  var statusCode = onHeadersReceivedEvent.statusCode;
  return this.createResult(1, 'DEBUG', `Last statusCode: ${statusCode}`);
}
```

##### documentEndEvent()

Returns a special event containing `document` (a `DOMParser` instance representing the DOM before `window.onLoad`), `location` object, and the pure `html` as string. 

```javascript
function(eventCollection) {
  var documentEndEvent = eventCollection.documentEndEvent();
  var { document, location, html } = documentEndEvent;
  var host = location.host;
  var divs = document.querySelectorAll('div').length;
  return this.createResult(1, 'DEBUG', `${divs} div elements found on ${location.host}`);
}
```

##### documentIdleEvent()

Like `documentEndEvent` except it represents the DOM, location and HTML after `window.onLoad`.


## RuleContext (rule helper methods)
