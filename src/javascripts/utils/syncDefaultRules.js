import rulesStore from './../store/rules';

const updateOrImportRules = (rulesToImport) => {
  const { name, body } = rulesToImport.shift();
  rulesStore.all((rules) => {
    const existingRuleIndex = rules.findIndex(r => r.get('name') === name && r.get('defaultRule') === true);
    const cb = rulesToImport.length > 0 ? () => { updateOrImportRules(rulesToImport); } : null;
    if (existingRuleIndex !== -1) {
      rulesStore.update(existingRuleIndex, { body }, cb);
    } else {
      rulesStore.add({ name, body, defaultRule: true }, cb);
    }
  }, true);
};

export default (path = 'default-rules') => {
  const rulesList = [];

  chrome.runtime.getPackageDirectoryEntry((root) => {
    root.getDirectory(path, { create: false }, (dir) => {
      const reader = dir.createReader();
      reader.readEntries((results) => {
        results.forEach((fileEntry) => {
          fileEntry.file((file) => {
            const fileReader = new FileReader();
            fileReader.onloadend = (e) => {
              const name = fileEntry.name;
              const body = e.target.result;

              rulesList.push({ name, body });

              if (rulesList.length >= results.length) {
                updateOrImportRules(rulesList);
              }
            };
            fileReader.readAsText(file);
          });
        });
      });
    });
  });
};
