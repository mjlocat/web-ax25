const { initDB } = require('./db');
const config = require('./appconfig');
const server = require('./server');
const ax25 = require('./ax25');

(async () => {
  await initDB();
  await config.init();
  const wss = await server();
  ax25.startUIListener(wss);
})();