import { ruleResult } from './../lib/utils';

export const outgoingNofollowLinks = (data) => {
  return ruleResult('HTML', `Outgoing nofollow`, 'info');
};
