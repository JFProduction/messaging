$(function() {
    $('.user-text').on('keyup', function(e) {
        if (e.which == 13) {
            sendMessage();
        }
    });

    $('#user-name').on('keyup', function(e) {
        if (e.which == 13) {
            createUser();
        }
    });
});

function cleanInput(input) {
	return "<div>" + input + "</div>";
}

function getMsgTime() {
    var date = new Date();
    return (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ":" 
                + (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + ":" 
                + (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds());
}
