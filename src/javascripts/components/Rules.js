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
      <div className="fso-rules">
        <h1>Rules</h1>
        <AddRule onAddRule={this.addRule} />
        <div className="rules">
          <h2>All rules</h2>
          <RulesList rules={this.state.rules} onEditClick={this.editRule} onStatusClick={this.toggleRuleStatus} onDeleteClick={this.removeRule} />
        </div>
        <Modal style={modalStyles} isOpen={this.state.editIndex !== null} onRequestClose={() => this.setState({ editIndex: null })}>
          <EditRule rule={this.state.rules[this.state.editIndex]} onSave={(data) => this.handleOnSave(this.state.editIndex, data)} />
        </Modal>
      </div>
    );
  }
}
