import { filter, last, first } from 'lodash';

export default class EventCollection {
  constructor(events) {
    this.events = events;
  }

  events() {
    return this.events.slice();
  }

  eventsOfType(type) {
    return filter(this.events, e => e.event === type);
  }

  lastEventOfType(type) {
    return last(this.eventsOfType(type));
  }

  firstEventOfType(type) {
    return first(this.eventsOfType(type));
  }

  documentIdleEvent() {
    let event = this.lastEventOfType('documentIdle');
    if (event && event.html) {
      const document = (new DOMParser()).parseFromString(event.html, 'text/html');
      event = Object.assign(event, { document });
    }
    return event;
  }

  documentEndEvent() {
    let event = this.lastEventOfType('documentEnd');
    if (event && event.html) {
      const document = (new DOMParser()).parseFromString(event.html, 'text/html');
      event = Object.assign(event, { document });
    }
    return event;
  }

  //helper function to get the static HTML Dom
  getStaticDom() {
    var e = this.documentEndEvent();
    return e.document;
  }

  getIdleDom() {
    var e = this.documentIdleEvent();
    return e.document;
  }

  //function to get the current live DOM
  getLiveDom() {
    return null;
  }

  getLocation(where = 'idle') {
    if (where === 'static')
    {
      var e = this.documentEndEvent();
      return e.location;
    }
    else if (where === 'live')
    {
      //return live location
    }
    else {
    //if (where === 'idle') {
      var e = this.documentIdleEvent();
      return e.location;
    }
  }

  getHttpHeaders() {
    var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    var { responseHeaders } = onHeadersReceivedEvent;
    return responseHeaders;
  }

  getStatusCode() {
    var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    var { statusCode } = onHeadersReceivedEvent;
    return statusCode;
  }

  getURL() {
    var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    var { url } = onHeadersReceivedEvent;
    return url;
  }

  //TODO
  //getProtokoll
}
