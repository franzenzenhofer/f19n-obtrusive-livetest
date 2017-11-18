import { filter, last, first } from 'lodash';

export default class EventCollection {
  constructor(events) {
    this.events = events;
    //console.log(chrome.extension.getURL('codeview.html'));
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


 /*
  robotsTxtEvent() {
    let event = this.lastEventOfType('robotstxt');
    return event;
  }
  */

  chromeLoadTimesEvent()
  {
    let event = this.lastEventOfType('chromeLoadTimes');
    return event;
  }

  getChromeLoadTimes() {
    let e = this.chromeLoadTimesEvent();
    //console.log('chromeloadtimes');
    //console.log(e);
    return e.snapshot;
  }

  windowPerformanceEvent()
  {
    let event = this.lastEventOfType('windowPerformance');
    return event;
  }

  getWindowPerformance() {
    return this.windowPerformanceEvent().snapshot;
  }

  getWindowPerformanceTiming() {
    let e = this.windowPerformanceEvent();
    return e.snapshot.timing
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
  //getLiveDom() {
  //  return null;
  //}



  getHttpHeaders(what) {
    if(what==="last")
    {
      var onHeadersReceivedEvent = this.lastEventOfType('onHeadersReceived');
    }
    else {
      var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    }
    if (!onHeadersReceivedEvent) { return false; }
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
    if (!onHeadersReceivedEvent) { return false; }

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
    if (!onHeadersReceivedEvent) { return false; }

    let { statusCode } = onHeadersReceivedEvent;
    let headers = onHeadersReceivedEvent.responseHeaders;
    let real_statuscode = parseInt(headers['status'],10);
    if(real_statuscode>99&&real_statuscode<600)
    {
      return real_statuscode;
    }
    return statusCode;
  }


  getLocation(where = 'idle') {
    if (where === 'static')
    {
      var e = this.documentEndEvent();
      return e.location;
    }
    else {
    //if (where === 'idle') {
      var e = this.documentIdleEvent();
      return e.location;
    }
  }

  getURL(what) {

/*

    //last
    if(what==="last")
    {
      var onHeadersReceivedEvent = this.lastEventOfType('onHeadersReceived');
    }
    else {
      var onHeadersReceivedEvent = this.firstEventOfType('onHeadersReceived');
    }
      var { url } = onHeadersReceivedEvent;

    if(!url)
    {

    }
*/
    let events = this.events;
    let url = undefined;
    //first
    if(what === "last")
    {
        let reverse_e = events.slice(0).reverse();
        for (let e of reverse_e)
        {
          url = e.url; 
          if (url) { break; }
         /* url = e.location.href;
          if (url) {break} */
        }
    }
    else //if (what==="first")
    {
       for (let e of events)
       {
         url = e.url; 
         if (url) { break; }
        /* url = e.location.href;
         if (url) {break} */
       }
    }
    return url;
  }

  getUrl(what) { return getURL(what); }
  //TODO
  //getProtokoll

}
