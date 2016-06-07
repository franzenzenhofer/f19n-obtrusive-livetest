import React, { Component } from 'react';
import RulesList from './RulesList';
import AddRule from './AddRule';
import EditRule from './EditRule';

import Modal from 'react-modal';

import update from 'react-addons-update';

export default class Rules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: props.rules,
      editIndex: null,
    };

    chrome.storage.onChanged.addListener(this.onStoreChange.bind(this));

    this.addRule = this.addRule.bind(this);
    this.removeRule = this.removeRule.bind(this);
    this.toggleRuleStatus = this.toggleRuleStatus.bind(this);
    this.editRule = this.editRule.bind(this);
  }

  onStoreChange(data) {
    if (data && data.rules && data.rules.newValue) {
      this.setState({ rules: data.rules.newValue });
    }
  }

  updateRule(index, data) {
    chrome.storage.local.set(
      update(
        { rules: this.state.rules },
        { rules: { [index]: { $merge: data } } }
      )
    );
  }

  handleOnSave(index, data) {
    this.updateRule(index, data);
    this.setState({ editIndex: null });
  }

  addRule(data, open = false) {
    const additionalData = {
      id: `rule-${Math.round(Math.random() * 1000000)}`,
      status: 'enabled',
    };
    chrome.storage.local.set(
      update(
        { rules: this.state.rules },
        { rules: { $push: [Object.assign(data, additionalData)] } }
      )
    );
    if (open) {
      this.setState({ editIndex: this.state.rules.length });
    }
  }

  toggleRuleStatus(index) {
    const status = { status: this.state.rules[index].status === 'enabled' ? 'disabled' : 'enabled' };
    chrome.storage.local.set(
      update(
        { rules: this.state.rules },
        { rules: { [index]: { $merge: status } } }
      )
    );
  }

  removeRule(index) {
    chrome.storage.local.set(
      update(
        { rules: this.state.rules },
        { rules: { $splice: [[index, 1]] } }
      )
    );
  }

  editRule(index) {
    this.setState({ editIndex: index });
  }

  render() {
    const modalStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    return (
      <div className="f19n-rules">
        <header className="Header Section">
          <div className="Wrapper u-cf">
            <svg className="ic ic--rules u-floatLeft" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6E772F" d="M11.7 17.2L2 15l10.2-2.4L22 15"/><path fill="#4F5429" d="M11.7 21.7L2 19.5V15l9.7 2.2"/><path fill="#8E9A34" d="M22 19.5l-10.3 2.2v-4.5L22 15"/><g><path fill="#6E772F" d="M11.7 12L2 9.7l10.2-2.3L22 9.8"/><path fill="#4F5429" d="M11.7 16.5L2 14.2V9.7l9.7 2.3"/><path fill="#8E9A34" d="M22 14.3l-10.3 2.2V12L22 9.8"/></g><g><path fill="#6E772F" d="M11.7 6.9L2 4.6l10.2-2.3L22 4.7"/><path fill="#4F5429" d="M11.7 11.4L2 9.1V4.6l9.7 2.3"/><path fill="#8E9A34" d="M22 9.2l-10.3 2.2V6.9L22 4.7"/></g></svg>
            <h1 calssName="u-floatLeft">Manage Rules</h1>
            <span className="Header-brandLink u-floatRight">build by <a href="http://www.fullstackoptimization.com">full stack optimization</a></span>
          </div>
        </header>
        <AddRule onAddRule={this.addRule} />
        <div className="Wrapper">
          <div className="Section rules">
            <h2>All rules</h2>
            <RulesList rules={this.state.rules} onEditClick={this.editRule} onStatusClick={this.toggleRuleStatus} onDeleteClick={this.removeRule} />
          </div>
        </div>
        <Modal style={modalStyles} isOpen={this.state.editIndex !== null} onRequestClose={() => this.setState({ editIndex: null })}>
          <EditRule rule={this.state.rules[this.state.editIndex]} onSave={(data) => this.handleOnSave(this.state.editIndex, data)} />
        </Modal>
      </div>
    );
  }
}
