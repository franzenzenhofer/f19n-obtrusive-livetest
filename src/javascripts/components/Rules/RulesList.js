import React from 'react';
import RuleListItem from './RuleListItem';

export default function RulesList(props) {
  const { rules, onDeleteClick, onEditClick, onStatusClick, onDuplicateClick } = props;
  return (
    <table className="RuleTable RuleTable--striped rules-list">
      <tbody>
        {rules.map((rule, index) => <RuleListItem {...rule} onDuplicateClick={() => onDuplicateClick(index)} onEditClick={() => onEditClick(index)} onDeleteClick={() => onDeleteClick(index)} onStatusClick={() => onStatusClick(index)} key={`rule_${index}`} />)}
      </tbody>
    </table>
  );
}
