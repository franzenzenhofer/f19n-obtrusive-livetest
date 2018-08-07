import React, { Component } from 'react';
import Highlight from 'react-highlight';

import { configurableKeyMatcher } from './../../utils/configurableRules';

export default class ViewRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: props.rule.toJS(),
    };
  }

  configurationFields = () => {
    const { body, id, configuration } = this.state.rule;
    const configurationKeys = body && body.match(configurableKeyMatcher());

    if (configurationKeys && configurationKeys.length > 0) {
      return configurationKeys.map((key) => {
        const cleanKey = key.replace(/%/g, '');
        return (
          <div>
          <input placeholder={key} defaultValue={configuration && configuration[cleanKey]} onChange={e => this.props.onConfigurationChange(id, { key: cleanKey, value: e.target.value })} />
          <button className="Button Button--haptic" onClick={this.props.onCancel}>Done</button>
          </div>
          );
      });
    }

    return null;
  }

  render() {
    const { name, body } = this.state.rule;
    return (
      <div className="edit-rule">
        <h4>{name}</h4>

        {this.configurationFields()}

        <Highlight className="javascript">
          {body}
        </Highlight>
        <button className="Button Button--haptic" onClick={this.props.onCancel}>Close</button>
      </div>
    );
  }
}
