const check = (sites, url) => {
  const entry = sites.reverse().find((l) => {
    const regexp = `\^${l}\$`.replace(/\*/g, '[^ ]*').replace('!', '');
    return url.match(new RegExp(regexp));
  });
  return entry ? (entry.match(/^!.+/) !== null ? false : true) : false;
};

export const activeForTab = ({ id, url }) => {
  return new Promise((resolve) => {
    chrome.storage.local.get((data) => {
      const hiddenPanels = data['hidden-panels'] || [];
      const sites = { CUSTOM: data.sites, ALL: '*://*', DISABLED: '!*://*' }[data.mode];
      const enabledSite = check(sites.split('\n'), url.replace(/\/$/, ''));
      const hidden = hiddenPanels.indexOf(id) !== -1;
      return resolve({ hidden, disabled: !enabledSite });
    });
  });
};
