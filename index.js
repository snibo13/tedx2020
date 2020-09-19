var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var p = process.env.PORT || 3000;

server.listen(p, () => {
  console.log("Listening on port %d", p)
});

app.get('/viewer.html', (req, res) => {
  res.sendFile(__dirname + '/viewer.html');
});

app.get('/presenter.html', (req, res) => {
  res.sendFile(__dirname + '/presenter.html');
})

var numViewers = -1; //Offset for preseter count

io.on('connection', (socket) => {
  ++numViewers;
  socket.broadcast.emit('viewers', numViewers);

  socket.on('react', (react) => {
    console.log(react);
    socket.broadcast.emit('react', react);
  });

  socket.on('connect', () => {
    ++numViewers;
    socket.broadcast.emit('viewers', numViewers);
  });

  socket.on('disconnect', () => {
    --numViewers;
    socket.broadcast.emit('viewers', numViewers);
  })
});
