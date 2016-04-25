import { ruleResult } from './../lib/utils';

export const outgoingNofollowLinks = (data) => {
  const { document, location } = data;

  const domain = (url) => {
    return url.replace('http://', '').replace('https://', '').split('/')[0];
  };

  const outgoingLinks = Array.prototype.filter.call(document.querySelectorAll('a[href^=http][rel=nofollow]'), (link) => {
    const href = link.getAttribute('href');
    return domain(href) !== domain(location.href);
  });

  return outgoingLinks.length > 0 ? ruleResult('LINKS', `${outgoingLinks.length} outgoing links with rel nofollow`, 'info') : null;
};
