import React from 'react';
import classNames from 'classnames';

export default function RulesListItem(props) {
  const { name, id, status, onEditClick, onViewClick, onDeleteClick, onStatusClick, onDuplicateClick, index, defaultRule, onDownloadClick } = props;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <tr className={classNames('rule', { disabled: status === 'disabled' })}>
      <td className="RuleTable-ruleName">
        <a onClick={!defaultRule && onEditClick}><h3>{name}</h3><span>#{capitalizeFirstLetter(id)} / Index: {index}</span></a>
        <div>
          {!defaultRule && <button className="Button Button--haptic" onClick={onEditClick}>Edit</button>}
          {defaultRule && <button className="Button Button--haptic" onClick={onViewClick}>View</button>}
          <button className="Button Button--haptic" onClick={onDuplicateClick}>Duplicate</button>
          {!defaultRule && <button onClick={onDownloadClick} className="Button Button--haptic">Download</button>}
        </div>
      </td>
      <td className="RuleTable-ruleActions">
        <button className="Button Button--haptic" onClick={onStatusClick}>{status === 'enabled' ? 'disable' : 'enable'}</button>
        {!defaultRule && <button className="Button Button--haptic" onClick={onDeleteClick}>Delete</button>}
      </td>
    </tr>
  );
}
