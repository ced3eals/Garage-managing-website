var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.static('views'));


app.use('/', function (req, res, next) {

  var options = {
    root: __dirname + '/public/',

    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile('./error.html', options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', './error.html');
    }
  });

});

var server = app.listen(process.env.PORT || 5000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('I am listening at http://%s:%s', host, port);

});
