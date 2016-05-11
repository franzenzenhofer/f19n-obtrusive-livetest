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
}
