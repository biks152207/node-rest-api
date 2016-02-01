var express = require('express');
var app = express(); // defined app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

mongoose.connect('mongodb://localhost/test');



// we need to configure app to use body parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var port = process.env.PORT || 8080;

// routes for api
var router = express.Router(); // get the instance of  the epxress router


router.use(function(req, res, next){
  next(); // next route
});

router.get('/', function(req, res){
  res.json({ message: 'hooray! welcome to our api'});
});


router.route('/bears')  //We will use Express’s router.route() to handle multiple routes for the same URI. 
  .post(function(req, res){
    var bear = new Bear();
    bear.name = req.body.name;

    bear.save(function(err){
      if(err)
        res.send(err);
      res.json({ message: 'Bear created!'});
    })
  })
  .get(function(req, res){
    Bear.find(function(err, bears){
      if (err)
        res.send(err);
      res.json(bears);
    });
  });

router.route('/bears/:bear_id')
  .get(function(req, res){
    Bear.findById(req.params.bear_id, function(err, data){
      if(err)
        res.send(err);
      res.json(data);
    });
  })
  .put(function(req, res){
    Bear.findById(req.params.bear_id, function(err, data){
      if (err)
          res.send(err);
      bear.name = req.body.name;  // update the bears info

      bear.save(function(err) {
          if (err)
              res.send(err);

          res.json({ message: 'Bear updated!' });
      });

    });
  })
  .delete(function(req, res) {
      Bear.remove({
          _id: req.params.bear_id
      }, function(err, bear) {
          if (err)
              res.send(err);

          res.json({ message: 'Successfully deleted' });
      });
  });

app.use('/api', router); // all the api is prefixed with /api


app.listen(port);

console.log('Server magic happening in ' + port);