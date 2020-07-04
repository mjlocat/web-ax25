const express = require('express');
const expressWs = require('express-ws');
const UnixAX25 = require('unix-ax25');

let ax25;
const app = express();
const port = 5000;
const wss = expressWs(app).getWss();

app.ws('/', (ws, req) => {
  ws.send("hi");
  ws.on('message', message => {
    ws.send(message);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

ax25 = new UnixAX25();
ax25.on('data', packet => {
  wss.clients.forEach(ws => {
    ws.send(JSON.stringify(packet));
  });
  console.log(JSON.stringify(packet));
});
ax25.startUIListener();
// setInterval(() => wss.clients.forEach(ws => ws.send(ax25++)), 5000);
