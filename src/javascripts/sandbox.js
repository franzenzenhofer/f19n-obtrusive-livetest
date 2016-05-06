import { validateRule, runRule } from './lib/utils';
import EventCollection from './lib/EventCollection';

window.addEventListener('message', (event) => {
  const { command, body, args, runId } = event.data;
  if (command === 'validateRule') {
    let result = validateRule(body);
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
  if (command === 'runRule') {
    let result = runRule(body, new EventCollection(args));
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }
});
