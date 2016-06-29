import React, { Component } from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

import update from 'react-addons-update';

import { validateRule } from '../../utils/Sandbox';

export default class EditRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: props.rule.toJS(),
      error: null,
      editable: true,
    };
    this.onBodyChange = this.onBodyChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
  }

  onBodyChange(value) {
    const body = { body: value };
    this.setState(
      update(this.state, { rule: { $merge: body } })
    );
  }

  onNameChange(event) {
    const name = { name: event.target.value };
    this.setState(
      update(this.state, { rule: { $merge: name } })
    );
  }

  handleOnSave() {
    const { body, name, status } = this.state.rule;
    validateRule(body, (data) => {
      const { valid, error } = data;
      if (valid) {
        this.props.onSave({ body, name, status });
      } else {
        this.setState({ error });
      }
    });
  }

  render() {
    const { name, id, body } = this.state.rule;
    const canSave = true;
    return (
      <div className="edit-rule">
        <h2>{name}</h2>
        {this.state.error ? <p className="error"><b>{this.state.error.name}</b>: {this.state.error.message}</p> : null}
        <label>
          Name
          <input type="text" value={name} onChange={this.onNameChange} />
        </label>
        <label>
          Script
          <AceEditor
            width="100%"
            showLineNumber={true}
            mode="javascript"
            value={body}
            highlightActiveLine={true}
            showGutter={false}
            showPrintMargin={false}
            useSoftTabs
            tabSize={2}
            theme="monokai"
            onChange={this.onBodyChange}
            name={`${id}-editor`}
            editorProps={{ $blockScrolling: true }}
          />
        </label>
        <button onClick={this.handleOnSave} disabled={!canSave}>Save</button>
        <span> </span>
        <u><a onClick={this.props.onCancel}>Cancel without saving</a></u>
      </div>
    );
  }
}
