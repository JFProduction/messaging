var express = require('express'),
    app = express(),
    request = require('request'),
    path = require('path');

var users = [];
var messages = [];
var messageCount = 0;
var userCount = 0;

app.use(express.static(path.join(__dirname,'public')));

// sends the message
app.post('/sendMessage', function(req, res) {
    var input = req.query.message;
    var u = getUser(getIpNum(req.ip));
    console.log("u after getting: " + u.printuser());
    if (u.username != "") {
        var m = new message();
        m.text = input;
        m.username = u.username;
        console.log(m.getmessage());
        messages[messageCount++] = m.getmessage();
        res.json( m.getmessage() );
    }
});

// creates the user and passes the frontend
// if the username is unique
app.post('/createUser', function(req, res) {
    var name = req.query.username;
    var u = new user();
    if (!checkIfUserExists(name)) {
        u.username = name;
        u.ip = getIpNum(req.ip);
        users[userCount++] = u;
        res.json( { "advance": true } );
    }
    else
        res.json( { "advance": false } );
});

// gets all the users
app.get('/getUsers', function(req, res) {
    res.json(users);
});


// gets the messages and posts them for everyone
app.get('/getMessages', function(req, res) {
    if (messages.length >= 1) {
        res.json(messages);
        messages = [];
        messageCount = 0;
    }
});

// checks to see if the username already exists
function checkIfUserExists(name) {
    var exists = false;
    users.forEach(function(user){
        if (user.username === name)
            exists = true;
    });
    return exists;
}

function getUser(ip) {
    console.log("in getUser");
    var u;
    users.forEach(function(user) {
        if (user.ip === ip)
            u = user;
    });
    console.log(u.printuser());
    return u;
}

function getIpNum(ip) {
    ip = ip.split(":").join('');
    var tmp = ip.replace(/[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]/, '')
        .split(".").join('');
    return tmp;
}

function user() {
    this.username = "";
    this.ip = 0;
    this.printuser = function() {
        return "username: " + this.username + ", ip: " + this.ip
            + ", usernum: " + this.userNum;
    };
}

function message() {
    this.text = "";
    this.username;
    this.getmessage = function() {
        return this;
    };
}

app.listen(process.env.PORT || 8080);
console.log("Application has started at: localhost:8080");
