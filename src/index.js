var express = require('express'),
    app = express(),
    path = require('path'),
    bodyparser = require('body-parser'),
    helper = require('./helper');

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyparser.json());

// global variabels
var users = [];

// user object
function User() {
    this.username;
    this.uid;
    this.usercolor;
    this.messages = [];
    this.privateMessageBoards = [];
    this.printuser = function() {
        return "[ username: " + this.username + ", uid: " + this.uid
                + ", usercolor: " + this.usercolor +
                " messageboards: " + this.privateMessageBoards + " ]";
    };
}

// message object
function Message() {
    this.text;
    this.username;
    this.usercolor;
    this.messageboard;
    this.getmessage = function() {
        return this;
    };
}

// creates the user and passes the frontend
// if the username is unique
app.post('/createUser', function(req, res) {
    var name = req.query.username;
    var u = new User();
    if (!helper.checkIfUserExists(name, users)) {
        u.username = name;
        u.uid = helper.getIpNum(req.ip);
        u.usercolor = helper.setUserColor(users);
        users.push(u);
        res.json( { "advance": '/messaging.html' } );
    }
    else
        res.json( { "advance": 'false' } );
});

// sends the message, also gives other users
// the message
app.post('/sendMessage', function(req, res) {
    var text = req.body.message;
    var messageboard = req.body.messageboard;
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    console.log(helper.jsonToStr(u));
    console.log(u.username);
    if (u.username != "") {
        var m = new Message();
        m.text = text;
        m.username = u.username;
        m.usercolor = u.usercolor;
        m.messageboard = messageboard;
        helper.passMessageToOtherUsers(m, users);

        res.json( m.getmessage() );
    }
});

// gets the user's messages and posts them
app.get('/getMessages', function(req, res) {
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    res.json(u.messages);
    u.messages = [];
});

app.post('/createPrivateChat', function(req, res) {
    var name = req.query.username;
    var u = helper.getUserByName(name, users);
    var u2 = helper.getUser(helper.getIpNum(req.ip), users);

    // don't want to start a private chat
    // with yourself
    if (u.username !== u2.username) {
        var addMB = helper.addMessageBoard(u.privateMessageBoards, name);
        if (addMB)
            u.privateMessageBoards.push(u2.username);
        res.json( { "created" : addMB });
    }
});

app.post('/getUsername', function(req, res) {
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    res.json({ "name": u.username });
});

app.get('/getPrivateChats', function(req, res) {
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    res.json(u.privateMessageBoards);
    u.privateMessageBoards = [];
    u.privMBCount = 0;
});

// gets all the users
app.get('/getUsers', function(req, res) {
    res.json(users);
});

app.post('/logout', function(req, res) {
    console.log("we made it");
});

app.listen(3000);
console.log("Application has started at: localhost:3000");
