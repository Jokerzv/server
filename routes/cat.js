var express = require('express');
var router = express.Router();
var cors = require('cors');
const md5 = require('js-md5');

//const MongoClient    = require('mongodb').MongoClient;
//const bodyParser     = require('body-parser');
//const db2             = require('../config/db');

var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;
var toFixed = require('tofixed');
var parseInt = require('parse-int');
var pf = require('parse-float');
//mongoose.Promise = global.Promise;

function now() {
    return new Date().getTime();
  };

  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();

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
    position: { type: Number, required: false },
    value: {type: Number, default: 0 },
    user_id: {type: String, required: true},
    p_cat: {type: String, default: 0},
    p_cat_is: {type: Number, default: 0}
} );

var ExSchema = new mongoose.Schema( {
    desc: { type: String, required: true},
    namecat: {type: String, required: true},
    value: {type: SchemaTypes.Double, default: 0 },
    user_id: {type: String, required: true},
    date: {type: Date, default: now()},
    date_t: {type: String, default: today.toLocaleDateString("en-US", options)},
    p_cat: {type: String, default: 0}
} );

// подключение
mongoose.connect("mongodb://localhost:27017/inCode");
//const mongoClient = require("mongodb").MongoClient;
var User = mongoose.model("user", UserSchema);
var Cat = mongoose.model("cat", CatSchema);
var Ex = mongoose.model("ex", ExSchema);

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

function addexpense(){
  User.find({token: req.query.token, verif: 1}).count(function(err, results){

    if(results > 0){
      User.find({token: req.query.token, verif: 1}, function(err, user_data){

        Cat.find({_id: req.query.namecat, user_id: user_data[0]._id}, function(err, cat_data){

          var addex = new Ex({desc: req.query.desc, namecat: cat_data[0].title, value: pf(req.query.value), user_id: user_data[0]._id, p_cat: cat_data[0].p_cat});

              addex.save(function(err){


               if(err) return console.log(err);

               console.log("Сохранен объект EX");
               Cat.find({_id: cat_data[0]._id}, function(err, cat_data2){


                 //console.log("AAAAAAAA ------ ", pf(cat_data[0].value) + pf(req.query.value));
                 Cat.updateOne({_id: cat_data[0]._id}, {value: pf(cat_data[0].value) + pf(req.query.value)}, function(err, docs){
                   if(err) return console.log(err);
                   console.log("Update ONE  ", docs);
                   //console.log("Update position one!");
                     });
                   });


               getscat();
             });

        });








        });
    }else{
      res.send({status: "not user"});
      console.log("Not find user: ",results);
    }
    });
}


function getscataddp(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      //console(ObjectID(results._id));
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

         Cat.find({user_id: user_data[0]._id, p_cat: 0}).count(function(err, results){

          if(results > 0){
            Cat.find({user_id: user_data[0]._id, p_cat: 0, _id: req.query.catid}, function(err, cat_data){
              console.log("OK");
              if(err) return console.log(err);

              Cat.updateOne({_id: req.query.selectedcatid}, {p_cat_is: 1}, function(err, docs){
                if(err) return console.log(err);
                console.log("Update ONE  ", docs);
                //console.log("Update position one!");
                  });

                  var cat = new Cat({title: cat_data[0].title, p_cat: req.query.selectedcatid, value: cat_data[0].value, user_id: cat_data[0].user_id, p_cat_is: 2});

                  cat.save(function(err){
                    if(err) return console.log(err);
                  });

                  Cat.deleteOne({_id: req.query.catid}, function(err, user_data_cat){
                    console.log("OK DELETE CAT", user_data_cat);
                    if(err) return console.log(err);



                      });

                      Cat.find({position: {$gte: cat_data[0].position}}, function(err, count_new_cats){
                        Cat.find({position: {$gte: cat_data[0].position}}).count(function(err, count_users_c){
                          var i = 0;
                          var newcatmass = [];
                          newcatmass = count_new_cats;
                            for (var i = 0; i < count_users_c; i++) {

                              Cat.updateOne({_id: newcatmass[i]._id}, {position: newcatmass[i].position - 1}, function(err, docs){
                                if(err) return console.log(err);

                                console.log("Update position ", newcatmass);
                              });

                            console.log(i);
                            // ещё какие-то выражения
                            }
                          console.log(count_new_cats);
                            });
                      });


                      Cat.find({user_id: cat_data[0].user_id, p_cat: 0}, function(err, cat_data_now){
                        console.log("OK");
                        if(err) return console.log(err);
                        //console.log("Not find user: ",catres);
                        catres_data = [{
                          status: "отвечаю cat!"
                        }]
                        res.send(cat_data_now);


                      }).sort({ "position": 1 });




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

function getexpenses_pod(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      //console(ObjectID(results._id));
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

         Cat.find({user_id: user_data[0]._id, p_cat: req.query.ex_id}).count(function(err, results){

          if(results > 0){
            Cat.find({user_id: user_data[0]._id, p_cat: req.query.ex_id}, function(err, user_data){
              console.log("OK");
              if(err) return console.log(err);
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(user_data);


            }).limit(20).sort({ "position": 1 });

          }else{
            res.send([{not: 0}]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send([]);
      console.log("Not find user: ",results);
    }
    });
}

function getexpenses(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      //console(ObjectID(results._id));
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

         Ex.find({user_id: user_data[0]._id}).count(function(err, results){

          if(results > 0){
            Ex.find({user_id: user_data[0]._id}, function(err, user_data){
              console.log("OK");
              if(err) return console.log(err);
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(user_data);


            }).limit(20).sort({ "position": 1 });

          }else{
            res.send([]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send([]);
      console.log("Not find user: ",results);
    }
    });
}

function getexpensesselect_cats(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      //console(ObjectID(results._id));
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

         Cat.find({user_id: user_data[0]._id}).count(function(err, results){
           //, _id: {$ne: req.query.catid}
          if(results > 0){
            Cat.find({user_id: user_data[0]._id}, function(err, user_data){
              console.log("OK");
              if(err) return console.log(err);
              //console.log("Not find user: ",catres);

              var newMassive = [];
              var data = [];
              for (var i = 0; i < results; i++) {

                data[i] = {
                value: user_data[i]._id,
                label: user_data[i].title
              };
                newMassive.push(data[i]);



              }
                cats_pod_not = [{
                  value: user_data[0]._id,
                  label: user_data[0].title
            }]
            console.log("NEW!!! Massive ", newMassive);
             console.log("NEW!!! NOTEN ");
              res.send(newMassive);


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

function getscatselectetnotp(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      //console(ObjectID(results._id));
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

         Cat.find({user_id: user_data[0]._id}).count(function(err, results){
           //, _id: {$ne: req.query.catid}
          if(results > 0){
            Cat.find({user_id: user_data[0]._id}, function(err, user_data){
              console.log("OK");
              if(err) return console.log(err);
              //console.log("Not find user: ",catres);

              var newMassive = [];
              var data = [];
              for (var i = 0; i < results; i++) {

                data[i] = {
                value: user_data[i]._id,
                label: user_data[i].title
              };
                newMassive.push(data[i]);



              }
                cats_pod_not = [{
                  value: user_data[0]._id,
                  label: user_data[0].title
            }]
            console.log("NEW!!! Massive ", newMassive);
             console.log("NEW!!! NOTEN ");
              res.send(newMassive);


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

function getscatall(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      //console(ObjectID(results._id));
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);

         Cat.find({user_id: user_data[0]._id, p_cat_is: {$ne: 2}}).count(function(err, results){

          if(results > 0){
            Cat.find({user_id: user_data[0]._id, p_cat_is: {$ne: 2}}, function(err, user_data){
              console.log("OK");
              if(err) return console.log(err);
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(user_data);


            }).sort({ "_id": 1 });

          }else{
            res.send([]);
            console.log("Not cat user: ",results);
          }

            });
       });

    }else{
      res.send([]);
      console.log("Not find user: ",results);
    }
    });
}

function getscat(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      //console(ObjectID(results._id));
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
      res.send([]);
      console.log("Not find user: ",results);
    }
    });
}

 function update_cats_p(one_p, id_one, two_p, id_two, status){

  if(status == "up"){
console.log("---- UP!!!");
    Cat.find({position: one_p}, function(err, results){
      if(err) return console.log(err);
      //console.log(results);
      console.log("------ID ONE ", id_one);
      Cat.updateOne({_id: id_one}, {position : two_p}, function(err, docs){
        if(err) return console.log(err);
        console.log("Update ONE  ", docs);
        //console.log("Update position one!");
          });

  });

  Cat.find({position: two_p}, function(err, results){
      if(err) return console.log(err);
console.log("ID TWO ", results);
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



function getcatup(){
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
           if(err) return console.log(err);
          if(results > 0){

            Cat.find({_id: req.query.catid}, function(err, user_data_cat){
              console.log("OK find user");
              if(err) return console.log(err);

              console.log(user_data_cat[0].position);
              if(user_data_cat[0].position != 0){


              //if(user_data_cat[0].position != count_cats_n){
                var one = user_data_cat[0].position,
                    two = user_data_cat[0].position - 1;

                Cat.find({position: { $in: [ one, two ] }}, function(err, cats_find){
                  if(err) return console.log(err);
                  console.log("send func up_pos", cats_find);
                  //console.log("----- Selected id one cat", cats_find[0]._id);
                  //console.log("----- Selected id two cat", cats_find[1]._id);
                  //  User.update({token: md5(now().toString())}, function(err, docs){
                        //console.log("ID one  ", cats_find[0]._id, "id two ", cats_find[1]._id);
                        update_cats_p(one, cats_find[0]._id, two, cats_find[1]._id, "up");
                  //  });


                });

              //}
              }
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(catres_data);


               })




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

                Cat.find({position: { $in: [ one, two ] }}, function(err, cats_find){
                  //console.log("send func up_pos", cats_find);
                  if(err) return console.log(err);
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

function getscatdeletePod(){
  User.find({token: req.query.token}).count(function(err, results){

    if(err) return console.log(err);
    if(results > 0){
      User.find({token: req.query.token, verif: 1}, function(err, user_data){
        if(err) return console.log(err);


         Cat.find({user_id: user_data[0]._id, _id: req.query.catid}).count(function(err, results){
           //var position_u;
          if(results > 0){
            Cat.find({_id: req.query.catid}, function(err, user_data_cat2){
              //position_u = user_data_cat2[0].position;
              console.log("POS ", user_data_cat2[0].position);

              Cat.updateOne({_id: user_data_cat2[0].p_cat}, {p_cat_is: 0}, function(err, docs){
                if(err) return console.log(err);
                console.log("Update ONE  ", docs);
                //console.log("Update position one!");
                  });

            Cat.deleteOne({_id: req.query.catid}, function(err, user_data_cat){
              console.log("OK find user");
              if(err) return console.log(err);
              Cat.find({user_id: user_data[0]._id, "position" : {"$exists" : true}}).count(function(err, cat){

                      var count_cat = cat++;
                      var cat = new Cat({title: user_data_cat2[0].title, position: count_cat, value: user_data_cat2[0].value, user_id: user_data_cat2[0].user_id});

                          cat.save(function(err){


                           if(err) return console.log(err);

                           console.log("Сохранен объект user", cat);
                           getscat();
                         });
                      });




              // //console.log("Not find user: ",catres);
              // catres_data = [{
              //   status: "отвечаю cat!"
              // }]
              // res.send(catres_data);


               });
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
           //var position_u;
          if(results > 0){
            Cat.find({_id: req.query.catid}, function(err, user_data_cat2){
              //position_u = user_data_cat2[0].position;
              console.log("POS ", user_data_cat2[0].position);

            Cat.deleteOne({_id: req.query.catid}, function(err, user_data_cat){
              console.log("OK find user");
              if(err) return console.log(err);

              Cat.find({position: {$gte: user_data_cat2[0].position}}, function(err, count_new_cats){
                Cat.find({position: {$gte: user_data_cat2[0].position}}).count(function(err, count_users_c){
                  var i = 0;
                  var newcatmass = [];
                  newcatmass = count_new_cats;
                    for (var i = 0; i < count_users_c; i++) {

                      Cat.updateOne({_id: newcatmass[i]._id}, {position: newcatmass[i].position - 1}, function(err, docs){
                        if(err) return console.log(err);

                        console.log("Update position ", newcatmass);
                      });

                    console.log(i);
                    // ещё какие-то выражения
                    }
                  console.log(count_new_cats);
                    });
              });

              Cat.deleteMany({p_cat: req.query.catid}, function(err, del_data_cat){
                console.log("OK find user");
                if(err) return console.log(err);

                });
              //console.log("Not find user: ",catres);
              catres_data = [{
                status: "отвечаю cat!"
              }]
              res.send(catres_data);


               });
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

         Cat.find({user_id: user_data[0]._id, p_cat: {$ne: 0}}).count(function(err, results){

          if(results > 0){
            console.log(results);

             Cat.find({user_id: user_data[0]._id, p_cat: req.query.catidselected}, function(err, pod_cat){
                 console.log(pod_cat);
               catres_data = [{
                 status: "отвечаю cat!"
               }]
               res.send(pod_cat);

             });
             console.log("NOT FIND");
             //res.send([{st: "not"}]);
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

              Cat.find({user_id: user_data[0]._id, "position" : {"$exists" : true}}).count(function(err, cat){

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
     }else if(req.query.status == "addexpense"){

        addexpense();
     }else if(req.query.status == "getcat"){

        getscat();
     }else if(req.query.status == "getcatup"){

        getcatup();
     }else if(req.query.status == "getscatdown"){

        getscatdown();
     }else if(req.query.status == "getscatdelete"){

        getscatdelete();
     }else if(req.query.status == "getscatdeletePod"){

        getscatdeletePod();
     }else if(req.query.status == "getscatpod"){

        getscatpod();
     }else if(req.query.status == "getscatselectetnotp"){

        getscatselectetnotp();
     }else if(req.query.status == "getexpensesselect_cats"){

        getexpensesselect_cats();
     }else if(req.query.status == "getscataddp"){

        getscataddp();
     }else if(req.query.status == "getexpenses"){

        getexpenses();
     }else if(req.query.status == "getexpenses_pod"){

        getexpenses_pod();
     }else if(req.query.status == "getscatall"){

        getscatall();
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
