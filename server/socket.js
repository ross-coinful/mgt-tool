const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 8010;

io.on('connection', (socket) => {
  console.log('a user connected');

  io.emit('test', 'Hello world!');

  socket.on('disconnect', () => {
    console.log('a user go out');
  });
});

server.listen(port, (err) => {
  if (err) {
    console.error(err);
  }

  console.info('==>Socket is running on port %s', port);
});
