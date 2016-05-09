import { filter, last, first } from 'lodash';

export default class EventCollection {
  constructor(events) {
    this.events = events;
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
    const event = this.lastEventOfType('documentIdle');
    const document = (new DOMParser()).parseFromString(event.html, 'text/html');
    return Object.assign(event, { document });
  }

  documentEndEvent() {
    const event = this.lastEventOfType('documentEnd');
    const document = (new DOMParser()).parseFromString(event.html, 'text/html');
    return Object.assign(event, { document });
  }
}
