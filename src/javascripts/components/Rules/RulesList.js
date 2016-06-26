import React from 'react';
import RuleListItem from './RuleListItem';

export default function RulesList(props) {
  const { rules, onDeleteClick, onEditClick, onStatusClick, onDuplicateClick } = props;
  //console.log(rules);
  rules.reverse();
  var rI = (index) => {return rules.length - index - 1;} //reverseIndex
  return (
    <table className="RuleTable RuleTable--striped rules-list">
      <tbody>
        {rules.map((rule, index) => <RuleListItem {...rule} onDuplicateClick={() => onDuplicateClick(rI(index))} onEditClick={() => onEditClick(rI(index))} onDeleteClick={() => onDeleteClick(rI(index))} onStatusClick={() => onStatusClick(rI(index))} key={`rule_${rI(index)}`} index={rI(index)} />)}
      </tbody>
    </table>
  );
}
