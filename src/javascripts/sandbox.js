import { validateRule, runRule } from './lib/utils';
import EventCollection from './lib/EventCollection';

window.addEventListener('message', (event) => {
  const { command, body, args } = event.data;
  if (command === 'validateRule') {
    event.source.postMessage(validateRule(body), event.origin);
  }
  if (command === 'runRule') {
    event.source.postMessage(runRule(body, new EventCollection(args)), event.origin);
  }
});
