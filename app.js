var createError = require('http-errors');
var express = require('express');
var expressWs = require('express-ws');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var pubsub = require('./pubsub');

var indexRouter = require('./routes/index');

var { app, getWss } = expressWs(express());

app.locals.pluralize = require('pluralize');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Define web socket route
app.ws('/websocket', ws => {
  // update client on a best effort basis
  try {
    console.log('pubsub', pubsub);
    console.log('timestamp', pubsub.timestamp);
    ws.send(pubsub.timestamp.toString());
  } catch (error) {
    console.error(error)
  }

  // We don’t expect any messages on websocket, but log any ones we do get.
  ws.on('message', console.log);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Publish count updates to all web socket clients
pubsub.connect(getWss())

module.exports = app;
