import React, { Component } from 'react';
import Rule from '../Rule';

import update from 'react-addons-update';
import Sandbox from '../../lib/Sandbox';

export default class Rules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: props.rules,
      addRule: {
        error: null,
      },
    };
    const onStoreChange = this.onStoreChange.bind(this);
    chrome.storage.onChanged.addListener(onStoreChange);
  }

  onStoreChange(data) {
    if (data && data.rules && data.rules.newValue) {
      this.setState({ rules: data.rules.newValue });
    }
  }

  onChange(index, data) {
    console.log(index, data);
  }

  removeRule(index) {
    chrome.storage.local.set(
      update(
        { rules: this.state.rules },
        { rules: { $splice: [[index, 1]] } }
      )
    );
  }

  addRule(data) {
    chrome.storage.local.set(
      update(
        { rules: this.state.rules },
        { rules: { $push: [data] } }
      )
    );
  }

  handleAddRule() {
    const reader = new FileReader();
    const file = this.refs.file.files[0];

    reader.onload = (upload) => {
      const body = upload.target.result;
      const name = file.name;

      const evaluated = (event) => {
        const { valid, error, result } = event.data;
        if (valid) {
          this.addRule({ name, body, result });
          this.refs.file.value = '';
        } else {
          this.setState({ addRule: { error: `${error.name}: ${error.message}` } });
        }
        window.removeEventListener('message', evaluated);
      };

      window.addEventListener('message', evaluated);
      Sandbox.postMessage({ command: 'validateRule', body, name }, '*');
    };
    reader.readAsText(file);
  }

  render() {
    return (
      <div className="fso-rules">
        <h2>Rules</h2>
        <div className="add-rule">
          <input type="file" ref="file" />
          <input type="submit" value="Add rule" onClick={this.handleAddRule.bind(this)} />
          {this.state.addRule.error ? <p>{this.state.addRule.error}</p> : null}
        </div>
        <div className="rules">
          {this.state.rules.map((rule, index) => <Rule {...rule} onChange={(data) => this.updateRule(index, data)} onRemoveClick={() => this.removeRule(index)} key={`rule_${index}`} />)}
        </div>
      </div>
    );
  }
}
