var express = require('express'),
    app = express(),
    path = require('path'),
    helper = require('./helper');

app.use(express.static(path.join(__dirname,'public')));

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

// sends the message, also gives others users
// the message
app.post('/sendMessage', function(req, res) {
    var text = req.query.message;
    var messageboard = req.query.messageboard;
    var u = helper.getUser(helper.getIpNum(req.ip), users);

    if (u.username != "") {
        var m = new Message();
        m.text = text;
        m.username = u.username;
        m.usercolor = u.usercolor;
        m.messageboard = messageboard;
        helper.passMessageToOtherUsers(m, users);

        // so the message appears on
        // the user's screen
        res.json( m.getmessage() );
    }
});

// gets the user's messages and posts them
app.get('/getMessages', function(req, res) {
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    res.json(u.messages);
    u.messages = [];
});

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

app.listen(8080);
console.log("Application has started at: localhost:8080");
