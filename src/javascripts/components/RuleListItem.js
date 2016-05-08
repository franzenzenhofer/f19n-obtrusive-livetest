import React from 'react';
import classNames from 'classnames';

// import AceEditor from 'react-ace';
//
// import 'brace/mode/javascript';
// import 'brace/theme/monokai';

export default function RulesListItem(props) {
  const { name, id, status, onEditClick, onDeleteClick, onStatusClick } = props;

  return (
    <tr className={classNames('rule', { disabled: status === 'disabled' })}>
      <td className="name">{name} <span>#{id}</span></td>
      <td className="actions">
        <a onClick={onStatusClick}>{status === 'enabled' ? 'disable' : 'enable'}</a>
        <a onClick={onDeleteClick}>delete</a>
        <a onClick={onEditClick}>edit</a>
      </td>
    </tr>
  );
}
