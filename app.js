// In Dev-mode start app with nodemon app.js
// read my logs: heroku logs --app fieldbook-proxy

var requestify  = require('requestify');
var express     = require('express');
var bodyParser  = require('body-parser');
var env         = require('node-env-file');

env(__dirname + '/.env', {raise: false});

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
  if (req.method == 'POST') {
    if ((req.headers.origin) && (req.headers.origin.match(/localhost|franziundfelix/))) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    } else {
      res.status(500).json({error: 'not allowed'})
    }
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

    existing_ds = response.getBody();

    // create new Dataset
    if (existing_ds.length == 0) {
      requestify.post(baseUrl, req.body, options).then(function(response) {
        res.json({
          action: 'new',
          data: response.getBody()
        })
      }).fail(function(error) {
        res.status(500).json({
          action: 'new',
          data: error.getBody()
        })
      });

    // update Dataset
    } else {
      options.method = 'PATCH';
      options.body = req.body;
      requestify.request((baseUrl +'/'+ existing_ds[0].id), options).then(function(response) {
        console.log('updated', response.getBody())
        res.json({
          action: 'update',
          data: response.getBody()
        })
      }).fail(function(error) {
        console.log('error', error.getBody())
        res.status(500).json({
          action: 'update',
          data: error.getBody()
        })
      });

      //res.json({ error: 'duplicate', duplicate: existing_ds[0] })
    }

  });
});

app.get('/', function (req, res) {
  res.send(about_me());
});

var server = app.listen((process.env.PORT || 3000), function () {
  console.log(about_me());
});
