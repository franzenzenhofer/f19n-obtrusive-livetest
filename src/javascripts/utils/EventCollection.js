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

  soft404TestEvent() {
    let event = this.lastEventOfType('soft404test');
    return event;
  }

  robotsTxtEvent() {
    let event = this.lastEventOfType('robotstxt');
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

  domContentLoadedEvent() {
    let event = this.lastEventOfType('DOMContentLoaded');
    if (event && event.html) {

      const document = (new DOMParser()).parseFromString(event.html, 'text/html');
      event = Object.assign(event, { document });
    }
    return event;
  }

  fetchEvent() {
    let event = this.lastEventOfType('fetch');
    if (event && event.html) {

      const document = (new DOMParser()).parseFromString(event.html, 'text/html');
      event = Object.assign(event, { document });
    }
    return event;
  }

  // helper function to get the static HTML Dom
  getStaticDom() {
    const e = this.documentEndEvent();
    //const e = this.domContentLoadedEvent();
    //const e = this.fetchEvent(); //sadly the fetch event is not relieable enough
    return e && e.document;
  }

  getDocumentEndDom () {
    return getStaticDom();
  }

  getRobotsTxtStatus() {
    const e = this.robotsTxtEvent();
    return e;
  }

  getSoft404Status() {
    return this.soft404TestEvent();
  }

  getFetchedStaticDom() {
    const e = this.fetchEvent();
    return e && e.document;
  }

  getDomContentLoadedDom() {
    const e = this.domContentLoadedEvent();
    return e && e.document;
  }

  getFetchedDom() {
    return getFetchedStaticDom();
  }

  getIdleDom() {
    const e = this.documentIdleEvent();
    return e && e.document;
  }

  // function to get the current live DOM
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

  getHttpHeaders(what) {
    if(what==="last")
    {
      var onHeadersReceivedEvent = this.lastEventOfType('onHeadersReceived');
    }
    else {
      var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    }
    var { responseHeaders } = onHeadersReceivedEvent;
    return responseHeaders;
  }

  getRawHttpHeaders(what) {
    if(what==="last")
    {
      var onHeadersReceivedEvent = this.lastEventOfType('onHeadersReceived');
    }
    else {
      var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    }
    var { rawResponseHeaders } = onHeadersReceivedEvent;
    return rawResponseHeaders;
  }

  getStatusCode(what) {
    if(what==="last")
    {
      var onHeadersReceivedEvent = this.lastEventOfType('onHeadersReceived');
    }
    else {
      var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    }
    var { statusCode } = onHeadersReceivedEvent;
    return statusCode;
  }

  getURL(what) {
    if(what==="last")
    {
      var onHeadersReceivedEvent = this.lastEventOfType('onHeadersReceived');
    }
    else {
      var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    }
      var { url } = onHeadersReceivedEvent;
    return url;
  }

  getUrl(what) { return getURL(what); }
  //TODO
  //getProtokoll
}
