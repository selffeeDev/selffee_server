var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/main', require('./main'));
router.use('/recipe', require('./recipe'));
router.use('/search', require('./search'));
router.use('/users', require('./users'));

module.exports = router;
