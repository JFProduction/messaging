var express = require('express'),
    app = express(),
    path = require('path'),
    helper = require('./helper');

// global variabels
var users = [];
var userCount = 0;

// user object
function User() {
    this.username;
    this.uid;
    this.usercolor;
    this.messages = [];
    this.messageCount;
    this.privateMessageBoards = [];
    this.privMBCount;
    this.printuser = function() {
        return "[ username: " + this.username + ", uid: " + this.uid
                + ", usercolor: " + this.usercolor +  " messageboards: " + this.privateMessageBoards + " ]";
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

app.use(express.static(path.join(__dirname,'public')));

// sends the message, also gives others users
// the message
app.post('/sendMessage', function(req, res) {
    var text = req.query.message;
    var messageboard = req.query.messageboard;
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    
    // TODO: need to figure out the private message issue....
    
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
    u.messageCount = 0;
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
        users[userCount++] = u;
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
        if (addMB) {
            u.privateMessageBoards[u.privMBCount++] = u2.username;
            u2.privateMessageBoards[u2.privMBCount++] = name;
        }
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
