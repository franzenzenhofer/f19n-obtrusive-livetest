import { ruleResult } from './../lib/utils';

export const hasCanonicalTags = (data) => {
  const { document, location } = data;

  let text = null;
  let type = 'info';

  const canonical = document.querySelector('link[rel=canonical]');

  if (canonical) {
    const href = canonical.getAttribute('href');
    text = `canonical: ${href}`;

    if (href !== location.href) {
      type = 'warning';
    }
  }

  return text ? ruleResult('HEAD', text, type) : null;
};


export const countLinks = (data) => {
  const { document } = data;
  const links = document.querySelectorAll('a').length;
  return ruleResult('STATS', `${links} A-Tags found`, 'info');
};
