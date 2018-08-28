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
    title: { type: String, required: true},
    position: { type: Number, required: true },
    value: {type: Number, default: 0 }
} );

// подключение
mongoose.connect("mongodb://localhost:27017/inCode");
//const mongoClient = require("mongodb").MongoClient;
 var Cat = mongoose.model("cats", UserSchema);

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


     if(req.query.status == "add"){


        var cat = new Cat({title: 'testing', position: 0, value: 0});

            //var User = mongoose.model("users", UserSchema);

            cat.save(function(err){


           if(err) return console.log(err);

           console.log("Сохранен объект user", cat);

           //status_singup("singup");
           console.log("COUNT NOT: ",results);
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
