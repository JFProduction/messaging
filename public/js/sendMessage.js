// var colors = {
// 	'#FF0000', // red
// 	'#0900FF', // blue
// 	'#FF9700', // orange
// 	'#00FF13'  // green
// }

$(document).ready(function() {
	$('#sendMessage').click(function() {
		sendMessage();
	});

	getMessages();
	getUsers();
	// setInterval(getMessages, 10);
	// setInterval(getUsers, 5000);
});

function sendMessage() {
	var message = $('.user-text').val();
	if (message != "") {
		$.ajax({
			url: '/sendMessage?message=' + $('.user-text').val(),
			type: "POST"
		}).done(function(message) {
			console.log(message);
			var text = "<div class='name'>" + message.username
				+ "</div><div class='text'>" + message.text + "</div>";
			$('.message-board').append(text);
			$('.user-text').val('');
		});
	}
}

function getMessages() {
	$.ajax({
		url: '/getMessages',
		type: "GET"
	}).done(function(messages) {
		messages.forEach(function(message) {
			var text = "<div class='name-grabbed'>" + message.username
				+ "</div><div class='text-grabbed'>" + message.text + "</div>";
			$('.message-board').append(text);
		});
	});
}

function getUsers() {
	$.ajax({
		url: '/getUsers',
		type: "GET"
	}).done(function(users) {
		$('#users').html("<div class='users-label'>Online:</div>");
		users.forEach(function(user) {
			$('#users').append("<li class='user'>" + user.username + "</li>");
		});
	});
}
