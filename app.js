let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let debug = require('debug')('author');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

let compression = require('compression');
let helmet = require('helmet');

let app = express();


// Set up mongoose connection
let mongoose = require('mongoose');
//ATLAS_URI=mongodb+srv://dwstudent:<TUS>@cluster0-luj7k.azure.mongodb.net/test?retryWrites=true&w=majority
let dev_db_url = 'mongodb+srv://dwstudent:<TUS>@cluster0-luj7k.azure.mongodb.net/test?retryWrites=true&w=majority'
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true ,useUnifiedTopology:true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;