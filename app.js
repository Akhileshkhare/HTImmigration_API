var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const sequelize = require('./models/index');
const User = require('./models/User');
const StaticPage = require('./models/StaticPage');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var staticPagesRouter = require('./routes/staticPages');
var evaluationRouter = require('./routes/evaluation');
var adminRouter = require('./routes/admin');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/static-pages', staticPagesRouter);
app.use('/api/evaluation', evaluationRouter);
app.use('/api/admin', adminRouter);

// Test DB connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connection established.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synchronized.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
