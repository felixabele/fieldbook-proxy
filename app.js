// In Dev-mode start app with nodemon app.js

var requestify  = require('requestify');
var express     = require('express');
var bodyParser  = require('body-parser')

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


// --- Create guest
app.post('/', function (req, res) {
  requestify.post(baseUrl, req.body, options).then(function(response) {
    res.json(response.getBody())
  }).fail(function(error) {
    res.status(500).json(error.getBody())
  });
});

app.get('/', function (req, res) {
  res.json({text: 'Hello Fieldbook'})
});

var server = app.listen((process.env.PORT || 3000), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
