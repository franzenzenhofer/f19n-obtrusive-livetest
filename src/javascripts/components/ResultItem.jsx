import React from 'react';

export default function ResultItem(props) {
  const { label, message, type } = props;

  const typeIcon = (t) => {
    const className = { error: 'fa fa-warning', warning: 'fa fa-warning', info: 'fa fa-info-circle' }[t];
    return <i className={className}></i>;
  };

  return (
    <tr className={type}>
      <td className="type">{typeIcon(type)}</td>
      <td className="label"><span>{label}</span></td>
      <td className="message" dangerouslySetInnerHTML={{ __html: message }}></td>
    </tr>
  );
}
