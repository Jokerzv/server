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
    date: { type: Date},
    user: { type: String}
} );

var CatSchema = new mongoose.Schema( {
    title: { type: String, required: true},
    position: { type: Number, required: true },
    value: {type: Number, default: 0 },
    user_id: {type: String, required: true},
    p_cat: {type: String, default: 0}
} );

// подключение
mongoose.connect("mongodb://localhost:27017/inCode");
//const mongoClient = require("mongodb").MongoClient;
var User = mongoose.model("user", UserSchema);
var Cat = mongoose.model("cat", CatSchema);

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

function getscat(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);
         Cat.find({user_id: user_data[0]._id, p_cat: 0}).count(function(err, results){

          if(results > 0){
            Cat.find({user_id: user_data[0]._id, p_cat: 0}, function(err, user_data){
              console.log("OK");
              if(err) return console.log(err);
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(user_data);


            }).sort({ "position": 1 });

          }else{
            res.send([]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send({status: "not find user"});
      console.log("Not find user: ",results);
    }
    });
}

 function update_cats_p(one_p, id_one, two_p, id_two, status){

  if(status == "up"){

    Cat.find({position: one_p}, function(err, results){
      if(err) return console.log(err);
      //console.log(results);
      console.log("ID ONE ", results);
      Cat.updateOne({_id: id_one}, {position: two_p}, function(err, docs){
        if(err) return console.log(err);
        console.log("res ", docs);
        //console.log("Update position one!");
          });

  });

  Cat.find({position: two_p}, function(err, results){
      if(err) return console.log(err);

      Cat.updateOne({_id: id_two}, {position: one_p}, function(err, docs){
        if(err) return console.log(err);
        //console.log("Update position two!");
      });

    });

  }else if(status == "down"){
  console.log("STATUS DOWN ");

    Cat.find({position: one_p}, function(err, results){
      if(err) return console.log(err);
      //console.log(results);
      console.log("ID ONE ", results);
      Cat.updateOne({_id: id_one}, {position: one_p}, function(err, docs){
        if(err) return console.log(err);
        console.log("res ", docs);
        //console.log("Update position one!");
          });

  });

  Cat.find({position: two_p}, function(err, results){
      if(err) return console.log(err);
console.log("ID TWO ", results);
      Cat.updateOne({_id: id_two}, {position: two_p}, function(err, docs){
        if(err) return console.log(err);

        //console.log("Update position two!");
      });

    });

  }

}

function getscatup(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);
         Cat.find({user_id: user_data[0]._id, _id: req.query.catid}).count(function(err, results){

          if(results > 0){

            Cat.find({_id: req.query.catid}, function(err, user_data_cat){
              console.log("OK");
              if(err) return console.log(err);

              console.log(user_data_cat[0].position);
              if(user_data_cat[0].position != 0){
                var one = user_data_cat[0].position,
                    two = user_data_cat[0].position - 1;

                Cat.find({position: [one, two]}, function(err, cats_find){

                  //  User.update({token: md5(now().toString())}, function(err, docs){
                        //console.log("ID one  ", cats_find[0]._id, "id two ", cats_find[1]._id);
                        update_cats_p(one, cats_find[0]._id, two, cats_find[1]._id, "up");
                  //  });


                });

              }
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(catres_data);


               });

          }else{
            res.send([]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send({status: "not find user"});
      console.log("Not find user: ",results);
    }
    });
}

function getscatdown(){
  var count_cats_n = 0;
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

        Cat.find({user_id: user_data[0]._id}).count(function(err, count_cats_now){
            if(err) return console.log(err);
            count_cats_n = count_cats_now - 1;
          console.log("COUNT CAT: ", count_cats_now);
        });
         Cat.find({user_id: user_data[0]._id, _id: req.query.catid}).count(function(err, results){

          if(results > 0){

            Cat.find({_id: req.query.catid}, function(err, user_data_cat){
              console.log("OK find user");
              if(err) return console.log(err);

              console.log(user_data_cat[0].position);
              if(user_data_cat[0].position != count_cats_n){
                var one = user_data_cat[0].position,
                    two = user_data_cat[0].position + 1;

                Cat.find({position: [one, two]}, function(err, cats_find){
                  console.log("send func up_pos");
                  //  User.update({token: md5(now().toString())}, function(err, docs){
                        //console.log("ID one  ", cats_find[0]._id, "id two ", cats_find[1]._id);
                        update_cats_p(one, cats_find[0]._id, two, cats_find[1]._id, "down");
                  //  });


                });

              }
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(catres_data);


               });

          }else{
            res.send([]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send({status: "not find user"});
      console.log("Not find user: ",results);
    }
    });
}

function getscatdelete(){


  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);


         Cat.find({user_id: user_data[0]._id, _id: req.query.catid}).count(function(err, results){

          if(results > 0){

            Cat.deleteOne({_id: req.query.catid}, function(err, user_data_cat){
              console.log("OK find user");
              if(err) return console.log(err);

              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(catres_data);


               });

          }else{
            res.send([]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send({status: "not find user"});
      console.log("Not find user: ",results);
    }
    });
}

function getscatpod(){


  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

//db.users.find( { age: { $gte: 18, $lte: 30 } } );
         Cat.find({user_id: user_data[0]._id, p_cat: {$ne: 0}}).count(function(err, results){

          if(results > 0){
            console.log(results);

             Cat.find({user_id: user_data[0]._id, p_cat: {$ne: 0}}, function(err, pod_cat){
                 console.log(pod_cat);
               catres_data = [{
                 status: "отвечаю cat!"
               }]
               res.send(pod_cat);

             });


          }else{
            res.send([]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send({status: "not find user"});
      console.log("Not find user: ",results);
    }
    });
}

     if(req.query.status == "add"){

        User.find({token: req.query.token, verif: 1}).count(function(err, results){

          if(results > 0){
            User.find({token: req.query.token, verif: 1}, function(err, user_data){

              Cat.find({user_id: user_data[0]._id}).count(function(err, cat){

                      var count_cat = cat++;
                      var cat = new Cat({title: 'Category '+count_cat, position: count_cat, value: 0, user_id: user_data[0]._id});

                          cat.save(function(err){


                           if(err) return console.log(err);

                           console.log("Сохранен объект user", cat);
                           getscat();
                         });




                  });
              });
          }else{
            res.send({status: "not user"});
            console.log("Not find user: ",results);
          }
          });
     }else if(req.query.status == "getcat"){

        getscat();
     }else if(req.query.status == "getcatup"){

        getscatup();
     }else if(req.query.status == "getscatdown"){

        getscatdown();
     }else if(req.query.status == "getscatdelete"){

        getscatdelete();
     }else if(req.query.status == "getscatpod"){

        getscatpod();
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
