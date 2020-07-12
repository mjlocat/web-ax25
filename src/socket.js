const jwt = require('jsonwebtoken');
const config = require('./appconfig');

class Socket {
  constructor() {
    this.wss = null;
  }

  init(wss) {
    this.wss = wss;
  }

  // TODO: How to do authentication of the websocket?
  socketRoute(ws, res) {
    ws.isAuthenticated = false;
    ws.on('message', message => this.socketMessage(ws, message));
  }

  socketMessage(ws, message) {
    try {
      const input = JSON.parse(message);
      if (input.cmd) {
        switch (input.cmd) {
          case 'authenticate':
            if (input.token) {
              jwt.verify(input.token, config.jwtSecret);
              ws.isAuthenticated = true;
              ws.send(JSON.stringify({ message: 'Authenticated' }));
            } else {
              ws.send(JSON.stringify({ message: 'Access token expected' }));
            }
            break;
          case 'isAuthenticated':
            ws.send(JSON.stringify({ isAuthenticated: ws.isAuthenticated }));
            break;
          default:
            ws.send(JSON.stringify({ message: 'Unknown command' }));
        }
      } else {
        ws.send(JSON.stringify({ message: 'No command specified' }));
      }
    } catch (e) {
      ws.send(JSON.stringify({ message: e.message }));
    }
  }

  broadcastUIPacket(packet) {
    if (this.wss && this.wss.clients) {
      this.wss.clients.forEach(ws => {
        if (ws.isAuthenticated) {
          ws.send(JSON.stringify({ packet }));
        }
      });
    }
  }
}

const socket = new Socket();

module.exports = socket;
