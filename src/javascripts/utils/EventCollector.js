import update from 'react-addons-update';

export default class EventCollector {
  constructor(options = {}) {
    this.events = options.events || [];
    this.timeout = options.timeout || 5000;
    this.lastEvent = options.lastEvent || 'documentIdle';
    this.onFinished = options.onFinished || null;
    this.timeoutHandle = null;
  }

  reset() {
    this.events = [];
  }

  pushEvent(data, event) {
    console.log(event);
    this.events.push(update(data, { $merge: { event } }));
    if (this.onFinished) {
      if (event === this.lastEvent) {
        this.finished();
        this.clearTimeout();
      } else {
        this.startTimeout();
      }
    }
  }

  finished() {
    this.onFinished(this.events.slice());
    this.reset();
  }

  startTimeout() {
    this.clearTimeout();
    this.timeoutHandle = setTimeout(this.finished.bind(this), this.timeout);
  }

  clearTimeout() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  }
}
