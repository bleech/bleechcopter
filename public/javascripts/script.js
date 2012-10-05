$(document).ready(function() {
  window.socket = io.connect();

  window.addEventListener('deviceorientation', function(eventData) {
    if ( window.socket ) {
      window.socket.emit('motion', {
        alpha: eventData.alpha,
        beta: eventData.beta,
        gamma: eventData.gamma
      });
    }
    document.getElementById('test').innerHTML = 'alpha: ' + eventData.alpha + '<br>beta: ' + eventData.beta + '<br>gamma: ' + eventData.gamma;
  });

  $('.power').on('click', function(e) {
    var that = $(this);
    e.preventDefault();
    if ( that.hasClass('flying') ) {
      if ( window.socket ) {
        window.socket.emit('land');
        that.removeClass('flying');
      }
    } else {
      if ( window.socket ) {
        window.socket.emit('takeoff');
        that.addClass('flying');
      }
    }
  });
});

