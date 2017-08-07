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

  handleOnRuleConfigurationChange = (id, { key, value }) => {
    rulesStore.update(id, { configuration: { [key]: value } });
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
        maxHeight: 'calc(100vh - 40px)',
        boxSizing: 'border-box',
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
            <svg className="ic ic--rules u-floatLeft" viewBox="0 0 100 100"><circle fill="#1783E5" cx="50" cy="50" r="48"/><path fill="#E6E6E6" d="M74.5 83.2H38.2V20.4h36.3c2.7 0 4.8 2.1 4.8 4.8v53.1c0 2.7-2.2 4.9-4.8 4.9z"/><path fill="#B3B3B3" d="M40.2 26.4h35.5v4H40.2zM40.2 31.1h21.1v4H40.2zM40.2 40.8h35.5v4H40.2zM40.2 45.5h21.1v4H40.2zM40.2 54.6h35.5v4H40.2zM40.2 59.4h21.1v4H40.2zM40.2 68.9h35.5v4H40.2zM40.2 73.6h21.1v4H40.2z"/><path fill="#FFF" d="M42.2 79.9H27.6c-2.7 0-4.8-2.1-4.8-4.8V22c0-2.7 2.1-4.8 4.8-4.8h14.7v62.7z"/><path fill="#F05228" d="M32.7 22c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4S35.7 22 32.7 22zm3 6.9l-1.4 1.4-1.6-1.6-1.6 1.6-1.4-1.4 1.6-1.6-1.6-1.6 1.4-1.4 1.6 1.6 1.6-1.6 1.4 1.4-1.6 1.6 1.6 1.6z"/><path fill="#1783E5" d="M32.7 50.4c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7s-.3.7-.7.7c-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.7h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1zM32.7 64.6c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.8h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1z"/><path fill="#FAC917" d="M37.3 44.9l-4.5-7.7c-.3-.6-1.2-.5-1.5 0l-4.5 7.6c-.3.6.2 1.2.8 1.2h9c.7 0 1.1-.6.7-1.1zM32.7 40l-.1 4h-1l-.1-4h1.2zm-.1 5.3c-.1.1-.3.2-.5.2s-.4-.1-.5-.2c-.1-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4.1-.1.3-.2.5-.2s.4.1.5.2c.1.1.2.3.2.4 0 .1-.1.2-.2.4z"/><path fill="#666" d="M38.2 83.2v-3.3h4z"/></svg>
            <h1 className="u-floatLeft">Manage Rules</h1>
            <span className="Header-brandLink u-floatRight">
              by <svg className="ic u-floatLeft" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width ><path fill="#6E772F" d="M11.7 17.2L2 15l10.2-2.4L22 15"/><path fill="#4F5429" d="M11.7 21.7L2 19.5V15l9.7 2.2"/><path fill="#8E9A34" d="M22 19.5l-10.3 2.2v-4.5L22 15"/><g><path fill="#6E772F" d="M11.7 12L2 9.7l10.2-2.3L22 9.8"/><path fill="#4F5429" d="M11.7 16.5L2 14.2V9.7l9.7 2.3"/><path fill="#8E9A34" d="M22 14.3l-10.3 2.2V12L22 9.8"/></g><g><path fill="#6E772F" d="M11.7 6.9L2 4.6l10.2-2.3L22 4.7"/><path fill="#4F5429" d="M11.7 11.4L2 9.1V4.6l9.7 2.3"/><path fill="#8E9A34" d="M22 9.2l-10.3 2.2V6.9L22 4.7"/></g></svg>
              <a href="http://www.fullstackoptimization.com/" target="_blank">fullstackoptimization</a></span>
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
          <ViewRule rule={ruleToView} onConfigurationChange={this.handleOnRuleConfigurationChange} onCancel={() => this.setState({ viewRule: null })} />
        </Modal>
      </div>
    );
  }
}
