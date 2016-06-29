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
    const rulebody = "function(page) {\n\
var dom = page.getStaticDom();\n\
var location = page.getLocation();\n\
var headers = page.getHttpHeaders();\n\
\n\
//if (some requirement) \n\
if (true) {\n\
\n\
  //some category of stuff your are testing i.e.: 'DOM', 'HEAD', 'BODY', 'HTTP', 'SPEED', ...\n\
  var lable = 'BODY';\n\
  var msg = 'a message, can inlcude <b>HTML</b>';\n\
  //you can create a link showing only the partial code of a nodeList\n\
  //msg = msg+' '+this.partialCodeLink(dom);\n\
  var type = 'info'; //should be 'info', 'warning', 'error'\n\
\n\
  return this.createResult(lable, msg, type);\n\
}\n\
return null;\n\}";
    this.props.onAddRule({ name: 'New rule', body: rulebody, result: null }, true);
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
          this.setState({ error: null });
        } else {
          this.setState({ error });
        }
      });
    };

    reader.readAsText(file);
  }

  render() {
    return (
      <div className="Header-subHeader Section add-rule">
        <div className="Wrapper">
          <h2>Add rule</h2>
          <input className="Button Upload" type="file" ref="file" onChange={this.handleAddRule} />
          {this.state.error ? <p className="error"><b>{this.state.error.name}</b>: {this.state.error.message}</p> : null}
          <p> or <button className="Button Button--haptic" onClick={this.addEmptyRule}>Create new rule</button></p>
        </div>
      </div>
    );
  }
}
