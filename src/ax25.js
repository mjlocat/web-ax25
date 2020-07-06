const UnixAX25 = require('unix-ax25');
const { wss } = require('./server');


function startUIListener() {
  ax25 = new UnixAX25();
  ax25.on('data', packet => {
    wss.clients.forEach(ws => {
      ws.send(JSON.stringify(packet));
    });
    console.log(JSON.stringify(packet));
  });
  ax25.startUIListener();
}

module.exports = {
  startUIListener
};
