$(document).ready(function() {
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
