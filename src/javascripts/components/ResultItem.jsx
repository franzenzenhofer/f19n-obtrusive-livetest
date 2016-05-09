import React from 'react';
import classNames from 'classnames';

export default function ResultItem(props) {
  const { label, message, type } = props;

  return (
    <div className={classNames(type, label.replace(/[^A-Z0-9]/i, '').toLowerCase(), 'result')}>
      <div className="meta">
        <span className="label">{label} ({type})</span>
      </div>
      <div className="message" dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
}
