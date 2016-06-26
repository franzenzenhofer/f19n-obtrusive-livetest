import React from 'react';
import classNames from 'classnames';

export default function RulesListItem(props) {
  const { name, id, status, onEditClick, onDeleteClick, onStatusClick, onDuplicateClick, index } = props;

  return (
    <tr className={classNames('rule', { disabled: status === 'disabled' })}>
      <td className="RuleTable-ruleName">
        <a onClick={onEditClick}><h3>{name}</h3><span>#{id} / Index: {index}</span></a>
        <div>
          <button className="Button Button--haptic" onClick={onEditClick}>Edit</button>
          <button className="Button Button--haptic" onClick={onDuplicateClick}>Duplicate</button>
          <button className="Button Button--haptic">Download</button>
        </div>
      </td>
      <td className="RuleTable-ruleActions">
        <button className="Button Button--haptic" onClick={onStatusClick}>{status === 'enabled' ? 'disable' : 'enable'}</button>
        <button className="Button Button--haptic" onClick={onDeleteClick}>Delete</button>
      </td>
    </tr>
  );
}
