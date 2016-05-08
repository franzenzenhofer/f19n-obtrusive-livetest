import React from 'react';
import classNames from 'classnames';

export default function RulesListItem(props) {
  const { name, id, status, onEditClick, onDeleteClick, onStatusClick } = props;

  return (
    <tr className={classNames('rule', { disabled: status === 'disabled' })}>
      <td className="name">
        <a onClick={onEditClick}>{name} <span>#{id}</span></a>
      </td>
      <td className="actions">
        <button onClick={onStatusClick}>{status === 'enabled' ? 'disable' : 'enable'}</button>
        <button onClick={onEditClick}>edit</button>
        <button onClick={onDeleteClick}>delete</button>
      </td>
    </tr>
  );
}
