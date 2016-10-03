// palette of colors for usernames
var colors = [
    '#ff5252', // red
    '#26547C', // blue
    '#FFD166', // orange
    '#06D6A0', // green
    '#2E294E', // dark-blue
    '#5B5F97', // pink
    '#50514F'  // dark
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
        return users.reduce(function(all, item) {
            if (item.username === name)
                all = true;
            return all;
        }, false);
    },

    // gets the user based on the uid
    getUser: function (ip, users) {
        return users.reduce(function(all, item) {
            if (item.uid === ip)
                all = item;
            return all;
        }, {});
    },

    // gets the user based on the name
    getUserByName: function (name, users) {
        return users.reduce(function(all, item) {
            if (item.username === name)
                all = item;
            return all;
        }, {});
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
        var tmp = ip.replace(/[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]/g, '').split(".").join('');
        return tmp;
    },

    // checks to see if we can add a new
    // messageboard for the user so only one
    // messageboard per username combo
    addMessageBoard: function(mbs, mb) {
        console.log(mb);
        var add = true;
        if (mbs.length > 0) {
            mbs.forEach(function(m) {
                if (m != mb)
                    add = true;
                else
                    add = false;
            });
        }
        return add;
    }
};
