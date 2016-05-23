import React from 'react';
import classNames from 'classnames';

export default function ResultItem(props) {
  const { label, message, type} = props;

  return (
    <tr className={classNames(type, label.replace(/[^A-Z0-9]/i, '').toLowerCase(), 'result')}>
      <td className="type">{type}</td>
      <td className="meta label">
        <a href="#" className="filter filter-by-label" onClick={props.onLabelClick}>{label}</a>
      </td>
      <td className="message"><span dangerouslySetInnerHTML={{ __html: message }} /></td>
    </tr>
  );
}
