const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
const config = require('./appconfig');
const auth = require('./auth');

let wss;
function startServer() {
  return new Promise(
    (resolve) => {
    const app = express();
    const port = 5000;
    wss = expressWs(app).getWss();
    app.use(bodyParser.json());

    app.post('/login', auth.login);
    app.delete('/login', auth.logout);

    app.get('/appconfig', auth.verify, (req, res) => config.getConfig(req, res));
    app.post('/appconfig', auth.verify, (req, res) => config.updateConfig(req, res));

    app.ws('/', (ws, req) => {
      ws.send("hi");
      ws.on('message', message => {
        ws.send(message);
      });
    });

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
module.exports.wss = wss;
