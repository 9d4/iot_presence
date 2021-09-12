const defaultSetting = require("./defaultSettings");
const Setting = require("../models/Setting");

async function addSettingToDb(name, value) {
  let setting = new Setting({ name, value });
  await setting.save();
}

async function setupSettings() {
  for (const [key, value] of Object.entries(defaultSetting)) {
    let setting = await Setting.findOne({ name: key }).exec();

    if (setting === null) {
      addSettingToDb(key, value);
    }
  }
}

module.export = (async function () {
  await setupSettings();
})();
