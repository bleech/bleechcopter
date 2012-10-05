
/**
 * Module dependencies.
 */

var express = require('express'),
    routes  = require('./routes'),
    user    = require('./routes/user'),
    http    = require('http'),
    path    = require('path'),
    arDrone = require('ar-drone'),
    io      = require('socket.io');

var app     = express(),
    server  = http.createServer(app),
    client  = arDrone.createClient(),
    sio     = io.listen(server);

var droneControl = function( data ) {
  console.log(data);
  if ( data.beta < 30 ) {
    client.front( ( data.beta - 45 ) * -1 );
  } else if( data.beta >= 30 && data.beta <= 60 ) {
    client.stop();
  } else if( data.beta > 60 ) {
    client.back( ( data.beta - 45 ) * -1 );
  }
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

sio.on('connection', function (socket) {
    console.log('A socket connected!');
    // do all the session stuff
    socket.join(socket.handshake.sessionID);
    // socket.io will leave the room upon disconnect
    socket.on('motion', function (data) {
      droneControl(data);
    });
    socket.on('takeoff', function (data) {
      client.takeoff();
    });
    socket.on('land', function (data) {
      client.land();
    });
});