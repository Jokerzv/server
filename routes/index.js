var express = require('express');
var router = express.Router();
//db.collection('notes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// // routes/index.js
// const noteRoutes = require('./note_routes');
// module.exports = function(app, db) {
//   noteRoutes(app, db);
//   // Тут, позже, будут и другие обработчики маршрутов
// };
