var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userNotes = require('./routes/note_routes');
var usersRouter = require('./routes/users');
var userCat = require('./routes/cat');
//var cors = require('cors');


// const MongoClient    = require('mongodb').MongoClient;
// const bodyParser     = require('body-parser');
// const db             = require('./config/db');
var app = express();
var cors = require('cors'); // Yep, you need to install this
app.use(cors()); //


//app.use(cors());
//let users = [{name: "Bob", age: 34} , {name: "Alice", age: 21}, {name: "Tom", age: 45}];
// https://metanit.com/web/nodejs/6.1.php
//const mongoClient = require("mongodb").MongoClient;
//
// const url = "mongodb://localhost:27017/";
//const url = db.url;
// mongoClient.connect(url, function(err, client){
//
//     const db = client.db("inCode");
//     const collection = db.collection("inCodeC");
//     let user = {name: "Toms", age: 21};
//     collection.insertOne(user, function(err, result){
//
//         if(err){
//             return console.log(err);
//         }
//         console.log(result.ops);
//         client.close();
//     });
// });

// mongoClient.connect(url, function(err, client){
//
//     const db = client.db("inCode");
//     const collection = db.collection("inCodeC");
//
//     if(err) return console.log(err);
//
//     collection.find().toArray(function(err, results){
//
//         console.log(results, "okey");
//         client.close();
//     });
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', userNotes);
app.use('/cat', userCat);

//require('./routes')(app, {});
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

module.exports = app;
