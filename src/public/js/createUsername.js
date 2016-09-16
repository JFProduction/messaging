$(function() {
	$('#login').click(function() {
		createUser();
	});
});

function createUser() {
	var uname = $('#user-name').val();

	if (uname.trim() !== "") {
		$.ajax({
			url: '/createUser?username=' + uname,
			type: "POST"
		}).done(function(advance) {
			if (advance.advance != 'false')
				window.location = advance.advance;
			else
				alert('You must choose a different username');
		});
	}
	else {
		alert('You must enter a username');
	}
}
