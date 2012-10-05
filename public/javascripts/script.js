var socket = io.connect('http://localhost');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

window.ondeviceorientation = function(event) {
  if (window.socket && window.socket.socket.connected) {
    window.socket.emit('motion', event);
  }
};