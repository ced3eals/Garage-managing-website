var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');


var app = express();
var session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(sessions({
  secret: 'uinjmiomlnôpùçiyè_yoiulhnkj',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('public/sign_in.html', {root: __dirname});
});

app.post('login', function(req, res){
  res.end(JSON.stringify(req.body));
  if(req.body.email == 'admin' && req.body.password =='admin'){
    session.id = req.body.username;
  }
  res.redirect('/redirects');
});


app.get('/redirects', function (req, resp){
  if (session.id){
    resp.redirect('admin');
  } else {
    resp.end('Who are you ?');
  }
});


var server = app.listen(process.env.PORT || 5000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('I am listening at http://%s:%s', host, port);

});
