module.exports = {
    colors: [
        '#ff5252', // red
        '#26547C', // blue
        '#FFD166', // orange
        '#06D6A0', // green
        '#2E294E', // dark-blue
        '#5B5F97', // pink
        '#50514F'  // dark
    ],
    colorNum: 0,

    setUserColor: function(users) {
        if (this.colorNum <= 5)
            return this.colors[this.colorNum++];
        else
            this.colorNum = 0;
    },

    // checks to see if the username already exists
    checkIfUserExists: function (name, users) {
        return users.reduce(function(exists, item, index) {
            if (item.username === name)
                return true;
            return exists;
        }, false);
    },

    // gets the user based on the uid
    getUser: function (ip, users) {
        var user = users.filter(function(user) {
            return user.uid === ip;
        });
        return user[0];
    },

    // gets the user based on the name
    getUserByName: function (name, users) {
        var user = users.filter(function(user) {
            return user.username === name;
        });
        return user[0];
    },

    // helper function to give the other user's
    // the new message
    passMessageToOtherUsers: function (message, users) {
        users.forEach(function(u) {
            if (u.username != message.username)
                u.messages.push(message);
        });
    },

    // cleans up the ip for the users' uid
    getIpNum: function (ip) {
        ip = ip.split(":").join('');
        var tmp = ip.replace(/[a-zA-Z][a-zA-Z][a-zA-Z][a-zA-Z]/g, '')
            .split(".").join('');
        return tmp;
    },

    // checks to see if we can add a new
    // messageboard for the user, so only one
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
    },

    jsonToStr: function(j) {
        return JSON.stringify(j, null, 3);
    }
};
