const EventEmitter = require('events');

class Socket extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.connectSocket = this.connectSocket.bind(this);
    this.disconnectSocket = this.disconnectSocket.bind(this);
    this.socketOpen = this.socketOpen.bind(this);
    this.socketMessage = this.socketMessage.bind(this);
    this.socketClose = this.socketClose.bind(this);
  }

  connectSocket() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${window.location.host}/`);
      this.socket.onopen = this.socketOpen;
      this.socket.onmessage = this.socketMessage;
      this.socket.onclose = this.socketClose;
    }
  }

  disconnectSocket() {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.onclose = undefined;
      this.socket.onmessage = undefined;
      this.socket.onopen = undefined;
      this.socket.close();
    }
  }

  socketOpen() {
    this.socket.send(JSON.stringify({
      cmd: 'authenticate',
      token: sessionStorage.getItem('token')
    }));
  }

  socketMessage(event) {
    try {
      const data = JSON.parse(event.data);
      if (data.packet) {
        this.emit('packet', data.packet);
      }
    } catch (e) {
      console.log(e);
    }
  }

  socketClose() {
    this.connectSocket();
  }
}

const socket = new Socket();

export default socket;
