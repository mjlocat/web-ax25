class Socket {
  constructor() {
    this.wss = null;
  }

  init(wss) {
    this.wss = wss;
  }

  // TODO: How to do authentication of the websocket?
  socketRoute(ws, res) {
    ws.send('hi');
    ws.on('message', message => {
      ws.send(message);
    });
  }

  broadcastUIPacket(packet) {
    if (this.wss && this.wss.clients) {
      this.wss.clients.forEach(ws => {
        ws.send(JSON.stringify(packet));
      });
    }
  }
}

const socket = new Socket();

module.exports = socket;
