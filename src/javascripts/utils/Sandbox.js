let loaded = false;
let proxyIframe = null;

const stack = [];
const callbacks = {};

window.addEventListener('message', (result) => {
  const runId = result.data.runId;
  const data = result.data;
  //callbacks[runId](result.data);
  delete data.runId;
  if(data.label !== 'async')
  {
    callbacks[runId](result.data);
    delete callbacks[runId];
  }
});

proxyIframe = document.createElement('iframe');
proxyIframe.onload = () => {
  loaded = true;
  stack.forEach((s) => s.call());
};
proxyIframe.src = 'sandbox.html';
proxyIframe.id = 'sandbox';
proxyIframe.style = 'display: none';
document.querySelector('body').appendChild(proxyIframe);

export const postMessage = (data, origin) => {
  if (loaded) {
    proxyIframe.contentWindow.postMessage(data, origin);
  } else {
    stack.push(() => {
      proxyIframe.contentWindow.postMessage(data, origin);
    });
  }
};

export const runRule = (rule, args, callback) => {
  const runId = Math.round(Math.random() * 10000000);
  callbacks[runId] = callback;
  postMessage({ command: 'runRule', configuration: rule.configuration, ame: rule.name, body: rule.body, args, runId }, '*');
};
