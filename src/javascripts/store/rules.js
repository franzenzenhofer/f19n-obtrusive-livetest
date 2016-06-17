import { fromJS } from 'immutable';

const storagePath = 'rules';
const storage = chrome.storage.local;

const set = (data) => {
  const dataJS = typeof(data.toJS) === 'function' ? data.toJS() : data;
  storage.set({ [storagePath]: dataJS });
};

const getRuleId = () => {
  return `rule-${Math.round(Math.random() * 1000000)}`;
};

const all = (callback, asImmutable = false) => {
  storage.get((data) => {
    let rules = data[storagePath] || [];
    rules = asImmutable ? fromJS(rules) : rules;
    callback(rules);
  });
};

const remove = (index) => {
  all((rules) => {
    set(rules.splice(index, 1));
  }, true);
};

const update = (index, data) => {
  all((rules) => {
    set(rules.mergeIn([index], data));
  }, true);
};

const add = (data) => {
  all((rules) => {
    const additionalData = {
      id: getRuleId(),
      status: 'enabled',
    };
    set(rules.push(Object.assign(additionalData, data)));
  }, true);
};

const duplicate = (index) => {
  all((rules) => {
    const rule = rules.get(index).toJS();
    const duplidatedRule = Object.assign(rule, { id: getRuleId() });
    set(rules.push(duplidatedRule));
  }, true);
};

export default {
  all,
  remove,
  update,
  add,
  duplicate,
};
