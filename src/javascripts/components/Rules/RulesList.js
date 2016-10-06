import React from 'react';
import RuleListItem from './RuleListItem';

export default function RulesList(props) {
  const { rules, onDeleteClick, onEditClick, onStatusClick, onDuplicateClick, onViewClick, onDownloadClick } = props;
  rules.reverse();
  return (
    <table className="RuleTable RuleTable--striped rules-list">
      <tbody>
        {rules.map(
          (rule, index) =>
            <RuleListItem {...rule}
              onDuplicateClick={() => onDuplicateClick(rule.id)}
              onEditClick={() => onEditClick(rule.id)}
              onViewClick={() => onViewClick(rule.id)}
              onDeleteClick={() => onDeleteClick(rule.id)}
              onStatusClick={() => onStatusClick(rule.id)}
              onDownloadClick={() => onDownloadClick(rule.id)}
              key={`rule_${index}`}
              index={index}
            />
      )}
      </tbody>
    </table>
  );
}
