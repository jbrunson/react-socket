//SERVER SIDE CODE

var express = require('express');
var _ = require('underscore');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var audience = [];
var questions = require('./app-questions');
var currentQuestion = false;
var speaker = {};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

app.use('/', routes);
app.use('/users', users);

var connections = [];
var title = 'Untitled Presentation';

var server = app.listen(3000);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

  socket.once('disconnect', function() {
    var member = _.findWhere(audience, { id: this.id });

    if (member) {
      audience.splice(audience.indexOf(member), 1);
      io.sockets.emit('audience', audience);
      console.log("Left: %s (%s audience members)", member.name, audience.length);
    } else if (this.id === speaker.id) {
      console.log("%s has left. '%s' is over", speaker.name, title);
      speaker = {};
      title = "no title";
      io.sockets.emit('end', { title: title, speaker: ''});
    }

    connections.splice(connections.indexOf(socket), 1);
    socket.disconnect();
    console.log("Disconnects: %s sockets remaining.", connections.length);
  });

  socket.on('join', function(payload) {
    var newMember = {
      id: this.id,
      name: payload.name,
      type: 'member'
    };
    this.emit('joined', newMember);
    audience.push(newMember);
    io.sockets.emit('audience', audience); //broadcast to All sockets connected
    console.log("Audience Joined: %s", payload.name);
  });

  socket.on('start', function(payload) {
    speaker.name = payload.name;
    speaker.id = this.id;
    speaker.type = 'speaker';
    this.emit('joined', speaker);
    io.sockets.emit('start', { title: title, speaker: speaker.name });
    console.log("Presentation Started: '%s' by %s", title, speaker.name);
  });

  socket.on('ask', function(question) {
    currentQuestion = question;
    io.sockets.emit('ask', currentQuestion);
    console.log("Question Asked: '%s'", question.q);
  });

  socket.emit('welcome', {
    title: title,
    audience: audience,
    speaker: speaker.name,
    questions: questions,
    currentQuestion: currentQuestion
  });
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);
});



console.log("Polling server started on 3000")

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
