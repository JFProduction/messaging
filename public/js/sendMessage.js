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
			var text = "<div class='text-container'><div class='name'>" + message.username + ":</div><div class='text'>" + message.text + "</div></div>";
			// var text = "<div class='text-container'><div class='text'>" + message.text + "</div></div><div class='name'>" + message.username
			// 	+ "</div>";
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
			var text = "<div class='text-container'><div class='name-grabbed'>" + message.username + ":</div><div class='text'>" + message.text + "</div></div>";
			// var text = "<div class='text'>" + message.text + "</div></div><div class='text-container'><div class='name-grabbed'>" + message.username
			// 	+ "</div>";
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
