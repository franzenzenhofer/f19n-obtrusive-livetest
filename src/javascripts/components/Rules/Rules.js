import React, { Component } from 'react';
import { fromJS } from 'immutable';
import Modal from 'react-modal';

import RulesList from './RulesList';
import AddRule from './AddRule';
import ViewRule from './ViewRule';
import EnabledSites from './EnabledSites';

import rulesStore from './../../store/rules';

export default class Rules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: fromJS(props.rules),
      sites: props.sites,
      viewRule: null,
    };

    this.storeReady = true;
    this.queue = this.queue || [];

    chrome.storage.onChanged.addListener(this.onStoreChange);
  }

  onStoreChange = (data) => {
    if (data && data.rules && data.rules.newValue) {
      this.setState({ rules: fromJS(data.rules.newValue) });
    }
    if (data && data.sites && data.sites.newValue) {
      this.setState({ sites: fromJS(data.sites.newValue) });
    }
  }

  addRule = (data) => {
    const handleQueue = () => {
      if (!this.storeReady || this.queue.length === 0) { return; }
      this.storeReady = false;
      const data = this.queue.shift();

      const ruleIndexForName = rulesStore.findIndex(this.state.rules.toJS(), (r) => { return r.get('name') === data.name && !r.get('defaultRule'); });

      if (ruleIndexForName !== -1) {
        rulesStore.update(ruleIndexForName, data, () => { this.storeReady = true; handleQueue(); });
      } else {
        rulesStore.add(data, () => { this.storeReady = true; handleQueue(); });
      }
    };

    this.queue.push(data);
    handleQueue();
  }

  toggleRuleStatus = (id) => {
    const status = this.state.rules.getIn([rulesStore.findIndex(this.state.rules.toJS(), id), 'status']) === 'enabled' ? 'disabled' : 'enabled';
    rulesStore.update(id, { status });
  }

  removeRule = (id) => {
    rulesStore.remove(id);
  }

  viewRule = (id) => {
    this.setState({ viewRule: id });
  }

  updateSites = (sites) => {
    chrome.storage.local.set({ sites });
  }

  render() {
    const modalStyles = {
      content: {
        background: 'white',
        border: '1px #888 solid',
        padding: '20px',
        borderRadius: 0,
        position: 'relative',
        left: 'auto',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        margin: '20px',
      },
      overlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };

    const rules = this.state.rules.toJS();
    const ruleToView = this.state.rules.get(rulesStore.findIndex(rules, this.state.viewRule));

    const defaultRules = rules.filter(r => r.defaultRule);
    const customRules = rules.filter(r => !r.defaultRule);

    return (
      <div className="f19n-rules">
        <header className="Header Section">
          <div className="Wrapper u-cf">
            <svg className="ic ic--rules u-floatLeft" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6E772F" d="M11.7 17.2L2 15l10.2-2.4L22 15"/><path fill="#4F5429" d="M11.7 21.7L2 19.5V15l9.7 2.2"/><path fill="#8E9A34" d="M22 19.5l-10.3 2.2v-4.5L22 15"/><g><path fill="#6E772F" d="M11.7 12L2 9.7l10.2-2.3L22 9.8"/><path fill="#4F5429" d="M11.7 16.5L2 14.2V9.7l9.7 2.3"/><path fill="#8E9A34" d="M22 14.3l-10.3 2.2V12L22 9.8"/></g><g><path fill="#6E772F" d="M11.7 6.9L2 4.6l10.2-2.3L22 4.7"/><path fill="#4F5429" d="M11.7 11.4L2 9.1V4.6l9.7 2.3"/><path fill="#8E9A34" d="M22 9.2l-10.3 2.2V6.9L22 4.7"/></g></svg>
            <h1 calssName="u-floatLeft">Manage Rules</h1>
            <span className="Header-brandLink u-floatRight">by <a href="http://www.fullstackoptimization.com/" target="_blank">fullstackoptimization</a></span>
          </div>
        </header>
        <EnabledSites sites={this.state.sites} onChange={this.updateSites} />
        <div className="Wrapper">
          <div className="Section rules">
            <h2>Custom rules</h2>
            <AddRule onAddRule={this.addRule} />
            <RulesList rules={customRules} onViewClick={this.viewRule} onStatusClick={this.toggleRuleStatus} onDeleteClick={this.removeRule} />
          </div>
          <div className="Section rules">
            <h2>Default rules</h2>
            <RulesList rules={defaultRules} onViewClick={this.viewRule} onStatusClick={this.toggleRuleStatus} />
          </div>
        </div>
        <Modal style={modalStyles} isOpen={ruleToView && true} onRequestClose={() => this.setState({ viewRule: null })}>
          <ViewRule rule={ruleToView} onCancel={() => this.setState({ viewRule: null })} />
        </Modal>
      </div>
    );
  }
}
