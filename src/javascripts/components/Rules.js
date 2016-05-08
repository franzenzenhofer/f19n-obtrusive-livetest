import React, { Component } from 'react';
import RulesList from './RulesList';
import AddRule from './AddRule';

import update from 'react-addons-update';

export default class Rules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: props.rules,
    };

    chrome.storage.onChanged.addListener(this.onStoreChange.bind(this));

    this.addRule = this.addRule.bind(this);
    this.removeRule = this.removeRule.bind(this);
    this.toggleRuleStatus = this.toggleRuleStatus.bind(this);
  }

  onStoreChange(data) {
    if (data && data.rules && data.rules.newValue) {
      this.setState({ rules: data.rules.newValue });
    }
  }

  onUpdateRule(index, data) {
    chrome.storage.local.set(
      update(
        { rules: this.state.rules },
        { rules: { [index]: { $merge: data } } }
      )
    );
  }

  addRule(data) {
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

  render() {
    return (
      <div className="fso-rules">
        <h1>Rules</h1>
        <AddRule onAddRule={this.addRule} />
        <div className="rules">
          <h2>All rules</h2>
          <RulesList rules={this.state.rules} onStatusClick={this.toggleRuleStatus} onDeleteClick={this.removeRule} />
        </div>
      </div>
    );
  }
}
