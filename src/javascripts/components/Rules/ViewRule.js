import React, { Component } from 'react';
import Highlight from 'react-highlight';

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
        <h4>{name}</h4>
        <Highlight className="javascript">
          {body}
        </Highlight>
        <button className="Button Button--haptic" onClick={this.props.onCancel}>Close</button>
      </div>
    );
  }
}
