import React, { Component } from 'react';

export default class Rule extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  onBodyChange(value) {
    this.setState({ body: value });
  }

  render() {
    const { body, name, result } = this.state;
    return (
      <div className="rule">
        <h4>{name}</h4>
        <a onClick={this.props.onRemoveClick}>remove</a>
        <textarea defaultValue={body} onChange={(e) => this.onBodyChange(e.target.value)} />
        <a onClick={() => this.props.onUpdate({ body: this.state.body })}>Save</a>
        <pre>test result: {JSON.stringify(result)}</pre>
      </div>
    );
  }
}
