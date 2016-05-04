import { validateRule, runRule } from './lib/utils';
import EventCollection from './lib/EventCollection';

window.addEventListener('message', (event) => {
  const { command, body, args, runId } = event.data;
  if (command === 'validateRule') {
    event.source.postMessage(validateRule(body), event.origin);
  }
  if (command === 'runRule') {
    const result = runRule(body, new EventCollection(args));
    result.runId = runId;
    event.source.postMessage(result, event.origin);
  }
});
