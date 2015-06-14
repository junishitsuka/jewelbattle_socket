var fs = require('fs');
var http = require('http');
var server = http.createServer();
var isHost = true;
var roomNumber = 0;
var match = {};

// create http server for test
server.on('request', function(req, res) {
  var stream = fs.createReadStream('index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  stream.pipe(res);
});

// create socket server
var io = require('socket.io').listen(server);
server.listen(8000);

io.sockets.on('connection', function(socket) {
  // socket connected log
  console.log(socket['id'] + ' has connected');
  
  socket.on('init', function(data) {
    if (isHost) {
      room = socket['id'];
      match[room] = [data];
      roomNumber += 1;
      isHost = false;
    } else {
      socket.join(room);
      match[room].push(data);
      isHost = true;
      // matching success
      console.log(match[room]);
      io.to(room).emit('match', match[room]);
    }
  });

  socket.on('clearNormalBlock', function(data) {
    io.to(room).emit('clearNormalBlock', data);
  });

  socket.on('clearThiefBlock', function(data) {
    io.to(room).emit('clearThiefBlock', data);
  });
});
