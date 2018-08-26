// module.exports = function(app, db) {
//   app.post('/notes', (req, res) => {
//     const note = { text: req.body.body, title: req.body.title };
//     db.collection('notes').insert(note, (err, result) => {
//       if (err) {
//         res.send({ 'error': 'An error has occurred' });
//       } else {
//         res.send(result.ops[0]);
//       }
//     });
//   });
// };

//post send get otvet

// module.exports = function(app, db) {
//   app.post('/notes', (req, res) => {
//     console.log(req.body)
//     res.send('Hello')
//   });
// };




var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resourc');
});
// router.post('./send' function(req, res, next) {
//    res.send('respond with a resourc');
// });

module.exports = router;
