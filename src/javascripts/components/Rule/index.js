import React from 'react';

export default function Rule(props) {
  const { body, name, result, onRemoveClick } = props;

  return (
    <div className="rule">
      <h4>{name}</h4>
      <a onClick={onRemoveClick}>remove</a>
      <pre>{body}</pre>
      <pre>test result: {JSON.stringify(result)}</pre>
    </div>
  );
}
