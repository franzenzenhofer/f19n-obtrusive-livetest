import { difference } from 'lodash';
import rulesStore from './../store/rules';

const updateOrImportRules = (rulesToImport, done = () => {}) => {
  const { name, body } = rulesToImport.shift();
  rulesStore.all((rules) => {
    const existingRuleIndex = rules.findIndex(r => r.get('name') === name && r.get('defaultRule') === true);
    const cb = rulesToImport.length > 0 ? () => { updateOrImportRules(rulesToImport, done); } : done;
    if (existingRuleIndex !== -1) {
      rulesStore.update(existingRuleIndex, { body }, cb);
    } else {
      rulesStore.add({ name, body, defaultRule: true }, cb);
    }
  }, true);
};

const deleteUnsupportedRules = (supportedRules) => {
  const deleteRules = (rules = []) => {
    const ruleToDelete = rules.shift();
    rulesStore.remove((r) => {
      return r.get('name') === ruleToDelete;
    }, () => {
      if (rules.length > 0) {
        deleteRules(rules);
      }
    });
  };

  rulesStore.all((allRules) => {
    const allRulesNames = allRules.toJS().map(r => r.name);
    const supportedRulesNames = supportedRules.map(r => r.name);

    const ruleNamesToDelete = difference(allRulesNames, supportedRulesNames);

    deleteRules(ruleNamesToDelete);
  }, true);
};

export default (path = 'default-rules') => {
  const rulesList = [];

  chrome.runtime.getPackageDirectoryEntry((root) => {
    root.getDirectory(path, { create: false }, (dir) => {
      const reader = dir.createReader();
      reader.readEntries((files) => {
        const jsFilesOnly = files.filter(r => r.name.match(/\.js$/));
        jsFilesOnly.forEach((fileEntry) => {
          fileEntry.file((file) => {
            const fileReader = new FileReader();
            fileReader.onloadend = (e) => {
              const name = fileEntry.name;
              const body = e.target.result;

              rulesList.push({ name, body });

              if (rulesList.length >= jsFilesOnly.length) {
                updateOrImportRules(rulesList.slice(), () => {
                  deleteUnsupportedRules(rulesList);
                });
              }
            };
            fileReader.readAsText(file);
          });
        });
      });
    });
  });
};
