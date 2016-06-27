import { fromJS } from 'immutable';

const storagePath = 'rules';
const storage = chrome.storage.local;

const getRuleId = () => {
  return `rule-${Math.round(Math.random() * 1000000)}`;
};

const findIndex = (rules, which) => {
  let index = null;
  switch (typeof(which)) {
    case 'string':
      index = fromJS(rules).findIndex(r => r.get('id') === which);
      break;
    case 'number':
      index = which;
      break;
    default:
      return null;
  }
  return index;
};

const set = (data, callback = null) => {
  const dataJS = typeof(data.toJS) === 'function' ? data.toJS() : data;
  storage.set({ [storagePath]: dataJS }, callback);
};

const all = (callback, asImmutable = false) => {
  storage.get((data) => {
    let rules = data[storagePath] || [];
    rules = asImmutable ? fromJS(rules) : rules;
    callback(rules);
  });
};

const remove = (which, callback) => {
  all((rules) => {
    const index = findIndex(rules, which);
    set(rules.splice(index, 1), callback);
  }, true);
};

const update = (which, data, callback = null) => {
  all((rules) => {
    const index = findIndex(rules, which);
    console.log(index, which, data);
    return set(rules.mergeIn([index], data), callback);
  }, true);
};

const add = (data, callback = null) => {
  all((rules) => {
    const additionalData = {
      id: getRuleId(),
      status: 'enabled',
    };
    set(rules.push(Object.assign(additionalData, data)), callback);
  }, true);
};

const duplicate = (which, additionalData = {}, callback = null) => {
  all((rules) => {
    const index = findIndex(rules, which);
    const rule = rules.get(index).toJS();
    const duplidatedRule = Object.assign(rule, { id: getRuleId() }, additionalData);
    set(rules.push(duplidatedRule), callback);
  }, true);
};

export default {
  all,
  remove,
  update,
  add,
  duplicate,
  findIndex,
};
