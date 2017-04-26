## Custom rules

A custom rule consists of one javascript function receiving an `Page` object as first argument and must return a [valid rule result](#rulecontext).

- [Page Object](#page)
- [RuleContext](#rulecontext) (rule helper methods)


### Some example rules (more [here](/sample-rules))

Always returns the host of the visited site

```javascript
function(page) {
  var documentEndEvent = page.documentEndEvent();

  // Return if no documentEndEvent (and so location) found
  if (!documentEndEvent) { return null; }

  var { location } = documentEndEvent;

  //you can either return
  //return { label: 'DEBUG', type: 'info', message: `Loaded ${location.href}`};
  //return this.createResult(label, msg, type, [what]*); //what is a kind of sublable attached to the front of the message
  return this.createResult('DEBUG', `Loaded ${location.href}`, 'info');
}
```

Counts the occurrence of paragraph elements after document idle

```javascript
function(page) {
  var documentIdleEvent = page.documentIdleEvent();

  // Return if no documentIdleEvent (and so location) found
  if (!documentIdleEvent) { return null; }

  var { document } = documentIdleEvent;

  var countElements = document.querySelectorAll('p').length;

  return this.createResult('STATS', `found ${countElements} paragraph elements`);
}
```

Rules can also have an async return via callback!
This only make sense if have any async logic (i.e. a call to an extern API) from within your rule-function.

```javascript
function(page, callback) {
  var documentIdleEvent = page.documentIdleEvent();

  // Return if no documentIdleEvent (and so location) found
  if (!documentIdleEvent) { return null; }

  var { document } = documentIdleEvent;

  var countElements = document.querySelectorAll('p').length;

  callback(that.createResult(this.createResult('STATS', `found ${countElements} paragraph elements`));

  //an sync return must tell the rule parse that it's not done yet and it should wait for the asyncreturn
  //this waitForAsync must be return async function to work
  return this.waitForAsync();
}
```

## page

The `page`-object is basically a collection of events. This event-collection holds all the occurred events during the page load.

#### List of possible events

- onBeforeNavigate
- onCommitted
- onBeforeSendHeaders
- onBeforeRequest
- onCompleted
- responseHeaders
- documentEnd
- documentIdle

additional custom event that have additonal information about the envirment

- fetch - a static represenation of the DOM via the window.fetch event (an unscripted envirment)+



#### Methods

An `page` instance provides the following methods to easely filter for relevant events.

##### events()

Returns the full unfiltered list of events.

```javascript
function(page) {
  var allEvents = page.events();
  return this.createResult('DEBUG', `Events count: ${allEvents.length}`);
}
```

##### eventsOfType(type [STRING])

Returns a list (Array) of events for the given type.

```javascript
function(page) {
  var allOnCommittedEvents = page.eventsOfType('onCommitted');
  return this.createResult('DEBUG', `onCommitted count: ${allOnCommittedEvents.length}`);
}
```

##### firstEventOfType(type [STRING])

Returns the first event of the given type.
Some events can occur multiple times during a page request (for example `onHeadersReceived`, `onBeforeRequest`, `onCommitted`, …).

```javascript
function(page) {
  var onHeadersReceivedEvent = page.firstEventOfType('onHeadersReceived');
  var statusCode = onHeadersReceivedEvent.statusCode;
  return this.createResult('DEBUG', `First statusCode: ${statusCode}`);
}
```

##### lastEventOfType(type [STRING])

Like `firstEventOfType` except it returns the last event of the given type.

```javascript
function(page) {
  var onHeadersReceivedEvent = page.lastEventOfType('onHeadersReceived');
  var statusCode = onHeadersReceivedEvent.statusCode;
  return this.createResult('DEBUG', `Last statusCode: ${statusCode}`);
}
```

##### documentEndEvent()

Returns a special event containing `document` (a `DOMParser` instance representing the DOM before `window.onLoad`), `location` object, and the pure `html` as string.

```javascript
function(page) {
  var documentEndEvent = page.documentEndEvent();
  var { document, location, html } = documentEndEvent;
  var host = location.host;
  var divs = document.querySelectorAll('div').length;
  return this.createResult('DEBUG', `${divs} div elements found on ${location.host}`);
}
```

##### documentIdleEvent()

Like `documentEndEvent` except it represents the DOM, location and HTML after `window.onLoad`.


##### other helper methods

 - page.soft404TestEvent()
 - page.robotsTxtEvent()
 - page.domContentLoadedEvent()
 - page.fetchEvent()
 - page.getStaticDom() //most of the time this is the DOM you want to test
 - page.getDocumentEndDom()
 - page.getRobotsTxtStatus()
 - page.getDomContentLoadedDom()
 - page.getFetchedDom()
 - page.getIdleDom() //this is the DOM if you care about the final rendered DOM pre user interaction DOM
 - page.getLocation() //current location of the page (during the document Idle event)
 - page.getLocation('static') //URL location of the static DOM
 - page.getHttpHeaders() // the HTTP response headers of the initial GET request
 - page.getHttpHeaders('last') // the HTTP response headers of the lat GET request (i.e. if there were redirects), all key values are lowercase
 - page.getRawHttpHeaders(['last']) //same as above, but un-noramlized
 - TODO other helper methods




## RuleContext

Each function inside [RuleContext.js](/src/javascripts/utils/RuleContext.js) is available inside every rule via the `this`.
Dont forget to run `> grunt --reload-extension` or manually reload the extension when modifying the extension code.

##### createResult(label [STRING], message [STRING], type [STRING](optional, default 'info'))

Returns a valid rule result (an object with the following keys: label, message and type).

```javascript
function(page) {
  var documentEndEvent = page.documentEndEvent();
  var { document, location, html } = documentEndEvent;
  var host = location.host;
  var divs = document.querySelectorAll('div').length;
  return this.createResult('DEBUG', `${divs} div elements found on ${location.host}`);
}
```
