import EventCollection from './utils/EventCollection';

import * as RuleContext from './utils/RuleContext';

const runRule = (name, rule, events, callback) => {
  let ruleResult = null;
  try {
    const ruleFunc = eval(`(${rule})`);
    ruleResult = ruleFunc.apply(RuleContext, [events, callback]);
  } catch (e) {
    ruleResult = { label: 'Pending', message: `<b>${e.name}</b>: ${e.message} @<b>${name}</b>`, type: 'pending' };
  }
  return ruleResult;
};

window.addEventListener('message', (event) => {
  const { command, body, args, runId, name } = event.data;

  var postReturn = function(result){
    result = Object.assign(result || {}, { runId });
    event.source.postMessage(result, event.origin);
  }

  if (command === 'runRule') {
    let result = runRule(name, body, new EventCollection(args), postReturn);
    //result = Object.assign(result || {}, { runId });
    //event.source.postMessage(result, event.origin);
    //if(result !== 'async'){
      postReturn(result);
    //}
  }
});
