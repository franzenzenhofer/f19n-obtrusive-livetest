import React, { Component } from 'react';
import RulesList from './RulesList';
import AddRule from './AddRule';
import EditRule from './EditRule';
import EnabledSites from './EnabledSites';

import rulesStore from './../../store/rules';

import { fromJS } from 'immutable';

import Modal from 'react-modal';

export default class Rules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: fromJS(props.rules),
      sites: props.sites,
      editRule: null,
      editAllowed: true
    };

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

  updateRule(id, data) {
    rulesStore.update(id, data);
  }

  handleOnSave(id, data) {
    this.updateRule(id, data);
    this.setState({ editRule: null });
  }

  addRule = (data, open = false) => {
    rulesStore.add(data);
    if (open) {
      this.setState({ editRule: data.id });
    }
  }

  toggleRuleStatus = (id) => {
    const status = this.state.rules.getIn([rulesStore.findIndex(this.state.rules.toJS(), id), 'status']) === 'enabled' ? 'disabled' : 'enabled';
    rulesStore.update(id, { status });
  }

  removeRule = (id) => {
    rulesStore.remove(id);
  }

  editRule = (id) => {
    this.setState({ rules: this.state.rules, editRule: id, editAllowed: true });
  }

  viewRule = (id) => {
    console.log('view');
    this.setState({ editRule: id, editAllowed: false });
  }

  duplicateRule = (id) => {
    rulesStore.duplicate(id, { defaultRule: false });
  }

  updateSites = (sites) => {
    chrome.storage.local.set({ sites });
  }

  render() {
    const modalStyles = {
      content: {
        top: '50%',
        width: '90%',
        height: '90%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    const rules = this.state.rules.toJS();
    const ruleToEdit = this.state.rules.get(rulesStore.findIndex(rules, this.state.editRule));
    const editAllowed = this.state.editAllowed;

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
        <AddRule onAddRule={this.addRule} />
        <EnabledSites sites={this.state.sites} onChange={this.updateSites} />
        <div className="Wrapper">
          <div className="Section rules">
            <h2>Custom rules</h2>
            <RulesList rules={customRules} onDuplicateClick={this.duplicateRule} onEditClick={this.editRule} onStatusClick={this.toggleRuleStatus} onDeleteClick={this.removeRule} />
          </div>
          <div className="Section rules">
            <h2>Default rules</h2>
            <RulesList rules={defaultRules} onDuplicateClick={this.duplicateRule} onEditClick={this.editRule} onViewClick={this.viewRule} onStatusClick={this.toggleRuleStatus} onDeleteClick={this.removeRule} />
          </div>
        </div>
        <Modal style={modalStyles} shouldCloseOnOverlayClick={false} isOpen={ruleToEdit && true} onRequestClose={() => this.setState({ editRule: null })}>
          <EditRule rule={ruleToEdit} onCancel={() => this.setState({ editRule: null })} onSave={(data) => this.handleOnSave(this.state.editRule, data)} readOnly={!editAllowed} />
        </Modal>
      </div>
    );
  }
}
