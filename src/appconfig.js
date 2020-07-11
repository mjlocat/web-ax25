const bcrypt = require('bcryptjs');
const { Config, User } = require('./db');

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
    const keys = Object.keys(configItems);
    for (let i = 0; i < keys.length; i++) {
      await Config.upsert({
        key: keys[i],
        value: configItems[keys[i]]
      });
    }
  }

  async getConfig(req, res) {
    let configItems = this.getAllConfigItems();
    delete configItems.jwtSecret;
    res.json(configItems);
  }

  async updateConfig(req, res) {
    const userUpdate = {};
    Object.keys(req.body).forEach(i => {
      switch (i) {
        case 'username':
          userUpdate.username = req.body[i].toUpperCase();
          break;
        case 'password':
          const salt = bcrypt.genSaltSync(10);
          userUpdate.password = bcrypt.hashSync(req.body[i], salt);
          break;
        case 'realName':
          userUpdate.name = req.body[i];
          break;
        default:
          this[i] = req.body[i];
      }
    });
    this.needConfig = 'false';
    const needNewLogin = await this.updateUser(req.user, userUpdate);
    await this.saveConfig();
    res.json({ needNewLogin, needConfig: 'false' });
  }

  async updateUser(currentUser, updatedUser) {
    const usernameUpdate = currentUser.username.toUpperCase() !== updatedUser.username.toUpperCase();
    const otherUpdate = (updatedUser.password || currentUser.name !== updatedUser.name);
    if (usernameUpdate || otherUpdate) {
      const dbUser = await User.findOne({ where: { username: currentUser.username.toUpperCase() } });
      if (usernameUpdate) {
        updatedUser.password = updatedUser.password || dbUser.password;
        updatedUser.name = updatedUser.name || dbUser.name;
        await User.create(updatedUser);
        await dbUser.destroy();
        return true;
      } else {
        await dbUser.update(updatedUser);
      }
    }
    return false;
  }

  getAllConfigItems() {
    const configItems = {};
    Object.keys(this).forEach(key => {
      if (typeof this[key] !== 'function') {
        configItems[key] = this[key];
      }
    });
    return configItems;
  }
}

const appConfig = new AppConfig();

module.exports = appConfig;
