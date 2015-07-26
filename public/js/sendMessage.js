$(document).ready(function() {
	$('#sendMessage').click(function() {
		sendMessage();
	});

	getMessages();
	getUsers();
	scrollToBottom();
	setInterval(scrollToBottom, 200);
	setInterval(getMessages, 2000);
	setInterval(getUsers, 5000);
});

function scrollToBottom() {
	$(".message-board").animate({ scrollTop: $('.message-board').height()}, 1000);
}

function sendMessage() {
	var message = $('.user-text').val();
	if (message != "") {
		$.ajax({
			url: '/sendMessage?message=' + $('.user-text').val(),
			type: "POST"
		}).done(function(message) {
			console.log(message);
			var text = "<div class='text-container'><div class='name' style='color: " + message.usercolor + "'>"
				+ message.username + ":</div><div class='text'>" + message.text + "</div></div>";
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
			var text = "<div class='text-container'><div class='name-grabbed' style='color: " + message.usercolor + "'>"
				+ message.username + ":</div><div class='text'>" + message.text + "</div></div>";
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
			$('#users').append("<li class='user' style='color: " + user.usercolor + "'>" + user.username + "</li>");
		});
	});
}
