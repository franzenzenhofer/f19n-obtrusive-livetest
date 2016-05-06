import React, { Component } from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

export default class Rule extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  onBodyChange(value) {
    this.setState({ body: value });
  }

  render() {
    const { body, name, result, errors } = this.state;
    return (
      <div className="rule">
        <h4>{name}</h4>
        <a onClick={() => confirm('Delete this rule?') && this.props.onRemoveClick()}>remove</a>
        <AceEditor
          mode="javascript"
          value={body}
          highlightActiveLine={false}
          showGutter={false}
          maxLines={10}
          theme="monokai"
          onChange={this.onBodyChange.bind(this)}
          name={`${name}_editor`}
          editorProps={{ $blockScrolling: true }}
        />
        <a onClick={() => this.props.onUpdate({ body: this.state.body })}>Save</a>
        <pre>test result: {JSON.stringify(result)}</pre>
        {errors ? <pre>{errors}</pre> : null}
      </div>
    );
  }
}
