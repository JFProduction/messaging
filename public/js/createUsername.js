$(document).ready(function() {
	$('#login').click(function() {
		createUser();
	});
});

function createUser() {
	$.ajax({
		url: '/createUser?username=' + $('#user-name').val(),
		type: "POST"
	}).done(function(advance) {
		if (advance.advance) 
			window.location = '/messaging.html';
		else
			alert('You must choose a different username');
	});
}