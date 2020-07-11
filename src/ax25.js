const UnixAX25 = require('unix-ax25');

function startUIListener(wss) {
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
