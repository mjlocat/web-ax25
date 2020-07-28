const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
const config = require('./appconfig');
const auth = require('./auth');
const Socket = require('./socket');
const ax25 = require('./ax25');

function startServer() {
  return new Promise(
    (resolve) => {
    const app = express();
    const port = 5000;
    const wss = expressWs(app).getWss();
    Socket.init(wss);
    app.use(bodyParser.json());

    app.post('/login', auth.login);
    app.delete('/login', auth.logout);

    app.get('/appconfig', auth.verify, (req, res) => config.getConfig(req, res));
    app.post('/appconfig', auth.verify, (req, res) => config.updateConfig(req, res));

    app.get('/ports', auth.verify, ax25.getPorts);

    app.post('/UIPacket', auth.verify, ax25.sendUIPacket);

    app.ws('/', (ws, res) => Socket.socketRoute(ws, res));

    app.use(express.static(path.join(__dirname, '..', 'frontend/build')));
    app.use((req, res) => {
      res.sendFile(path.join(__dirname, '..', 'frontend/build/index.html'));
    });

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
      resolve();
    });
  });
}

module.exports = startServer;
