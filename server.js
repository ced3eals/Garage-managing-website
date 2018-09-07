var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var vm = require('vm');
var sessions = require('express-session');
var jsonFile = require('jsonfile');

var session;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(sessions({
  secret: 'test'
}))
app.use('/public', express.static('public'));
// Parse mail and password
var contenu;
contenu = fs.readFileSync("./storage/account.json", "UTF-8");
var js = JSON.parse(contenu);

app.get('/login', function (req,resp){
  session = req.session;
  if (session.uniqueID) {
    resp.redirect('/redirects');
  }

  resp.sendFile(__dirname + '/views/signin.html');
  //resp.sendFile('./public/contact.html',{root:__dirname});

});
//Sign up
app.get('/signup', function(req,resp){
  resp.sendFile('./src/signUp.html',{root:__dirname});
})

//Login test
app.post('/login', function (req,resp){
  //resp.end(JSON.stringify(req.body));
  var contenu;
  contenu = fs.readFileSync("./storage/account.json", "UTF-8");
  var js = JSON.parse(contenu);
  session = req.session;
  if (session.uniqueID) {
    resp.redirect('/redirects');
  }
  for(var i = 0; i<js.length; i++){
  if(req.body.email == js[i].email && req.body.password == js[i].password){
    session.uniqueID = req.body.email;
  }
  }
  resp.redirect('/redirects');
});

app.post('/logout', function(req,resp){
  req.session.destroy(function(error){
    console.log(error);
    resp.redirect('/login');
  });
});
app.get('/redirects', function(req,resp){
  session = req.session;
  if (session.uniqueID) {
    resp.sendFile('./src/contact.html',{root:__dirname});
  }
  else {
    resp.sendFile(__dirname + '/views/signin.html');
  }
})
app.post('/createAccount', function(req,resp){ //Post Response
  var mail = req.body.email;
  var password = req.body.password;

   try {
        let userData = fs.readFileSync('./storage/account.json');
        userData = JSON.parse(userData);
        userData.push({
           email:mail,
           password:password
        });
        fs.writeFileSync('./storage/account.json', JSON.stringify(userData,null,2));
    } catch (error) {
        console.log(error);
    }
  resp.sendFile('./src/contact.html',{root:__dirname});
});

app.post('/', function(req,resp){ //Post Response
  var familyName = req.body.familyName;
  var name = req.body.name;
  var promotion = req.body.promotion;
  var mail = req.body.email;
  var events = req.body.event;

   try {
        let userData = fs.readFileSync('./storage/attendants.json');
        userData = JSON.parse(userData);
        userData.push({
           FamilyName:familyName,
           Name:name,
           promotion:promotion,
           email:mail,
           events:events
        });
        fs.writeFileSync('./storage/attendants.json', JSON.stringify(userData,null,2));
    } catch (error) {
        console.log(error);
    }
  resp.sendFile('./src/contact.html',{root:__dirname});
});


app.listen(3000,function(){
  console.log('Listening at port 3000');
})