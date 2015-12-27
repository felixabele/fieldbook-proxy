// In Dev-mode start app with nodemon app.js
// read my logs: heroku logs --app fieldbook-proxy

var requestify  = require('requestify');
var express     = require('express');
var bodyParser  = require('body-parser');
var env         = require('node-env-file');

env(__dirname + '/.env');

var app = express();

var bookId = '567a78083b686803007b2d64';
var baseUrl = 'https://api.fieldbook.com/v1/' + bookId + '/guests';

var options = {
  headers: {
    'Accept': 'application/json'
  },
  auth: {
    username: process.env.KEY,
    password: process.env.PASSWORD
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {

  // TODO: make a domain whitelist
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
});

function about_me() {
  var host = server.address().address;
  var port = server.address().port;
  return('App listening at http://'+ host +':'+ port)
}

// --- Create guest
app.post('/', function (req, res) {

  // check for unique email
  requestify.get((baseUrl +'?email='+ req.body.email), options).then(function(response) {

    // create new Dataset
    if (response.getBody().length == 0) {
      requestify.post(baseUrl, req.body, options).then(function(response) {
        res.json(response.getBody())
      }).fail(function(error) {
        res.status(500).json(error.getBody())
      });

    } else {
      res.json({ error: 'duplicate' })
    }

  });
});

app.get('/', function (req, res) {
  guest_exists('perle@hoorzi.de')
  res.send(about_me());
});

var server = app.listen((process.env.PORT || 3000), function () {
  console.log(about_me());
});
