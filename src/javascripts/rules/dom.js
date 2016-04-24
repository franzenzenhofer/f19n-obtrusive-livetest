import { ruleResult } from './../lib/utils';

export const outgoingNofollowLinks = () => {
  return ruleResult('HTML', 'Outgoing nofollow', 'info');
};
