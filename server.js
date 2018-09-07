var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');


var app = express();
var session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: 'uinjmiomlnôpùçiyè_yoiulhnkj'
}))

app.use(express.static('public'));

app.get('/sign_in', function (req, res) {
  res.sendFile('./public/index.html', {root: __dirname});
});

app.post('login', function(req, res){
  resp.end(JSON.stringify

var server = app.listen(process.env.PORT || 5000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('I am listening at http://%s:%s', host, port);

});
