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
    return this.lastEventOfType('documentIdle');
  }

  documentEndEvent() {
    return this.lastEventOfType('documentEnd');
  }
}
