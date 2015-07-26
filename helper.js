// palette of colors for usernames
var colors = [
    '#FF0000',  // red
    '#0900FF', // blue
    '#FF9700', // orange
    '#04A910', // green
    '#000000', // yellow
    '#FF00EA', // pink
    '#A77878'  // idk
]

var colorNum = 0;

module.exports = {
    setUserColor: function(users) {
        if (colorNum <= 5)
            return colors[colorNum++];
        else
            colorNum = 0;
    },

    //checks to see if the username already exists
    checkIfUserExists: function (name, users) {
        var exists = false;
        users.forEach(function(user){
            if (user.username === name)
                exists = true;
        });
        return exists;
    },

    // gets the user based on the uid
    getUser: function (ip, users) {
        console.log("in getUser");
        var u;
        users.forEach(function(user) {
            if (user.uid === ip)
                u = user;
        });
        console.log(u.printuser());
        return u;
    },

    // helper function to give the other user's
    // the new message
    passMessageToOtherUsers: function (message, users) {
        users.forEach(function(u) {
            if (u.username != message.username)
                u.messages[u.messageCount++] = message;
        });
    },

    // cleans up the ip for the users' uid
    getIpNum: function (ip) {
        ip = ip.split(":").join('');
        var tmp = ip.replace(/[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]/, '').split(".").join('');
        return tmp;
    }
};
