var messageBoard = 'main-chat';

$(document).ready(function() {
	$('#sendMessage').click(function() {
		sendMessage();
	});

	getMessages();
	getUsers();
	setInterval(scrollToBottom, 200);
	setInterval(getMessages, 2000);
	setInterval(getUsers, 5000);
	setInterval(getPrivateChats, 5000);
});

function scrollToBottom() {
	$(".message-board").animate({
		scrollTop: $('#' + messageBoard).height()
	}, 1000);
}

function sendMessage() {
	var message = $('.user-text').val();
	console.log(messageBoard);
	if (message != "") {
		$.ajax({
			url: '/sendMessage?message=' + message,
			type: "POST"
		}).done(function(message) {
			console.log(message);
			var text = "<div class='text-container'><div class='name' style='color: " + message.usercolor + "'>"
				+ message.username + ":</div><div class='text'>" + message.text + "</div></div>";
			$('#' + messageBoard).append(text);
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
			console.log("inside getMessages MB:" + message.messageboard);
			var text = "<div class='text-container'><div class='name-grabbed' style='color: " + message.usercolor + "'>"
				+ message.username + ":</div><div class='text'>" + message.text + "</div></div>";
			$('#' + message.username).append(text);
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
			$('#users').append("<li class='user'><a onclick='createPrivateChat(\"" + user.username + "\")' class='a-user' style='color: "
				+ user.usercolor + "' tytle='Chat privately with: " + user.username + "'>" + user.username + "</a></li>");
		});
	});
}

function createPrivateChat(name) {
	$.ajax({
		url: '/createPrivateChat?username=' + name,
		type: "POST"
	}).done(function(created) {
		if (created == 'true') {
			$('.tabs').append("<div id='" + name + "_pc'><a href='#" + name + "' onclick='changeChat(\"" + name + "-chat\")'>PC " + name + "</a>"
				+ "<div class='message-board' id='" + name + "-chat'></div></div>");
			changeChat(user.username);
		}
		else {
			alert('User ' + name + 'is not active.');
		}
	});
}

function getPrivateChats() {
	$.ajax({
		url: '/getPrivateChats',
		type: "GET"
	}).done(function(messageboards) {
		if (messageboards.length > 0) {
			messageboards.forEach(function(name) {
				$('.tabs').append("<div id='" + name + "_pc'><a href='#" + name + "' onclick='changeChat(\"" + name + "-chat\")'>PC " + name + "</a>"
					+ "<div class='message-board' id='" + name + "-chat'></div></div>");
			});
		}
	});
}

function changeChat(chat) {
	messageBoard = chat;
	console.log(messageBoard);
}
