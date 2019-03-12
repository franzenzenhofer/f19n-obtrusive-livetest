/* global window, document, fetch */

let loaded = false;
let proxyIframe = null;

const stack = [];
const callbacks = {};

const getRuleContextGlobals = (callback) => {
  chrome.storage.local.get(['globalRuleVariables'], ({ globalRuleVariables }) => {
    return callback({
      codeviewUrl: chrome.extension.getURL('codeview.html'),
      rulesUrl: chrome.extension.getURL('rules.html'),
      variables: globalRuleVariables,
    });
  });
};

window.addEventListener('message', (event) => {
  const { command, runId } = event.data;

  if (command === 'ruleResult') {
    const { data } = event;
    delete data.runId;
    delete data.command;
    if (callbacks[runId]) {
      callbacks[runId](data);
      delete callbacks[runId];
    }
  }

  if (command === 'fetch') {
    const { url, options } = event.data;
    const responseFormat = options.responseFormat;
    delete options.responseFormat;


    fetch(url, options || {}).then((response) => {
      response[responseFormat || 'text']().then((data) => {
        var r = {}
        r.status = response.status;
        r.statusText = response.statusText;
        r.ok = response.ok;
        r.redirected = response.redirected;
        r.url = response.url;
        /*r.headers = [];
        const headers = response.headers.entries();
        for (h of headers) {
          r.headers.push(h)
        }*/
        r.body = data;
        event.source.postMessage({ command: 'fetchResult', response: r, runId }, '*');
      });
    });
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
  getRuleContextGlobals((ruleContextGlobals) => {
    callbacks[runId] = callback;
    postMessage({ command: 'runRule', configuration: rule.configuration, name: rule.name, body: rule.body, args, runId, ruleContextGlobals }, '*');
  });
};
