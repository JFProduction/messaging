var express = require('express'),
    app = express(),
    path = require('path'),
    helper = require('./helper');

// global variabels
var users = [];
var userCount = 0;

// user object
function user() {
    this.username = "";
    this.uid = 0;
    this.usercolor = "";
    this.messages = [];
    this.messageCount = 0;
    this.privateMessageBoards = [];
    this.privMBCount = 0;
    this.printuser = function() {
        return "[ username: " + this.username + ", uid: " + this.uid
                + ", usercolor: " + this.usercolor +  " messageboards: " + this.privateMessageBoards + " ]";
    };
}

// message object
function message() {
    this.text = "";
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
    var input = req.query.message.split("|");
    var messageboard = input[1];
    var text = input[0];
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    console.log("u after getting: " + u.printuser());
    if (u.username != "") {
        var m = new message();
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

// creates the user and passes the frontend
// if the username is unique
app.post('/createUser', function(req, res) {
    var name = req.query.username;
    var u = new user();
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
    var messageboard = req.query.username;
    var u = helper.getUserByName(messageboard, users);
    var addMB = helper.addMessageBoard(u.privateMessageBoards, messageboard);

    if (addMB)
        u.privateMessageBoards[u.privMBCount++] = messageboard;
});

app.post('/getPrivateChats', function(req, res) {
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    console.log(u.privateMessageBoards);
    return u.privateMessageBoards;
});

// gets all the users
app.get('/getUsers', function(req, res) {
    res.json(users);
});


// gets the user's messages and posts them
app.get('/getMessages', function(req, res) {
    var u = helper.getUser(helper.getIpNum(req.ip), users);
    res.json(u.messages);
    u.messages = [];
    u.messageCount = 0;
});

app.listen(process.env.PORT || 8080);
console.log("Application has started at: localhost:8080");
