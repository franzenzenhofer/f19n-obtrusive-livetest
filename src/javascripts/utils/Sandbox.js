let loaded = false;
let proxyIframe = null;

const stack = [];
const callbacks = {};

window.addEventListener('message', (result) => {
  console.log('Sandbox');
  console.log(result);
  console.log('runId:'+result.data.runId);
  const runId = result.data.runId;
  const data = result.data;
  delete data.runId;
  console.log('callback:');
  console.log(callbacks);
  callbacks[runId](result.data);
  delete callbacks[runId];
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

export const validateRule = (body, callback) => {
  const runId = Math.round(Math.random() * 9000000000);
  callbacks[runId] = callback;
  postMessage({ command: 'validateRule', body, runId }, '*');
};

export const runRule = (rule, args, callback) => {
  const runId = Math.round(Math.random() * 9000000000);
  callbacks[runId] = callback;
  postMessage({ command: 'runRule', name: rule.name, body: rule.body, args, runId }, '*');
};
