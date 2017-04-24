export const configurableKeyMatcher = () => {
  return new RegExp('%([A-Z0-9_-]+)%', 'g');
};

export const interpolateConfiguration = (rule, configuration) => {
  return rule.replace(configurableKeyMatcher(), (key) => {
    return configuration[key.replace(/%/g, '')] || key;
  });
};
