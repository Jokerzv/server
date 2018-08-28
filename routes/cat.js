var express = require('express');
var router = express.Router();
var cors = require('cors');
const md5 = require('js-md5');

//const MongoClient    = require('mongodb').MongoClient;
//const bodyParser     = require('body-parser');
//const db2             = require('../config/db');

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema( {
    email: { type: String, required: true, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
    pass: { type: String, required: true, match: /^[a-zA-Z0-9]+$/ },
    secret: {type: String},
    verif: { type: Number, default: 0 },
    date: { type: Date, default: Date.now()},
    token: { type: String, default: md5(Date.now().toString())}
} );

// подключение
mongoose.connect("mongodb://localhost:27017/inCode");
//const mongoClient = require("mongodb").MongoClient;
 var Cat = mongoose.model("cat", UserSchema);

var posts;

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
        status: "verif",
        secret: 123
      };
        //mongoose.disconnect();
      res.send(results);
    //return results;
    }
  }
//
// Проверка почты


     if(req.query.status == "verif"){

       User.find({email: req.query.email, verif: 0, secret: req.query.secret}).count(function(err, results){
          //client.close();
           //posts = results;
           if(results > 0){

            //var User = mongoose.model("users", UserSchema);

             User.update({email: req.query.email}, {verif: 1}, function(err, result){


	               if(err) return console.log(err);

	                console.log(result);

                  User.find({email: req.query.email}, function(err, docs){

                    results = {
                      status: "wellcome",
                      token: docs[0].token,
                      email: docs[0].email
                    };
                    //mongoose.disconnect();
                    res.send(results);
                  });

                });



           }else{


             results = {
               status: "error_secret",
               secret: 123
             };
             //mongoose.disconnect();
             res.send(results);


           }
           //console.log("COUNT USERS: ",results);

       });
     }else if(req.query.status == "login"){

       User.find({email: req.query.email, pass: md5(req.query.pass)}).count(function(err, results){

           //posts = results;
           if(results > 0){

             User.find({email: req.query.email, verif: 1}).count(function(err, results){
                //client.close();
                if(results > 0){

                  //var User = mongoose.model("users", UserSchema);
                  User.find({email: req.query.email}, function(err, docs){
                    //mongoose.disconnect();

                    if(err) return console.log(err);

                    results = {
                      status: "wellcome",
                      id: docs[0]._id,
                      email: docs[0].email
                    }
                    res.send(results);
                  });


                }else{

                  results = {
                    status: "verif",
                    secret: 123
                  };
                  res.send(results);
                }

             });
           }else{


             results = {
               status: "error_login"
             };
             res.send(results);


           }
           //console.log("COUNT USERS: ",results);
           //client.close();
       });
     }else if(req.query.status == "signup"){


       var user = new User({email: req.query.email, pass: md5(req.query.pass), secret: 123});


       User.find({email: req.query.email}).count(function(err, results){

           //posts = results;
           if(results > 0){
             console.log("COUNT USERS: ", results);

             status_singup("cancel_email");
           }else{





             user.save(function(err){


            if(err) return console.log(err);

            console.log("Сохранен объект user", user);

            status_singup("singup");
            console.log("COUNT NOT: ",results);
            });


           }
           //console.log("COUNT USERS: ",results);
           //client.close();
       });

     }

  //});
//
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE');


});

module.exports = router;
