const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./appconfig');
const { User } = require('./db');

async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username }});
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = jwt.sign({ username, needConfig: config.needConfig }, config.jwtSecret);
    res.json({
      accessToken
    });
  } else {
    res.sendStatus(403);
  }
}

function verify(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, config.jwtSecret);
      req.user = user;
      next();
    } catch (e) {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
}

function logout(req, res) {

}

module.exports = {
  login,
  verify,
  logout
};
