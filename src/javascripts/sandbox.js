import { validateRule } from 'utils';

window.addEventListener('message', (event) => {
  const { command, body } = event.data;
  if (command === 'validateRule') {
    event.source.postMessage(validateRule(body), event.origin);
  }
});
