## Custom rules

A custom rule consists of one javascript function receiving an `Page` object as first argument and a `callback` function as the second argument that needs to be called with an [valid rule result](#rulecontext) when the rule is done.

If you call `done` with `nil` as the argument, the rule result will be removed from the result list.

- [Page Object](#page)
- [RuleContext](#rulecontext) (rule helper methods)


### Some example rules (more [here](/sample-rules))

Always returns the host of the visited site

```javascript
function(page, done) {
  var documentEndEvent = page.documentEndEvent();

  // Return if no documentEndEvent (and so location) found
  if (!documentEndEvent) { return null; }

  var { location } = documentEndEvent;

  //you can either return
  //return { label: 'DEBUG', type: 'info', message: `Loaded ${location.href}`};
  //return this.createResult(label, msg, type, [what]*); //what is a kind of sublable attached to the front of the message
  return done(this.createResult('DEBUG', `Loaded ${location.href}`, 'info'));
}
```

Counts the occurrence of paragraph elements after document idle

```javascript
function(page, done) {
  var documentIdleEvent = page.documentIdleEvent();

  // Return if no documentIdleEvent (and so location) found
  if (!documentIdleEvent) { return null; }

  var { document } = documentIdleEvent;

  var countElements = document.querySelectorAll('p').length;

  return done(this.createResult('STATS', `found ${countElements} paragraph elements`));
}
```

Example of an async rule

```javascript
function(page, done) {
  setTimeout(function() {
    done(this.createResult('STATS', 'I fired after 5 seconds', 'info'));
  }, 5000);
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

 - page.domContentLoadedEvent()
 - page.fetchEvent()
 - page.getStaticDom() //most of the time this is the DOM you want to test
 - page.getDocumentEndDom()
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

##### fetch(url [STRING], options [OBJECT], callback [FUNCTION])

Use this method if you need to make an cross site fetch request inside your rule. Due to some restrictions this is not the native fetch method but it behaves quite similar.

The response is a plain object containing the following keys:

```javascript
{
 body: [STRING](The HTML body of the requested site)
 ok: [BOOLEAN](If the request was successful)
 redirected: [BOOLEAN](If any redirect occurred)
 status: [INTEGER](HTTP-Statuscode)
 statusText: [STRING](HTTP-Statustext)
}
```

Example:

```javascript
function(page, done) {
  var pageToLoad = 'https://google.com';
  this.fetch(pageToLoad, { method: 'GET' }, (response) => {
    done(this.createResult('INFO', `${response.status}: Page size from ${pageToLoad) is ${response.body.length}`));
  });
}
```
