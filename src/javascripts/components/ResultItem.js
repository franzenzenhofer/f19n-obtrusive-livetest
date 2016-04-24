import React from 'react';

export default function ResultItem(props) {
  const { label, message, type } = props;
  return (
    <tr>
      <td>{type}</td>
      <td>{label}</td>
      <td>{message}</td>
    </tr>
  );
}
