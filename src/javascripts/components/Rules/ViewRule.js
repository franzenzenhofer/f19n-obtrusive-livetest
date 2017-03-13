import React, { Component } from 'react';

export default class ViewRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: props.rule.toJS(),
    };
  }

  render() {
    const { name, body } = this.state.rule;
    return (
      <div className="edit-rule">
        <h2>{name}</h2>
        Script
        <pre>{body}</pre>
        <a onClick={this.props.onCancel}>Close</a>
      </div>
    );
  }
}
