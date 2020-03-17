var app = require('./gaivota/config/express')();
var fs = require('fs')

app.secret = require('./gaivota/config/secret')()
app.io = require('socket.io')();

var http = require('http').createServer(app);

app.io.attach(http)


require('./gaivota/config/passport.js')();
require('./gaivota/config/database.js')(app.mongoUrl)

app.io.on('connection', (socket)=>{

  console.log('new connection', socket.id)

  if(socket.handshake.query.match){
     console.log(socket.handshake.query.match)
     socket.join(socket.handshake.query.match)
  }

  socket.on('C', (data) => {
    socket.join(data.query.match)
    app.io.use(function(data, next) {
      var handshake = data;
      next();
    });
  })

})

http.listen(3000, function() {
  console.log("Server run in port" + app.get('port'));
});
