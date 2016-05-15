import React, { Component } from 'react';

import { validateRule } from '../../utils/Sandbox';

export default class AddRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
    this.handleAddRule = this.handleAddRule.bind(this);
    this.addEmptyRule = this.addEmptyRule.bind(this);
  }

  addEmptyRule() {
    this.props.onAddRule({ name: 'Empty rule', body: 'function(collection){\n  return null;\n}', result: null }, true);
  }

  handleAddRule() {
    const reader = new FileReader();
    const file = this.refs.file.files[0];

    reader.onload = (upload) => {
      const body = upload.target.result;
      const name = file.name;

      validateRule(body, (data) => {
        const { valid, error, result } = data;
        if (valid) {
          this.props.onAddRule({ name, body, result });
          this.refs.file.value = '';
        } else {
          this.setState({ error });
        }
      });
    };

    reader.readAsText(file);
  }

  render() {
    return (
      <div className="add-rule">
        <h2>Add rule</h2>
        <input type="file" ref="file" />
        <input type="submit" value="Add rule" onClick={this.handleAddRule} />
        {this.state.error ? <p className="error"><b>{this.state.error.name}</b>: {this.state.error.message}</p> : null}
        <p><button onClick={this.addEmptyRule}>New rule template</button></p>
      </div>
    );
  }
}
