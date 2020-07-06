const { Config } = require('./db');

class AppConfig {
  constructor() {
    this.needConfig = 'true';
  }

  async init() {
    const configItems = await Config.findAll();
    configItems.forEach(item => {
      this[item.key] = item.value;
    });
    console.log(this.getAllConfigItems());
  }

  async saveConfig() {
    const configItems = this.getAllConfigItems();
    for (let i = 0; i < configItems.length; i++) {
      await Config.upsert({
        key: configItems[i].key,
        value: configItems[i].value
      });
    }
  }

  async getConfig(req, res) {
    let configItems = this.getAllConfigItems();
    configItems = configItems.filter(i => i.key !== 'jwtSecret');
    res.json({ configItems });
  }

  getAllConfigItems() {
    const configItems = [];
    Object.keys(this).forEach(key => {
      if (typeof this[key] !== 'function') {
        configItems.push({ key, value: this[key] });
      }
    });
    return configItems;
  }
}

const appConfig = new AppConfig();

module.exports = appConfig;
