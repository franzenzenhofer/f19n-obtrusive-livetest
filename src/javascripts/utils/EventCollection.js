import { filter, last, first } from 'lodash';

export default class EventCollection {
  constructor(events) {
    this.events = events;
    this.cachedIdleDom = false;
    this.cachedStaticDom = false;
    this.cacheFetchedStaticDom = false;
    this.cacheDomContentLoadedDom = false;
    
    this.does_domain_have_gsc_access = null;
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
      this.cachedIdleDom = document;
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

  getChromeLoadTimes() {
    throw new Error('getChromeLoadTimes() was removed from the API since the underlaying chrome.loadTimes() was deprecated. Instead use <a href="https://developers.google.com/web/updates/2017/12/chrome-loadtimes-deprecated" target="_blank">standardized APIs</a>.');
  }

  windowPerformanceEvent()
  {
    let event = this.lastEventOfType('windowPerformance');
    return event;
  }

  getWindowPerformance() {
    let e = this.windowPerformanceEvent().snapshot;

    return e;
  }

  getWindowPerformanceTiming() {
    let e = this.getWindowPerformance();

    return e.performance.timing;
  }

  getWindowPerformanceNavigation() {
    let e = this.getWindowPerformance();
    return e.navigation[0];
  }

  getWindowPerformancePaint() {
    let e = this.getWindowPerformance();
    return e.paint;
  }

  windowPerformanceNavigationTimingEvent()
  {
    let event = this.lastEventOfType('windowPerformanceNavigationTiming');
    return event;
  }

  getWindowPerformanceNavigationTiming() {
    return this.windowPerformanceEvent().snapshot;
  }




  documentEndEvent() {
    let event = this.lastEventOfType('documentEnd');
    if (event && event.html) {

      const document = (new DOMParser()).parseFromString(event.html, 'text/html');
      this.cachedStaticDom = document;
      event = Object.assign(event, { document });
    }
    return event;
  }

  domContentLoadedEvent() {
    let event = this.lastEventOfType('DOMContentLoaded');
    if (event && event.html) {

      const document = (new DOMParser()).parseFromString(event.html, 'text/html');
      this.cacheDomContentLoadedDom = document;
      event = Object.assign(event, { document });
    }
    return event;
  }

  fetchEvent() {
    let event = this.lastEventOfType('fetch');
    if (event && event.html) {

      const document = (new DOMParser()).parseFromString(event.html, 'text/html');
      this.cacheFetchedStaticDom = document;
      event = Object.assign(event, { document });
    }
    return event;
  }

  // helper function to get the static HTML Dom
  getStaticDom() {
    if(this.cachedStaticDom) { return this.cachedStaticDom;}
    const e = this.documentEndEvent();
    //const e = this.domContentLoadedEvent();
    //const e = this.fetchEvent(); //sadly the fetch event is not relieable enough
    return e && e.document;
  }

  getDocumentEndDom () {
    return getStaticDom();
  }

  getFetchedStaticDom() {
    if(this.cacheFetchedStaticDom){return this.cacheFetchedStaticDom; }
    const e = this.fetchEvent();
    return e && e.document;
  }

  getDomContentLoadedDom() {
    if(this.cacheDomContentLoadedDom){return this.cDomContentLoadedDom; }
    const e = this.domContentLoadedEvent();
    return e && e.document;
  }

  getFetchedDom() {
    return getFetchedStaticDom();
  }

  getIdleDom() {
    if(this.cachedIdleDom) { return this.cachedIdleDom;}
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

  hasGscAccess = (token, hasF, noF) =>
  {
    
      if(this.does_domain_have_gsc_access === true)
      {
        
          hasF();return true;
      }
      if(this.does_domain_have_gsc_access === false)
      {
        
        noF(); return false;
      }
      
      if(!token){noF();return false;};

      let url = this.getURL();
      let uo = new URL(url);
      let origin = uo.origin+'/';
      let api = 'https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(origin);

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      fetch(api, { headers }).then((response)=>{
          
          if(response.status!==200)
          {
              
              
              response.clone().json().then((data)=>{
                  
                  
                  
                  noF();
                  this.does_domain_have_gsc_access = false;
                  return false;
              });
          } else
          {
          
          
          response.clone().json().then((data)=>{
            
            
              
              hasF();
              this.does_domain_have_gsc_access = true;
              return true;
            });
          }
          
          
      }).catch((err)=>{
          noF();
          this.does_domain_have_gsc_access = false;
          return false;
      });
      return null;
  }

}
