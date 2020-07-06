const { Sequelize, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

class Config extends Model { }
Config.init({
  key: {
    type: DataTypes.STRING,
    primaryKey: true},
  value: DataTypes.STRING
}, { sequelize });

class User extends Model { }
User.init({
  username: {
    type: DataTypes.STRING,
    primaryKey: true},
  password: DataTypes.STRING,
  name: DataTypes.STRING
}, { sequelize });

async function initDB() {
  await sequelize.sync({ });
  const numUsers = await User.count();
  if (numUsers === 0) {
    const salt = bcrypt.genSaltSync(10);
    await User.create({ username: 'N0CALL', password: bcrypt.hashSync('N0CALL', salt) });
  }
  const jwtSecret = await Config.count({ where: { key: 'jwtSecret' } });
  if (!jwtSecret) {
    await Config.create({ key: 'jwtSecret', value: crypto.randomBytes(20).toString('hex') })
  };
  console.log('synced');
}

module.exports = {
  Config,
  User,
  initDB
}
