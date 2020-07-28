const UnixAX25 = require('unix-ax25');
const Socket = require('./socket');

let ax25;

function startUIListener() {
  ax25 = new UnixAX25();
  ax25.on('data', packet => {
    Socket.broadcastUIPacket(packet);
    console.log(JSON.stringify(packet));
  });
  ax25.startUIListener();
}

function getPorts(req, res) {
  res.json(ax25.ports);
}

function sendUIPacket(req, res) {
  const packet = req.body.packet;
  if (packet.from && packet.to && packet.data) {
    packet.from = packet.from.toUpperCase();
    packet.to = packet.to.toUpperCase();
    if (packet.via) {
      for (let i = 0; i < packet.via.length; i++) {
        packet.via[i] = packet.via[i].toUpperCase();
      }
    }
    const bytes = ax25.writeUISocket(packet);
    res.json({
      bytes
    });
  } else {
    res.json({ status: 'failed', message: 'Missing required parameters' }).sendStatus(400);
  }
}

module.exports = {
  startUIListener,
  getPorts,
  sendUIPacket
};
