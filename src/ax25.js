const UnixAX25 = require('unix-ax25');
const Socket = require('./socket');

function startUIListener() {
  ax25 = new UnixAX25();
  ax25.on('data', packet => {
    Socket.broadcastUIPacket(packet);
    console.log(JSON.stringify(packet));
  });
  ax25.startUIListener();
}

module.exports = {
  startUIListener
};
