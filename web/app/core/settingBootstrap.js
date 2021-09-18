const defaultSetting = require("./defaultSettings");
const Setting = require("../models/Setting");

function addSettingToDb(name, value) {
  let setting = new Setting({ name, value });
  return setting.save();
}

function setupSettings() {
  return new Promise(function (resolve, reject) {
    for (const [key, value] of Object.entries(defaultSetting)) {
      let setting = Setting.findOne({ name: key }).exec();

      setting
        .then(function (val) {
          if (val === null) {
            return addSettingToDb(key, value);
          }
        })
        .then();
    }

    console.log("[setting] done");
    resolve();
  });
}

module.exports = setupSettings();
