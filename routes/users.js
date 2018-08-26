var express = require('express');
var router = express.Router();
var cors = require('cors');

const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db2             = require('../config/db');

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema( {
    email: { type: String, required: true, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
    pass: { type: String, required: true, match: /^[a-zA-Z0-9]+$/ },
    secret: {type: String},
    verif: { type: Number, default: 0 },
    date: { type: Date }
} );

// подключение
mongoose.connect("mongodb://localhost:27017/inCode");
//var app = express();

//let users = [{name: "Bob", age: 34} , {name: "Alice", age: 21}, {name: "Tom", age: 45}];
// https://metanit.com/web/nodejs/6.1.php
const mongoClient = require("mongodb").MongoClient;

const url = db2.url;
 router.use(cors());
var posts;

// router.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });
router.get('/', function(req, res, next) {
  var results = {};
  //GET data
  var email = req.query.email;
  //
// Функция добавления пользователя

// End
// Функция данный пользователь уже зарегистрирован!
  function status_singup(status){
    if(status == "cancel_email"){
      results = {
        status: "cancel_email"
      };
      res.send(results);
    }else if(status == "singup"){
      results = {
        status: "verif"
      };
      res.send(results);
    //return results;
    }
  }
//
// Проверка почты
  mongoClient.connect(url, function(err, client){

     const db = client.db("inCode");
     const collection = db.collection("users");

     if(err) return console.log(err);

     collection.find({email: req.query.email}).count(function(err, results){

         //posts = results;
         if(results > 0){
           console.log("COUNT USERS: ", results);

           status_singup("cancel_email");
         }else{


           var User = mongoose.model("users", UserSchema);
           var user = new User({email: req.query.email, pass: req.query.pass, secret: 123});

           user.save(function(err){
            mongoose.disconnect();

          if(err) return console.log(err);

          console.log("Сохранен объект user", user);

          status_singup("singup");
          console.log("COUNT NOT: ",results);
          });


         }
         //console.log("COUNT USERS: ",results);
         client.close();
     });
  });
//
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // res.header('Access-Control-Allow-Origin', '*');
      // res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
      // res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');


      // Request headers you wish to allow
    //  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      //res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      //next();


// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// var db = mongoose.createConnection('mongodb://localhost:27017/inCode');
// var Schema = mongoose.Schema;
// var posts = {};
//
// var userScheme = new Schema({name: String, age: Number}, {versionKey: false});
// var User = mongoose.model("User", userScheme);
// User.find({}, function(err, docs){
//     mongoose.disconnect();
//
//     if(err) return console.log(err);
//
//     posts = docs;
//
// });

// var UserSchema = new mongoose.Schema( {
//     name: { type: String, default: "hahaha" },
//     age: { type: Number, min: 18, index: true },
//     bio: { type: String, match: /[a-z]/ },
//     date: { type: Date },
//     buff: Buffer
// } );
// let greeting;
// UserSchema.methods.speak = function () {
//     greeting = this.name
//         ? "My name is " + this.name
//         : "I don't have a name"
//     console.log(greeting);
// }

// var User = db.model("User",UserSchema)
// var newUser = new User({ name: "Alice", age: 20})
// User.find({ name: /^Al/ },function (err, users) {
//   res.send(users);
//     })
// var countusers;
// var userss = db.model("users",UserSchema);
// db.users.count( function( err, count){
//     //console.log( "Number of users:", count );
//     countusers = count;
// })

// var userSchema = new mongoose.Schema({name:String,password:String});
//  var userModel = db.model('users2',userSchema);
//  var anand = new userModel({ name: ''});
 // anand.save(function (err, docs) {
 //   if (err) {
 //       console.log('Error');
 //   } else {
 //       userModel.count({name: 'Alice'}, function(err, c) {
 //           posts = c;
 //      });
 //   }
 // });

//  userModel.count({}, function( err, count){
//     posts = count;
// })
 //posts = req.query;



// newUser.speak();
//
// newUser.save(function (err, newUser) {
//     if (err){
//       res.send(
//         "not"
//         );
//         //console.log("Something goes wrong with user " + newUser.name);
//     }else{
//       res.send(
//         "Save oK"
//         );
//         //newUser.speak();
//     }
// });

// mongoose.connect(db2, options).then(
//
// () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
//
// err => { /** handle initial connection error */ }
//
// );



// mongoClient.connect(url, function(err, client){
//
//     const db = client.db("inCode");
//     const collection = db.collection("users");
//
//     if(err) return console.log(err);
//
//     let user = {email: "jokerobscure@mail.com", pass: 123};
//
//         // collection.insertOne(user, function(err, result){
//         //
//         //     if(err){
//         //         return console.log(err);
//         //     }
//         //     console.log(result.ops);
//         //     client.close();
//         // });
//
//     collection.find().toArray(function(err, results){
//
//
//
//         client.close();
//     });
// });

/* GET users listing. */



});

module.exports = router;


// // routes/index.js
// const noteRoutes = require('./user');
// module.exports = function(app, db) {
//   noteRoutes(app, db);
//   // Тут, позже, будут и другие обработчики маршрутов
// };